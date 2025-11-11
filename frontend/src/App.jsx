import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/user/Dashboard"; // User Dashboard
import Story from "./pages/Story";

// Dashboards
import AdminDashboard from "./admin/AdminDashboard";
import EditStory from "./admin/EditStory";
import EditorDashboard from "./editor/EditorDashboard";

// Protected Route Wrapper
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";

function App() {
  const [category, setCategory] = useState("general");
  return (
    <Router>
      <Navbar setCategory={setCategory} />

      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/home" element={<Home category={category} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ---------- STORY DETAIL ---------- */}
          <Route 
            path="/story/:id" 
            element={
              <ErrorBoundary>
                <Story />
              </ErrorBoundary>
            } 
          />

          {/* ---------- USER DASHBOARD ---------- */}
          
          <Route
            path="/user/dashboard"
            element={
                <Dashboard />
            }
          />

          {/* ---------- EDITOR DASHBOARD ---------- */}
          <Route
            path="/editor/dashboard"
            element={
              // <PrivateRoute role="editor">
                <EditorDashboard />
              // </PrivateRoute>
            }
          />

          {/* ---------- ADMIN DASHBOARD ---------- */}
          <Route
            path="/admin/dashboard"
            element={
              // <PrivateRoute role="admin">
                <AdminDashboard />
              // </PrivateRoute>
            }
          />

          {/* ---------- ADMIN EDIT STORY ---------- */}
          <Route
            path="/admin/story/:id/edit"
            element={
              <PrivateRoute role="admin">
                <EditStory />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;