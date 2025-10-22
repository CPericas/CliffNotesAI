from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import newspaper
import re
import spacy

app = Flask(__name__)
CORS(app)

# Load summarization model once on startup
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Load lightweight English NLP model for quote-speaker detection
nlp = spacy.load("en_core_web_sm")

TOKEN_LIMIT = 4000


@app.route("/fetch_url", methods=["POST"])
def fetch_url():
    data = request.get_json()
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        article = newspaper.Article(url)
        article.download()
        article.parse()
        text = article.text.strip()

        if not text:
            return jsonify({"error": "Could not extract article text."}), 400

        words = text.split()
        if len(words) > TOKEN_LIMIT:
            text = " ".join(words[:TOKEN_LIMIT])

        return jsonify({"article": text})

    except Exception as e:
        return jsonify({"error": f"Failed to fetch article: {str(e)}"}), 500


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    article = data.get("article", "")

    if not article.strip():
        return jsonify({"error": "No article text provided"}), 400

    words = article.split()
    if len(words) > TOKEN_LIMIT:
        article = " ".join(words[:TOKEN_LIMIT])

    # Split into chunks that fit within model’s limit (~800 words per chunk)
    word_chunks = []
    chunk_size = 700
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        word_chunks.append(chunk)

    summaries = []
    try:
        for chunk in word_chunks:
            summary_piece = summarizer(chunk, max_length=150, min_length=30, do_sample=False)
            summaries.append(summary_piece[0]["summary_text"])
    except Exception as e:
        return jsonify({"error": f"Summarization failed: {str(e)}"}), 500

    full_summary = " ".join(summaries)

    return jsonify({
        "summary": full_summary,
        "quotes": []  # placeholder until we add extraction logic
    })


@app.route("/extract_quotes", methods=["POST"])
def extract_quotes():
    """
    Extracts direct quotations (“...”) and attributes them to speakers if possible.
    """
    data = request.get_json()
    article = data.get("article", "").strip()

    if not article:
        return jsonify({"error": "No article text provided"}), 400

    # Find all quoted segments (handles both “ and ")
    raw_quotes = re.findall(r'“([^”]+)”|\"([^\"]+)\"', article)
    quotes = [q[0] or q[1] for q in raw_quotes if (q[0] or q[1])]

    results = []

    # Process article with spaCy for named entity + dependency analysis
    doc = nlp(article)

    for quote in quotes:
        # Find where this quote occurs
        idx = article.find(quote)
        context_start = max(0, idx - 150)
        context = article[context_start:idx]

        # Use NLP to detect nearby speaker
        speaker = None
        context_doc = nlp(context)
        for ent in context_doc.ents:
            if ent.label_ == "PERSON":
                speaker = ent.text

        # Look for verbs like "said", "told", etc. near speaker name
        if speaker:
            for token in context_doc:
                if token.text.lower() in ["said", "told", "stated", "added", "explained"]:
                    break
            else:
                speaker = None  # Drop speaker if no speech verb nearby

        # Skip short fragments
        if len(quote.split()) < 3:
            continue

        results.append({
            "quote": quote.strip(),
            "speaker": speaker
        })

    if not results:
        return jsonify({"quotes": [], "message": "No quotes found."})

    return jsonify({"quotes": results})


if __name__ == "__main__":
    app.run(debug=True)


