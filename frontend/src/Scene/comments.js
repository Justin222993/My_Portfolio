import React, { useEffect, useState, useRef } from 'react';
import { RoundedBox, Text, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';


const Comments = ({ user, setUser, isAdmin, ADMIN_GOOGLE_USER_ID, language }) => {
  const [comment, setComment] = useState(""); // for comment input
  const [approvedComments, setApprovedComments] = useState([]);
    const [unapprovedComments, setUnapprovedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const groupRef = useRef();
  const planeRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  // Variables to handle dragging and inertia
  const dragging = useRef(false);
  const lastY = useRef(0);
  const velocity = useRef(0);
  const dragSpeed = 0.005; // conversion factor from pointer pixels to scene units
  const friction = 0.95;   // friction factor to decay inertia
  // Parent component (e.g., App.js)

  const handleLoginSuccess = async (tokenResponse) => {
    try {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      if(userInfo.data.sub === ADMIN_GOOGLE_USER_ID){
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/unApprovedComments`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log the response data
          setUnapprovedComments(data);
        })
        .catch((error) => console.error("Error fetching unapproved comments:", error));
      }
      setUser(userInfo.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: () => console.log("Login Failed"),
  });

  

    // Apply inertia only after the pointer is released
    useFrame((state, delta) => {
        if (!dragging.current && Math.abs(velocity.current) > 0.0001 && groupRef.current) {
          groupRef.current.position.y += velocity.current; // note: velocity is already reversed
          velocity.current *= friction; // decay the velocity over time
    
          // Clamp within bounds
          if (groupRef.current.position.y > topBound) {
            groupRef.current.position.y = topBound;
            velocity.current = 0;
          }
          if (groupRef.current.position.y < bottomBound) {
            groupRef.current.position.y = bottomBound;
            velocity.current = 0;
          }
        }
      });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/approvedComments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setApprovedComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Utility to break text into lines
  const splitIntoLines = (text, maxChars = 36) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    words.forEach(word => {
      if (currentLine.length + word.length + 1 > maxChars) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Format the timestamp nicely
  const formatTimestamp = (timestamp) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - time;
    const diffInMinutes = Math.floor(diffInMs / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <Text
        position={[0, 1, 7]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.2}
        color="teal"
      >
        Loading comments...
      </Text>
    );
  }

  if (error) {
    return (
      <Text
        position={[0, 1, 7]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.2}
        color="red"
      >
        Error: {error}
      </Text>
    );
  }

  // Compute the total content height to define scrolling boundaries
  const lineHeight = 0.18;
  const boxGap = 0.1;
  var topBound = 3;  // maximum y position
  const bottomBound = 0; // minimum y position



  // Pointer event handlers
  const handlePointerDown = (e) => {
    dragging.current = true;
    lastY.current = e.clientY;
  };

  const handlePointerMove = (e) => {
    if (dragging.current && groupRef.current) {
      const currentY = e.clientY;
      const deltaY = currentY - lastY.current;
      const movement = deltaY * dragSpeed;
      groupRef.current.position.y -= movement;
      velocity.current = -movement;
      lastY.current = currentY;

      // Clamp the position during dragging
      if (groupRef.current.position.y > topBound) {
        groupRef.current.position.y = topBound;
        velocity.current = 0;
      }
      if (groupRef.current.position.y < bottomBound) {
        groupRef.current.position.y = bottomBound;
        velocity.current = 0;
      }
    }
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  let totalHeight = 0;

    // Logout function
    const handleLogout = () => {
      setUser(null);
      console.log("User logged out");
    };

      // Handle comment input change
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  

  // Submit a comment to the backend
  const handleCommentSubmit = () => {
    if (user && comment) {
      setSubmitError(null); // Reset error state on new submission
      setSubmitSuccess(null);
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          google_user_id: user.sub,
          name: user.name,
          photo: user.picture,
          comment,
          approved: false,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Failed to submit comment');
          });
        }
        return response.json();
      })
      .then((data) => {
        const newComment = data.comment;
        setUnapprovedComments([...unapprovedComments, newComment]);
        setComment("");
        setSubmitError(null);
        setSubmitSuccess(data.message);
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
        setSubmitError(error.message || 'An error occurred while submitting the comment.');
      });
    }
  };

    // Delete a comment
    const handleDeleteComment = (id) => {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/deleteComment/${id}`, {
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

    const handleApproveComment = (id) => {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/approveComment/${id}`, {
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

    return (
      <>
        {/* Conditionally render for mobile */}
        {isMobile ? (
  <mesh ref={planeRef} position={[0, 3, 41]} rotation={[0, Math.PI, 0]}>
  <Html transform>
    <div
      style={{
        width: '500px',
        height: '800px',
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h3>Comments:</h3>
      {approvedComments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <img
              src={comment.photo || 'images/no-image-found.jpg'}
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px',
              }}
            />
            <div>
              <h4 style={{ margin: '0', fontSize: '16px' }}>{comment.name}</h4>
              <p style={{ margin: '0', fontSize: '12px', color: '#555' }}>
                {formatTimestamp(comment.created_at)}
              </p>
            </div>
          </div>
          <p>{comment.comment}</p>
        </div>
      ))}
    </div>
  </Html>
</mesh>
        ) : (
          <>
            {/* Non-mobile or desktop view */}
            {isAdmin && (
              <mesh ref={planeRef} position={[14, 10, 41]} rotation={[0, Math.PI, 0]}>
                <Html transform>
                  <div
                    className="approved-comments"
                    style={{
                      width: '300px',
                      height: '500px',
                      overflowY: 'auto',
                      padding: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <h3>Approved Comments:</h3>
                    {approvedComments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <p>{comment.comment}</p>
                        <p>
                          <strong>Posted by:</strong> {comment.google_user_id}
                        </p>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#FF4C4C',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </Html>
              </mesh>
            )}
    
            {isAdmin && (
              <mesh ref={planeRef} position={[14, -7, 41]} rotation={[0, Math.PI, 0]}>
                <Html transform>
                  <div
                    className="unapproved-comments"
                    style={{
                      width: '300px',
                      height: '500px',
                      overflowY: 'auto',
                      padding: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <h3>Unapproved Comments:</h3>
                    {unapprovedComments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <p>{comment.comment}</p>
                        <p>
                          <strong>Posted by:</strong> {comment.google_user_id}
                        </p>
                        <button
                          onClick={() => handleApproveComment(comment.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#4CAF50',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#FF4C4C',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </Html>
              </mesh>
            )}
    
            <spotLight position={[8, 6, 2]} angle={1.9} penumbra={1} intensity={300} />
    
            {!user ? (
              <RoundedBox position={[-1.8, 2, 9]} args={[1.4, 1.4, 0.3]} radius={0.05} smoothness={4}>
                <meshStandardMaterial color="#B5828C" />
                <mesh ref={planeRef} position={[-14, 8, 45]} rotation={[0, Math.PI, 0]}>
                  <Html transform>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        onClick={login}
                        style={{
                          fontSize: '2rem',
                          padding: '20px 40px',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                          fontWeight: 'bold',
                          justifyContent: 'center',
                        }}
                      >
                        {language === "French" ? (
                          <>
                            Connectez-vous avec <br /> Google pour <br /> commenter !
                          </>
                        ) : (
                          <>
                            Sign-In with Google <br /> to comment!
                          </>
                        )}
                      </button>
                    </div>
                  </Html>
                </mesh>
              </RoundedBox>
            ) : (
              <RoundedBox position={[-1.8, 2, 9]} args={[1.4, 1.4, 0.3]} radius={0.05} smoothness={4}>
                <meshStandardMaterial color="#B5828C" />
                <mesh ref={planeRef} position={[-14, 15.5, 45]} rotation={[0, Math.PI, 0]}>
                  <Html transform>
                    <div className="user-profile">
                      <img
                        src={user.picture}
                        alt="Profile"
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          border: '2px solid white',
                        }}
                      />
                      <button
                        onClick={handleLogout}
                        style={{
                          padding: '16px 30px',
                          backgroundColor: '#FF4C4C',
                          border: 'none',
                          borderRadius: '20px',
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </Html>
                </mesh>
    
                <mesh ref={planeRef} position={[-14.8, 8, 45]} rotation={[0, Math.PI, 0]}>
                  <Html transform>
                    <textarea
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder={language === "French" ? "Écrivez votre commentaire..." : "Write your comment..."}
                      rows="4"
                      cols="25"
                      maxLength={100}
                      style={{
                        width: '350px',
                        height: '280px',
                        padding: '10px',
                        fontSize: '20px',
                        borderRadius: '5px',
                        resize: 'none',
                        backgroundColor: '#F8F8F8',
                        border: '1px solid #ccc',
                      }}
                    />
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                      style={{
                        padding: '16px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '84%',
                      }}
                    >
                      {language === "French" ? "Envoyer" : "Send"}
                    </button>
                  </Html>
                </mesh>
                <mesh ref={planeRef} position={[-15, 1.5, 45]} rotation={[0, Math.PI, 0]}>
                  <Html transform>
                    {submitError && (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '24px',
                          marginTop: '150px',
                          marginLeft: '-130px',
                          minWidth: '300px',
                        }}
                      >
                        {submitError}
                      </div>
                    )}
                    {submitSuccess && (
                      <div
                        style={{
                          color: 'green',
                          fontSize: '24px',
                          marginTop: '150px',
                          marginLeft: '-130px',
                          minWidth: '300px',
                        }}
                      >
                        {submitSuccess}
                      </div>
                    )}
                  </Html>
                </mesh>
              </RoundedBox>
            )}
    
            <group
              ref={groupRef}
              position={[0, 3, 9]}
              rotation={[0, Math.PI * -1, 0]}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerOut={handlePointerUp}
            >
              {approvedComments.map((comment) => {
                const lines = splitIntoLines(comment.comment);
                const boxHeight = lines.length * lineHeight + 0.2;
                const yPosition = -totalHeight;
                totalHeight += boxHeight + boxGap;
                topBound += boxHeight;
    
                return (
                  <group key={comment.id} position={[0, yPosition - boxHeight / 2, 0]}>
                    <RoundedBox args={[2, boxHeight, 0.3]} radius={0.05} smoothness={4}>
                      <meshStandardMaterial color="#B5828C" />
                    </RoundedBox>
    
                    {/* Display comment text */}
                    <Text
                      position={[-0.9, boxHeight / 2 - 0.06, 0.16]}
                      fontSize={0.1}
                      color="#000"
                      anchorX="left"
                      anchorY="top"
                      maxWidth={1.8}
                    >
                      {lines.join("\n")}
                    </Text>
    
                    {/* Display user name */}
                    <Text
                      position={[-0.6, -boxHeight / 2 + 0.05, 0.16]}
                      fontSize={0.08}
                      color="#444"
                      anchorX="left"
                      anchorY="bottom"
                    >
                      {comment.name} - {formatTimestamp(comment.created_at)}
                    </Text>
    
                    {/* Display profile picture */}
                    <Html position={[-1.15, -boxHeight / 5 + 0.05, 0.16]} transform occlude>
                      <img
                        src={comment.photo || "images/no-image-found.jpg"}
                        alt=""
                        onError={(e) => (e.target.src = "images/no-image-found.jpg")}
                        style={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Html>
                  </group>
                );
              })}
            </group>
          </>
        )}
      </>
    );
  }

export default Comments;
