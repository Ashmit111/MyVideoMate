import React, { useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { FiThumbsUp as FilledThumbsUp } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";

const VideoDetails = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playlists = ["Favorites", "Watch Later", "React Tutorials", "My Playlist"]; // Sample playlist data

  return (
    <div className="p-4 bg-[#181818] rounded-lg mb-4 text-white">
      {/* Video Title */}
      <h1 className="text-xl font-bold mb-2">{video.title}</h1>

      {/* Views and Upload Time */}
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>{video.views} Views • {video.uploadedTime}</span>
      </div>

      {/* Channel and Actions */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={video.channel.avatar}
          alt="channel avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{video.channel.name}</h2>
          <p className="text-sm text-gray-400">
            {video.channel.subscribers} Subscribers
          </p>
        </div>

        {/* Subscribe Button */}
        <motion.button
          onClick={() => setIsSubscribed(!isSubscribed)}
          whileTap={{ scale: 0.9 }}
          className={`ml-auto px-4 py-2 rounded-lg transition-all ${
            isSubscribed
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </motion.button>
      </div>

      {/* Like and Save Buttons */}
      <div className="flex gap-4 items-center">
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex items-center gap-1 text-gray-400 hover:text-purple-500 transition-all"
        >
          {isLiked ? (
            <FilledThumbsUp className="text-purple-500 text-xl" />
          ) : (
            <FiThumbsUp className="text-xl" />
          )}
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>

        {/* Save Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-gray-400 hover:text-purple-500 transition-all"
        >
          <BsBookmark className="text-xl" />
          <span>Save</span>
        </button>
      </div>

      {/* Video Description */}
      <div className="mt-4 bg-[#282828] p-4 rounded-lg text-gray-300">
        <p>{video.description}</p>
      </div>

      {/* Save to Playlist Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#181818] p-6 rounded-lg w-[400px] relative">
            <h3 className="text-lg font-semibold mb-4">Save to Playlist</h3>
            <MdClose
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 cursor-pointer"
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
