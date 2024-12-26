import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useSelector } from "react-redux";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

const VideoComments = ({ videoId }) => {
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null); // Track which comment is being edited
  const [editContent, setEditContent] = useState(""); // Track updated content for the edit

  const user = useSelector((state) => state.auth.userData);

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/${videoId}`);
      setCommentList(response.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err.response?.data || err.message);
      setError("Failed to fetch comments. Please try again.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // Add Comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axiosInstance.post(`/comments/${videoId}`, {
          content: newComment,
        });

        if (response.data?.success) {
          setNewComment("");
          setError(null);
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

  // Delete Comment
  const handleDeleteComment = async (commentId) => { 
      try {
        const response = await axiosInstance.delete(`/comments/c/${commentId}`);
        if (response.data?.success) {
          fetchComments();
        } else {
          setError(response.data?.message || "Failed to delete comment.");
        }
      } catch (err) {
        console.error("Error deleting comment:", err.response?.data || err.message);
        setError("Something went wrong. Please try again."); 
    }
  };

  // Edit Comment
  const handleEditComment = async (commentId, updatedContent) => {
    if (updatedContent.trim()) {
      try {
        const response = await axiosInstance.patch(`/comments/c/${commentId}`, {
          content: updatedContent,
        });

        if (response.data?.success) {
          setEditCommentId(null); // Exit edit mode
          setEditContent(""); // Clear edit content
          fetchComments();
        } else {
          setError(response.data?.message || "Failed to update comment.");
        }
      } catch (err) {
        console.error("Error editing comment:", err.response?.data || err.message);
        setError("Something went wrong. Please try again.");
      }
    } else {
      setError("Updated content cannot be empty.");
    }
  };

  return (
    <div className="p-4 bg-[#181818] rounded-lg">
      {/* Comment Count */}
      <h3 className="font-bold mb-4 text-white">{commentList.length} Comments</h3>

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
        {commentList.map((comment) => (
          <div
            key={comment._id}
            className="py-2 px-2 border-b border-gray-600 flex items-start gap-3"
          >
            {/* Avatar */}
            <img
              src={comment?.owner?.avatar || "https://via.placeholder.com/40"}
              alt={`${comment?.owner?.username || "User"}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            {/* Comment Details */}
            <div className="flex-grow">
              <h4 className="font-semibold text-white">
                {comment?.owner?.username || "Unknown User"}
              </h4>
              {editCommentId === comment._id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-1 bg-[#282828] rounded-lg text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleEditComment(comment._id, editContent)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditCommentId(null); // Cancel edit mode
                      setEditContent(""); // Clear edit content
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-300">{comment?.content}</p>
              )}
            </div>
            {/* Edit and Delete Buttons */}
            {comment.owner?.username === user?.username && (
              <div className="flex gap-2">
                <button
                  className="bg-transparent text-white px-1 py-1 rounded-md hover:text-gray-400 hover:border-transparent focus:outline-none"
                  onClick={() => {
                    setEditCommentId(comment._id);
                    setEditContent(comment.content); // Populate the edit input
                  }}
                >
                  <LuPencil className='h-4 w-4' />
                </button>
                <button
                  className="bg-transparent text-white px-1 py-1 rounded-md hover:text-gray-400 hover:border-transparent focus:outline-none"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <MdDelete className='h-5 w-5' />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComments;
