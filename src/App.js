import WelcomePage from './pages/WelcomePage';
import DocsPage from './pages/DocPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("authToken"); // use boolean cast
  console.log("🔐 isLoggedIn:", isLoggedIn); // check in console
  return isLoggedIn ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
