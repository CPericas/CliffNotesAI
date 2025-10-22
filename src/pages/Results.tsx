import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRecentSummaries } from "../hooks/useRecentSummaries";


export default function Results() {
    const navigate = useNavigate();
    const location = useLocation();
    const articleText = location.state?.article || "";
    const [summary, setSummary] = useState("Loading summary...");
    const { quotes } = location.state || { quotes: [] };
    const { addSummary } = useRecentSummaries();

    useEffect(() => {
        const summarizeArticle = async () => {
            try {
                const res = await fetch("http://127.0.0.1:5000/summarize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ article: articleText }),
                });
                const data = await res.json();
                const finalSummary = data.summary || data.error;
                setSummary(finalSummary);

                addSummary({
                    source: articleText.slice(0, 80) + "...",
                    summary: finalSummary,
                    quotes: quotes,
                });
            } catch {
                setSummary("Error generating summary");
            }
        };
        summarizeArticle();
    }, [articleText]);
    

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="mb-4 text-center">Summary</h1>

                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Card.Text>{summary || "No summary available"}</Card.Text>
                            </Card.Body>
                        </Card>

                        <h3>Quotes</h3>
                        <ListGroup className="mb-4">
                        {quotes && quotes.length > 0 ? (
                            quotes.map((q, idx) => (
                            <ListGroup.Item key={idx}>
                                {q.speaker ? (
                                <strong>{q.speaker}: </strong>
                                ) : null}
                                “{q.quote}”
                            </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>No quotes available</ListGroup.Item>
                        )}
                        </ListGroup>

                        <div className="d-flex justify-content-between">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-flex justify-content-between">
                                <Button variant="primary" onClick={() => navigate(-1)}>
                                    Back
                                </Button>
                            </motion.div>
                                
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-flex justify-content-between">
                                <Button variant="secondary" onClick={() => alert("Export functionality will be here")}>
                                    Export
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
}