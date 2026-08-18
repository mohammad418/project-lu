import { useState } from "react";
import "./App.css";
import MainPage from "./pages/mainpage";
import Login from "./pages/login";

function App() {
  const [page, setPage] = useState("main");

  return (
    <div className="App">
      {page === "main" ? (
        <MainPage onLoginClick={() => setPage("login")} />
      ) : (
        <Login onBack={() => setPage("main")} />
      )}
    </div>
  );
}

export default App;
