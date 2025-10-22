import { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion, scale } from "framer-motion";

export default function InputArticle() {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

const handleSummarize = async () => {
    let articleText = text.trim();

    if (loading) return;
    setLoading(true);

    // If URL is provided, fetch article text
    if (url.trim()) {
        try {
            const fetchResponse = await fetch("http://127.0.0.1:5000/fetch_url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });
            const fetchData = await fetchResponse.json();
            if (!fetchResponse.ok || !fetchData.article) {
                alert(fetchData.error || "Error fetching article from URL");
                setLoading(false);
                return;
            }
            articleText = fetchData.article;
        } catch (err) {
            console.error("Error fetching article:", err);
            alert("Failed to fetch article from URL");
            setLoading(false);
            return;
        }
    }

    if (!articleText) {
        alert("Please enter article text or a valid URL.");
        setLoading(false);
        return;
    }

    try {
        // Step 1: Summarize
        const summarizeRes = await fetch("http://127.0.0.1:5000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ article: articleText }),
        });
        const summarizeData = await summarizeRes.json();
        if (!summarizeRes.ok) throw new Error(summarizeData.error || "Error summarizing article");

        // Step 2: Extract Quotes
        const quoteRes = await fetch("http://127.0.0.1:5000/extract_quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ article: articleText }),
        });
        const quoteData = await quoteRes.json();
        const quotes = quoteData.quotes || [];

        // Step 3: Navigate to results
        navigate("/results", {
            state: {
                article: articleText,
                summary: summarizeData.summary,
                quotes: quotes
            }
        });

    } catch (err) {
        console.error("Summarization or quote extraction failed:", err);
        alert("Error processing article.");
    }

    setLoading(false);
};

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="mb-4 text-center">Input the article to Summarize</h1>

                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label>Paste Article Text</Form.Label>
                                <Form.Text muted>
                                    Max input length: ~4,000 words
                                </Form.Text>
                                <Form.Control
                                    as="textarea"
                                    rows={10}
                                    placeholder="Paste article here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </Form.Group>

                            <div className="text-center mb-3">— OR —</div>

                            <Form.Group className="mb-4">
                                <Form.Label>Paste Article URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="https://example.com/article"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </Form.Group>

                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                className="text-center"
                            >
                                <Button 
                                    className="mb-3"
                                    variant="primary" 
                                    size="lg" 
                                    onClick={handleSummarize} 
                                    disabled={loading}
                                >
                                    {loading ? "Summarizing..." : "Summarize"}
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-center"
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        navigate("/RecentSummariesList")
                                    }
                                >
                                    View Recent Summaries
                                </Button>
                            </motion.div>

                        </Form>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
}
