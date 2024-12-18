import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";

const VideoComments = ({ comments }) => {
  const [commentList, setCommentList] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Add Comment Handler
  const handleAddComment = () => {
    if (newComment.trim()) {
      setCommentList([...commentList, { user: "You", text: newComment }]);
      setNewComment("");
    }
  };

  // Delete Comment Handler
  const handleDeleteComment = (index) => {
    const updatedComments = commentList.filter((_, i) => i !== index);
    setCommentList(updatedComments);
  };

  // Edit Comment Handlers
  const handleEditClick = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    const updatedComments = commentList.map((comment, i) =>
      i === editIndex ? { ...comment, text: editText } : comment
    );
    setCommentList(updatedComments);
    setEditIndex(null);
    setEditText("");
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
          className="w-full p-2 bg-[#282828] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Add
        </button>
      </div>

      {/* Display Comments */}
      <div>
        {commentList.map((comment, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-4 p-3 bg-[#282828] rounded-lg"
          >
            <div className="text-left">
              <h4 className="font-semibold text-white">{comment.user}</h4>
              {/* Edit Mode */}
              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-1 mt-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                />
              ) : (
                <p className="text-gray-300">{comment.text}</p>
              )}
            </div>

            {/* Icons for Edit/Save and Delete */}
            <div className="flex gap-2">
              {editIndex === index ? (
                <IoMdCheckmark
                  onClick={handleSaveEdit}
                  className="text-green-400 cursor-pointer text-2xl hover:text-green-500"
                  title="Save"
                />
              ) : (
                <FiEdit2
                  onClick={() => handleEditClick(index, comment.text)}
                  className="text-blue-400 cursor-pointer text-xl hover:text-blue-500"
                  title="Edit"
                />
              )}
              <MdDelete
                onClick={() => handleDeleteComment(index)}
                className="text-red-500 cursor-pointer text-2xl hover:text-red-600"
                title="Delete"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComments;
