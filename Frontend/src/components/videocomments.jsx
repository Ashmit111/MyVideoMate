import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoComments = ({ videoId }) => {
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null); // To store error messages

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/v1/comments/${videoId}`);
      setCommentList(response.data?.data || []); // Set the comment list
      setError(null); // Clear any existing error
    } catch (err) {
      console.error("Error fetching comments:", err.response?.data || err.message);
      // setError("Failed to fetch comments. Please try again.");
    }
  };

  // Fetch comments on component mount and whenever videoId changes
  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // Add Comment Handler
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        // Send comment to backend
        const response = await axios.post(`/api/v1/comments/${videoId}`, {
          content: newComment,
        });

        console.log("API Response:", response.data);

        // Check if the comment was successfully added
        if (response.data?.success) {
          setNewComment(""); // Clear the input field
          setError(null); // Clear errors

          // Fetch the updated list of comments
          fetchComments();
        } else {
          setError(response.data?.message || "Failed to add comment.");
        }
      } catch (err) {
        console.error("Error adding comment:", err.response?.data || err.message);
        setError("Something went wrong. Please try again.");
      }
    } else {
      setError("Comment content cannot be empty.");
    }
  };

  return (
    <div className="p-4 bg-[#181818] rounded-lg">
      {/* Comment Count */}
      <h3 className="font-bold mb-4">{commentList.length} Comments</h3>

      {/* Add Comment */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 bg-[#282828] rounded-lg text-white focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-4 py-2 bg-[#f86a6b] text-white rounded-lg hover:bg-[#f05656]"
        >
          Add
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Display Comments */}
      <div>
        {commentList.map((comment, index) => (
          <div
            key={index}
            className="py-2 px-2 border-b border-gray-600 flex items-center gap-3"
          >
            {/* Avatar */}
            <img
              src={comment?.owner?.avatar || "https://via.placeholder.com/40"}
              alt={`${comment?.owner?.username || "User"}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            {/* Comment Details */}
            <div>
              <h4 className="font-semibold text-white">{comment?.owner?.username || "Unknown User"}</h4>
              <p className="text-gray-300">{comment?.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComments;
