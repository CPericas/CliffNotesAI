import { useRecentSummaries } from "../hooks/useRecentSummaries";
import { Card, ListGroup } from "react-bootstrap";

function RecentSummariesList() {
  const { recentSummaries, clearSummaries } = useRecentSummaries();

  return (
    <Card className="mt-5 shadow-sm">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Summaries</h5>
          <button className="btn btn-sm btn-outline-danger" onClick={clearSummaries}>
            Clear
          </button>
        </div>
      </Card.Header>
      <ListGroup variant="flush">
        {recentSummaries.length > 0 ? (
          recentSummaries.map((s) => (
            <ListGroup.Item key={s.id}>
              <strong>{s.source}</strong>
              <div className="small text-muted">{new Date(s.date).toLocaleString()}</div>
              <p>{s.summary.slice(0, 150)}...</p>
              {s.quotes.length > 0 && (
                <ul>
                  {s.quotes.map((q, i) => (
                    <li key={i}>
                      {q.speaker ? `${q.speaker}: ` : ""}
                      “{q.quote}”
                    </li>
                  ))}
                </ul>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No recent summaries yet.</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
}

export default RecentSummariesList;
