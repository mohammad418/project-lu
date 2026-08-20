import { useState } from "react";
import "./App.css";
import MainPage from "./pages/mainpage";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  const [page, setPage] = useState("main");

  return (
    <div className="App">
      {page === "main" ? (
        <MainPage onLoginClick={() => setPage("login")} />
      ) : page === "signup" ? (
        <Signup
          onBack={() => setPage("main")}
          onLoginClick={() => setPage("login")}
        />
      ) : (
        <Login
          onBack={() => setPage("main")}
          onSignupClick={() => setPage("signup")}
        />
      )}
    </div>
  );
}

export default App;
