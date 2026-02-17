import { useEffect, useState } from "react";
import "../styles/CommentPage.css";
import DOMPurify from "dompurify";

export default function CommentPage({ apiKey, userNickname }) {
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [issubmitting, setIsSubmitting] = useState(false); // Stato per il salvataggio
    const [error, setError] = useState("");
    const [category, setCategory] = useState("");

    const categories = [
        "methodological concerns",
        "figure anomalies",
        "clarification",
        "data validity",
        "ethical issues",
        "external link"
    ];

    const fetchComment = async () => {
        if (!apiKey) return;
        setLoading(true);
        setError("");
        setCategory("");
        try {
            const res = await fetch(
                "https://pubpeerclassifierapi.onrender.com/api/comments/random/1",
                { headers: { "x-api-key": apiKey } }
            );
            if (!res.ok) throw new Error(`Errore caricamento: ${res.status}`);
            const data = await res.json();
            setComment(data && data.length > 0 ? data[0] : null);
        } catch (err) {
            setError("Errore durante il caricamento.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComment(); }, [apiKey]);

    const handleClassify = async () => {
        // Verifichiamo quale ID è disponibile nel commento
        const actualId = comment.comment_id || comment.id || comment._id;

        if (!category || !actualId) {
            console.error("❌ Manca l'ID del commento o la categoria!", { actualId, category });
            alert("Errore: ID commento non trovato.");
            return;
        }

        const requestUrl = `https://pubpeerclassifierapi.onrender.com/api/comments/classify/${actualId}`;
        const payload = {
            category: category,
            user: userNickname
        };

        // DEBUG LOG AGGIORNATO
        console.log("🚀 INVIO CLASSIFICAZIONE A ID:", actualId);

        setIsSubmitting(true);
        try {
            const res = await fetch(requestUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Errore server: ${res.status}`);
            }

            console.log("✅ SUCCESSO!");
            fetchComment();
        } catch (err) {
            console.error("🕵️ DETTAGLI:", err);
            alert(`Errore: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="comment-page-container">
            <div className="blob b-light-1"></div>
            <div className="blob b-light-2"></div>
            <div className="blob b-light-3"></div>

            <div className="comment-main-card">
                {loading ? (
                    <div className="status-msg">
                        <div className="spinner"></div>
                        <p>Cercando un commento...</p>
                    </div>
                ) : error ? (
                    <div className="status-msg error">
                        <p>{error}</p>
                        <button onClick={fetchComment} className="retry-btn">Riprova</button>
                    </div>
                ) : comment ? (
                    <>
                        <div className="card-header">
                            <div className="header-top">
                                <div className="badge main-badge">PubPeer Analysis</div>
                                <div className={`badge author-badge ${comment.is_from_author ? 'is-author' : 'is-peer'}`}>
                                    {comment.is_from_author ? "🖋️ Author" : "🔍 Independent Peer"}
                                </div>
                            </div>
                            <h2>Classifica il contenuto</h2>
                        </div>

                        <div
                            className={`comment-content-box ${comment.is_from_author ? 'author-style' : ''}`}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(comment.comment_content, {
                                    ADD_ATTR: ['target'] // Permette l'attributo target se presente
                                })
                            }}
                        />

                        <div className="classification-area">
                            <label>Scegli la categoria più appropriata:</label>
                            <div className="category-grid">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`category-btn ${category === cat ? 'active' : ''}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="action-buttons">
                                <button className="next-btn" onClick={fetchComment} disabled={issubmitting}>
                                    Salta / Prossimo
                                </button>
                                <button
                                    className="submit-classification"
                                    disabled={!category || issubmitting}
                                    onClick={handleClassify}
                                >
                                    {issubmitting ? "Inviando..." : "Conferma e Invia"}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Nessun commento trovato.</p>
                )}
            </div>
        </div>
    );
}