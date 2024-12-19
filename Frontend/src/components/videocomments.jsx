import React, { useState } from "react";

const VideoComments = ({ comments }) => {
  const [commentList, setCommentList] = useState(comments);
  const [newComment, setNewComment] = useState("");

  // Add Comment Handler
  const handleAddComment = () => {
    if (newComment.trim()) {
      setCommentList([...commentList, { user: "You", text: newComment }]);
      setNewComment("");
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
          className="w-full p-2 bg-[#282828] rounded-lg text-white focus:outline-none "
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-4 py-2 bg-[#f86a6b] text-white rounded-lg hover:bg-[#f05656]"
        >
          Add
        </button>
      </div>

      {/* Display Comments */}
      <div>
        {commentList.map((comment, index) => (
          <div key={index} className="py-2 px-2 border-b border-gray-100">
            <h4 className="font-semibold text-white">{comment.user}</h4>
            <p className="text-gray-300">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComments;
