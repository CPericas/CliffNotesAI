import { useState, useEffect } from "react";

export interface SummaryEntry {
    id: string;
    source: string;
    summary: string;
    quotes: {quote: string; speaker?: string | null } [];
    date: string;
}

export function useRecentSummaries() {
    const [recentSummaries, setRecentSummaries] = useState<SummaryEntry[]>(() => {
        const stored = localStorage.getItem("recentSummaries");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("recentSummaries", JSON.stringify(recentSummaries));
    }, [recentSummaries]);

    const addSummary = (entry: Omit<SummaryEntry, "id" | "date">) => {
        const newEntry: SummaryEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            ...entry,
        };
        setRecentSummaries((prev) => {
            const updated = [newEntry, ...prev];
            return updated.slice(0, 5);
        });
    };

    const clearSummaries = () => setRecentSummaries([]);

    return { recentSummaries, addSummary, clearSummaries };
}