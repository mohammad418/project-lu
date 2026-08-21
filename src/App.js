import { useState, useEffect } from "react";
import "./App.css";
import MainPage from "./pages/mainpage";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  const [page, setPage] = useState("main");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage("main");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {page === "main" ? (
        <MainPage
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginClick={() => setPage("login")}
        />
      ) : page === "signup" ? (
        <Signup
          onBack={() => setPage("main")}
          onLoginClick={() => setPage("login")}
          onSignupSuccess={handleLoginSuccess}
        />
      ) : (
        <Login
          onBack={() => setPage("main")}
          onSignupClick={() => setPage("signup")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
