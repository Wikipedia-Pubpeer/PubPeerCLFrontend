import { useState } from "react";
import ApiKeyPrompt from "./components/ApiKeyPrompt";
import CommentPage from "./components/CommentPage";

function App() {
  const [auth, setAuth] = useState({ key: "", nickname: "" });

  const handleLogin = (key, nickname) => {
    setAuth({ key, nickname });
  };

  return (
    <div className="App">
      {!auth.key ? (
        <ApiKeyPrompt onLogin={handleLogin} />
      ) : (
        <CommentPage apiKey={auth.key} userNickname={auth.nickname} />
      )}
    </div>
  );
}

export default App;