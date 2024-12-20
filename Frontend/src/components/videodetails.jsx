import React, { useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { BiSolidLike } from "react-icons/bi";
import { MdPlaylistAddCircle } from "react-icons/md";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";

const VideoDetails = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playlists = ["Favorites", "Watch Later", "React Tutorials", "My Playlist"];

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="p-4 bg-[#181818] rounded-lg mb-2 text-white">
      {/* Video Title */}
      <h1 className="text-xl font-bold ">{video.title}</h1>

      {/* Views and Upload Time */}
      <div className="flex justify-between text-sm text-gray-400 ">
        <span>
          {video.views} Views • {video.uploadedTime || "2 Months ago"}
        </span>
      </div>

      {/* Channel and Actions */}
      <div className="flex items-center gap-4 mb-1">
        <img
          src={video.avatar}
          alt="channel avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{video.channel.name}</h2>
          <p className="text-sm text-gray-400">
            {video.channel.subscribers || "253"} Subscribers
          </p>
        </div>

        {/* Like, Save, and Subscribe Buttons */}
        <div className="flex flex-col items-end ml-auto gap-2">
          <div className="flex gap-4 mb-2 -mt-5">
            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              className="flex items-center gap-2 text-white rounded-3xl"
            >
              {isLiked ? (
                <BiSolidLike className="text-white text-xl" />
              ) : (
                <FiThumbsUp className="text-xl" />
              )}
              <span className="text-sm">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-gray-400 transition-all rounded-3xl"
            >
              <MdPlaylistAddCircle className="text-2xl" />
              <span className="text-sm">Save</span>
            </button>
          </div>

          {/* Subscribe Button */}
          <motion.button
            onClick={() => setIsSubscribed(!isSubscribed)}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-3xl mb-2 transition-all ${
              isSubscribed
                ? "bg-gray-800 text-white "
                : "bg-[#f86a6b] "
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </motion.button>
        </div>
      </div>
            <hr />
      {/* Video Description */}
      <div className="mt-1  p-4 text-gray-300">
        <p>{video.description}</p>
      </div>

      {/* Save to Playlist Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#181818] p-6 rounded-lg w-[400px] relative">
            <h3 className="text-lg font-semibold mb-4">Save to Playlist</h3>
            <MdClose
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 cursor-pointer "
              onClick={() => setIsModalOpen(false)}
            />
            <ul>
              {playlists.map((playlist, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-[#282828] rounded-lg cursor-pointer"
                >
                  {playlist}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
