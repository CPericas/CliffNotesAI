# 🧠 CliffNotes AI — Progress Tracker (Building In Progress)

### CliffNotes AI is a lightweight web application that summarizes articles, extracts quotes with contextual speaker attribution, and tracks recent summaries locally. The app combines a React TypeScript frontend with a Flask backend, leveraging HuggingFace Transformers for summarization and spaCy/Newspaper3k for text extraction.

# Features

Article Input: Paste text directly or provide a URL.

Summarization: Chunked summarization (~700 words per chunk) using facebook/bart-large-cnn.

Quote Extraction: Detects quotes and attempts speaker attribution contextually using regex + spaCy.

Recent Summaries: Stores last 5 summaries in localStorage with date, source, summary, and quotes.

Results Display: Summary and quotes rendered in a Bootstrap ListGroup with speaker labels.

Navigation: Home → InputArticle → Results → RecentSummariesList.

Planned Enhancements: Export as PDF/Markdown, copy-to-clipboard, demo articles, dark mode, key quote highlighting.

Tech Stack

Frontend: React + TypeScript, Vite, Bootstrap, React-Bootstrap, Framer Motion, Axios.

Backend: Python, Flask, Flask-CORS, HuggingFace Transformers, spaCy, Newspaper3k, Torch.

Storage: Browser localStorage for recent summaries.

Project Structure
CliffNotesAI/
│
├─ notesBackend/           
│   ├─ app.py
│   ├─ requirements.txt
│   └─ venv/               
│
├─ src/                    
│   ├─ pages/
│   │   ├─ Home.tsx
│   │   ├─ InputArticle.tsx
│   │   ├─ Results.tsx
│   │   └─ RecentSummariesList.tsx
│   ├─ hooks/
│   │   └─ useRecentSummaries.tsx
│   └─ App.tsx
│
├─ public/
├─ package.json
├─ vite.config.ts
└─ .gitignore

# Installation

Clone the repository

git clone <repo-url>
cd CliffNotesAI


Setup backend

cd notesBackend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt


Setup frontend

cd ..
npm install
npm run dev


Run backend

cd notesBackend
venv\Scripts\activate   # Windows
flask run


The frontend will connect to http://127.0.0.1:5000 for API requests.

# Usage

Open the app in your browser.

Paste an article or provide a URL (max 4,000 words).

Click Summarize to generate a summary and extract quotes.

View the summary and quotes on the Results page.

Recent summaries are accessible from the Recent Summaries link.

# Notes & Constraints

Max article length: 4,000 words.

LocalStorage only keeps the last 5 summaries.
