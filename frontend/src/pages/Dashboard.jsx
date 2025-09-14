import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      setBookmarks(storedBookmarks);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to Your Dashboard</h2>
        {user ? (
          <>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button onClick={handleLogout}>Logout</button>
            <div style={{ marginTop: "20px", textAlign: "left" }}>
              <h3 style={{ marginBottom: "10px" }}>Bookmarks:</h3>
              {bookmarks.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {bookmarks.map((bookmark, index) => (
                    <li
                      key={index}
                      style={{
                        backgroundColor: "#1e293b",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        fontSize: "13px",
                      }}
                    >
                      {bookmark.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Nothing found.
                </p>
              )}
            </div>
          </>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
