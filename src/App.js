import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ApiKeyPrompt from "./components/ApiKeyPrompt";
import CommentPage from "./components/CommentPage";
import CommentListPage from "./components/BatchCommentsPage"; // nuova pagina per lista 25 commenti
import Navbar from "./components/NavbarCC";

function App() {
  const [auth, setAuth] = useState({ key: "", nickname: "" });

  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    const storedNickname = localStorage.getItem("nickname");
    if (storedKey && storedNickname) {
      setAuth({ key: storedKey, nickname: storedNickname });
    }
  }, []);

  const handleLogin = (key, nickname) => {
    localStorage.setItem("apiKey", key);
    localStorage.setItem("nickname", nickname);
    setAuth({ key, nickname });
  };

  if (!auth.key) {
    return <ApiKeyPrompt onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navbar userNickname={auth.nickname} />

      {/* Contenuto sotto la navbar */}
      <div className="page-content">
        <Routes>
          <Route
            path="/comment/:id?"
            element={<CommentPage apiKey={auth.key} userNickname={auth.nickname} />}
          />
          <Route
            path="/comment-list"
            element={<CommentListPage apiKey={auth.key} />}
          />
          <Route path="/" element={<Navigate to="/comment" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
