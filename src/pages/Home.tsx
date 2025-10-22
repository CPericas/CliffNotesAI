import { motion } from "framer-motion";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/InputArticle");
  };

  return (
    <Container className="py-5">
      {/*Hero Section */}
      <Row className="justify-content-center mb-4">
        <Col md={10} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4">CliffNotes AI SaaS Starter Kit  </h1>
            <h2 className="mb-4">Local-Only, No API Costs.</h2>
            <p className="lead">Fully working MVP built with React and a local AI summarizer powered by Hugging Face’s BART model</p>


            
            {/* Demo video */}
            <div className="ratio ratio-16x9 border rounded shadow-sm mb-4">
                <video controls>
                  <source src="null" type="video/mp4" /> 
                  Your browser does not support the video tag.
                </video>
            </div>
            

            {/* CTA #1 */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="primary" size="lg" onClick={handleStart}>
                Try It Now
                </Button>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      {/* How It Works Section */}
      <Row className="justify-content-center mt-5">
        <Col md={10} lg={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2>How It Works</h2>
            <p className="text-muted">Step-by-step overview of the summarization process will go here.</p>

            {/* Placeholder for App Screenshot or Steps */}
            <Row className="text-center mt-4">{/* Add components/cards here */}</Row>

            {/* CTA #2 */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
              <Button variant="success" size="lg" onClick={handleStart}>
                Get Started Now
              </Button>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      <footer className="text-center text-muted mt-5">
        <small>© 2025 CliffNotes AI MVP — Built by Chris Pericas</small>
      </footer>
    </Container>
  );
}