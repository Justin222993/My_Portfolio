import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import ModelViewer from "./gltf/ModelViewer";
import "./App.css";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const ADMIN_GOOGLE_USER_ID = process.env.REACT_APP_ADMIN_GOOGLE_USER_ID;

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [approvedComments, setApprovedComments] = useState([]);
  const [unapprovedComments, setUnapprovedComments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Fetch approved and unapproved comments when component mounts
  useEffect(() => {
    fetch("http://localhost:8000/api/approvedComments")
      .then((response) => response.json())
      .then((data) => setApprovedComments(data))
      .catch((error) => console.error("Error fetching approved comments:", error));

    fetch("http://localhost:8000/api/unApprovedComments")
      .then((response) => response.json())
      .then((data) => setUnapprovedComments(data))
      .catch((error) => console.error("Error fetching unapproved comments:", error));
  }, []);

  // Handle comment input
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Submit a comment to the backend
  const handleCommentSubmit = () => {
    if (user && comment) {
      fetch("http://localhost:8000/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          google_user_id: user.sub,
          comment,
          approved: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const newComment = data.comment;
          setUnapprovedComments([...unapprovedComments, newComment]);
          setComment("");
        })
        .catch((error) => console.error("Error submitting comment:", error));
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    console.log("User logged out");
  };

  // Check if the logged-in user is the admin
  const isAdmin = user && user.sub === ADMIN_GOOGLE_USER_ID;

  // Approve a comment
  const handleApproveComment = (id) => {
    fetch(`http://localhost:8000/api/approveComment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the unapproved and approved comment lists
        setUnapprovedComments(unapprovedComments.filter(comment => comment.id !== id));
        setApprovedComments([...approvedComments, data.comment]);
      })
      .catch((error) => console.error("Error approving comment:", error));
  };

  // Delete a comment
  const handleDeleteComment = (id) => {
    fetch(`http://localhost:8000/api/deleteComment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setApprovedComments(approvedComments.filter(comment => comment.id !== id));
        setUnapprovedComments(unapprovedComments.filter(comment => comment.id !== id));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app-container">
        {user && (
          <div className="user-profile">
            <img src={user.picture} alt="Profile" className="profile-pic" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <div className="google-login">
          {user ? (
            <div className="user-info">
              <h3>Welcome, {user.name}</h3>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={(response) => {
                const decoded = JSON.parse(atob(response.credential.split(".")[1]));
                setUser(decoded);
              }}
              onError={() => console.log("Login Failed")}
            />
          )}
        </div>

        {user && (
          <div className="comment-section">
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Leave a comment..."
              rows="4"
              cols="50"
            />
            <button onClick={handleCommentSubmit} disabled={!comment}>
              Submit Comment
            </button>
          </div>
        )}

        <div className="comments-list approved-comments">
          <h3>Approved Comments:</h3>
          {approvedComments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.comment}</p>
              <p>
                <strong>Posted by:</strong> {comment.google_user_id}
              </p>
              {isAdmin && (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="comments-list unapproved-comments">
            <h3>Unapproved Comments:</h3>
            {unapprovedComments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.comment}</p>
                <p>
                  <strong>Posted by:</strong> {comment.google_user_id}
                </p>
                <button onClick={() => handleApproveComment(comment.id)}>Approve</button>
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        <div className="model-container">
          <ModelViewer scale={1} modelPath={"assets/CharactaurhRig.glb"} position={[0, 0, 0]} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
