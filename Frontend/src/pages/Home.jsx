import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { RiVideoAddLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass, FaRegUser  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary, MdOutlineNotificationsActive } from "react-icons/md";
import { IoSettings } from "react-icons/io5"; 
import VideoCard from '@/components/ui/videoCard';


const Home = () => { 
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");
    const [videos, setVideos] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [notiModal,setNotiModal] = useState(false);

    const sideItems = [
        { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos" },
        { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
        { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
        { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
        { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
        { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
        // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
      ];
      const profilePic = "";

      const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();

      useEffect(() => {
        const fetchVideos = async () => {
          const fetchedVideos = [
            {
              thumbnail: 'https://i.ytimg.com/vi/NkwFxeHARqc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA_xzx8CM9e1KyGIqGxGPPr-bYf3A',
              title: 'React Tailwind YouTube Card with Options',
              channelName: 'CodeWithMe',
              channelAvatar: 'https://yt3.ggpht.com/1FEdfq3XpKE9UrkT4eOc5wLF2Bz-42sskTi0RkK4nPh4WqCbVmmrDZ5SVEV3WyvPdkfR8sw2=s68-c-k-c0x00ffffff-no-rj',
              views: '123K',
              timeAgo: '2 days ago',
              duration: '12:34',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            {
              thumbnail: 'https://i.ytimg.com/vi/Lu3BYhk9nj0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAHtZW5B7mc9EDWwhlrT6spJVdw5A',
              title: 'Building Modern UI with Tailwind CSS',
              channelName: 'DevTutorials',
              channelAvatar: 'https://yt3.ggpht.com/A_3mLbY1nzH3MPjzEftkO8LK02HazD4PWy9XbwLDQ4hDkbBCla4EkcVNM0kZDTeMWqNCD4jVbA=s68-c-k-c0x00ffffff-no-rj',
              views: '456K',
              timeAgo: '1 week ago',
              duration: '8:45',
            },
            // More video objects here
          ];
          setVideos(fetchedVideos);
        };
    
        fetchVideos();
      }, []);

      const handleSearch = (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setSearchError("");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      };

      const handleCreateVideo = () => {
        setShowModal(true) // Video Modal
      }

      const handleCloseVideoModal = () => {
        setShowModal(false); // Video Modal 
      };

      const handleNotifications = () => {
        setNotiModal(true); // Notification Modal 
      };

      const handleCloseNotificationModal = () => {
        setNotiModal(false); // Notification Modal 
      };

  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <nav className='w-full fixed bg-black h-16 flex items-center z-50'>
        <div className='flex items-center py-3'>
          <div className="flex gap-2 items-center px-3 ml-2">
            <img src="./public/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
            <h2 className='pt-1 text-lg text-white'>MyTube</h2>
          </div>
        </div>
        <div className="flex-1 max-w-xl mx-auto mt-2 items-center justify-center">
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative flex items-center flex-grow -mt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-[6px] rounded-2xl bg-black border-[1.7px] border-white text-white placeholder-white"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-transparent rounded-full outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#313030] focus:bg-[#313030]"
                aria-label="Submit search"
              >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
                ) : (
                <FiSearch className="h-5 w-5 text-white" />
                )}
              </button>
            </form>
            <button
              className="p-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0 -mt-2 hover:bg-[#313030] focus:bg-[#313030]"
              aria-label="Create video"
              onClick={handleCreateVideo}
            >
              <RiVideoAddLine className="h-6 w-6 text-white" />
            </button>
            <button
              className="p-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0 -mt-2 hover:bg-[#313030] focus:bg-[#313030]"
              aria-label="Notifications"
              // onClick={handleNotifications}
            >
              <MdOutlineNotificationsActive className="h-6 w-6 text-white" />
            </button>
            
          </div>
        </div>
        <div className="items-center pr-8">
          {profilePic.length>0 ? (
            <img
              src={profilePic} // Fetched from DB
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
              aria-label="User profile"
              />
              ) : (
              <FaRegUser
                className="w-5 h-5 text-white"
                aria-label="Default user icon"
              />
          )}
        </div>

        {showModal && (
  <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
    <div className="modal bg-black p-6 rounded-lg w-[500px] relative">
      <button
        className="close-btn absolute top-2 right-2 text-white font-bold"
        onClick={handleCloseVideoModal}
      >
        Close
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-white text-center">
        Upload Video
      </h2>

      {/* Drag-and-Drop Area */}
      <div
        className="drag-drop-area border-2 border-dashed border-red-500 p-8 rounded-lg text-center mb-6 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          setValue("video", files[0], { shouldValidate: true });
        }}
      >
        <div className="icon mb-4 ml-10">
        <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-8 w-8 border-red-500"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M5 20h14v-2H5v2zm7-16L8.5 9.5H11V15h2V9.5h2.5L12 4zM6 10v4h2v-4H6zm10 0v4h2v-4h-2z" />
  </svg>
        </div>
        <p className="text-red-400 mb-2">
          Drag and drop video files to upload
        </p>
        <p className="text-gray-400 mb-4">
          Or click below to select files manually.
        </p>
        <input
          type="file"
          {...register("video", { required: "Video file is required" })}
          className="hidden"
          id="fileInput"
          onChange={(e) =>
            setValue("video", e.target.files[0], { shouldValidate: true })
          }
        />
        <label
          htmlFor="fileInput"
          className="border-red-500 hover:border-red-400 text-white py-2 px-4 rounded cursor-pointer"
        >
          Select Files
        </label>
      </div>
      {errors.video && (
        <span className="text-red-500 text-sm">{errors.video.message}</span>
      )}

      <form  >
        {/* Title Input */}
        <label className="block mb-2 font-medium text-white">Title*</label>
        <input
          type="text"
          {...register("title", {
            required: "Title is required",
            minLength: { value: 3, message: "Title must be at least 3 characters" },
          })}
          className="block w-full mb-4 p-2 border border-gray-700 rounded bg-black text-white"
          placeholder="Enter video title"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}

        {/* Description Input */}
        <label className="block mb-2 font-medium text-white">Description*</label>
        <textarea
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: 200,
              message: "Description cannot exceed 200 characters",
            },
          })}
          className="block w-full mb-4 p-2 border border-gray-700 rounded bg-black text-white"
          placeholder="Enter video description"
        ></textarea>
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 border-red-500 hover:border-red-400 text-white rounded"
        >
          Upload Video
        </button>
      </form>
    </div>
  </div>
)}


      </nav>
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4">
          <div>
            {sideItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex cursor-pointer items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
                aria-label={item.label}
              >
                {React.cloneElement(item.icon, { className: 'h-5 w-5 text-white' })}
                <span className="ml-4 text-sm">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto mb-2">
            <button
              className="w-full flex items-center cursor-pointer px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#1e1e1e] focus:bg-[#1e1e1e]"
              aria-label="Log Out"
            >
              <BiLogOut className="h-5 w-5 text-red" />
              <span className="ml-4 text-sm">Log Out</span>
            </button>
          </div>
        </div>
 
      {/* Main Content */}
      <div className=" pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
     </div>
    
      
    </div>
  )
}

export default Home
