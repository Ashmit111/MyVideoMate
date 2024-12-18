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
import { FiUpload, FiX, FiAlertCircle  } from "react-icons/fi";
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import VideoComments from '@/components/videocomments';
import VideoPlayer from '@/components/videoplayer';
import VideoDetails from '@/components/videodetails';
import Sidebar from '@/components/sidebar';

function VideoDetail () {

    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    const sideItems = [
        { icon: <BiLike className="w-6 h-6" />, },
        { icon: <FaRegCompass className="w-6 h-6" />, },
        { icon: <MdSubscriptions className="w-6 h-6" />, },
        { icon: <MdVideoLibrary className="w-6 h-6" />, },
        { icon: <FaHistory className="w-6 h-6"/>, }, 
        { icon: <IoSettings className="w-6 h-6"/>, },
        // { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
      ];
      const profilePic = "";

      const videoData = {
        title: "Advanced React Patterns",
        views: "30,164",
        uploadedTime: "18 hours ago",
        description:
          "Dive into the world of React with our latest tutorial series: 'Advanced React Patterns'! 🚀",
        channel: {
          name: "React Patterns",
          subscribers: "757K",
          avatar: "https://via.placeholder.com/150",
        } , 
        comments: [
          { user: "John Doe", text: "Great video! Learned a lot." },
          { user: "Jane Smith", text: "Very informative, thanks!" },
          { user: "Alex Johnson", text: "Can you explain more about hooks?" },
        ],
      };
    
      // Static sample suggested videos
      const suggestedVideos = [
        {
          id: "1",
          title: "Building a RESTful API with Node.js",
          thumbnail: "https://via.placeholder.com/150x90",
          channelName: "API Builder",
          views: "14.5K",
          uploadedTime: "7 hours ago",
        },
        {
          id: "2",
          title: "Creating Custom Hooks in React",
          thumbnail: "https://via.placeholder.com/150x90",
          channelName: "Hook Master",
          views: "9.3K",
          uploadedTime: "9 hours ago",
        },
        {
          id: "3",
          title: "Building Scalable Web Applications with Django",
          thumbnail: "https://via.placeholder.com/150x90",
          channelName: "Django Master",
          views: "18.9M",
          uploadedTime: "12 hours ago",
        },
        {
          id: "4",
          title: "Getting Started with Express.js",
          thumbnail: "https://via.placeholder.com/150x90",
          channelName: "Express Learner",
          views: "11.1K",
          uploadedTime: "5 hours ago",
        },
        {
          id: "5",
          title: "Introduction to React Native",
          thumbnail: "https://via.placeholder.com/150x90",
          channelName: "React Native Dev",
          views: "10.9K",
          uploadedTime: "8 hours ago",
        },
      ];
    

      const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setLoading(true);
            setLoading(false);
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
      };

      const handleLogout = async () => {
        const response = await axios.post("/api/v1/users/logout" );
        console.log(response.data);
        navigate("/")
      }

      // if (loading) {
      //   return (
      //       <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black">
      //           <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
      //       </div>
      //   );
      // }

      // if (error) {
      //   return <div className="text-center">{error}</div>;
      // }


  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <nav className='w-full fixed bg-black h-16 flex items-center z-50 border-b border-slate-500'>
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
                    {/* <button
                      type="submit"
                      className="px-6 py-2 bg-transparent rounded-full outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#313030] focus:bg-[#313030]"
                      aria-label="Submit search"
                      // onClick={handleSearch}
                    >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
                      ) : (
                      <FiSearch className="h-5 w-5 text-white" />
                      )}
                    </button> */}
                  </form> 
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
           </nav>
                   <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-20 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-slate-500">
                     <div>
                       {sideItems.map((item, index) => (
                         <button
                           key={index}
                           className="w-full flex cursor-pointer items-center px-7 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
                         >
                           {React.cloneElement(item.icon, { className: 'h-5 w-5 text-white' })} 
                         </button>
                       ))}
                     </div>
                     <div className="mt-auto mb-2">
                       <button
                         className="w-full flex items-center cursor-pointer px-6 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#1e1e1e] focus:bg-[#1e1e1e]"
                         aria-label="Log Out"
                         onClick={handleLogout}
                       >
                         <BiLogOut className="h-6 w-6 text-xl" /> 
                       </button>
                     </div>
                   </div>
                   <div className="flex flex-col lg:flex-row gap-4 bg-[#0F0F0F] text-white p-4 pl-28 pt-20 pb-8 px-4 overflow-y-auto space-y-8 w-[calc(100vw-129px)] ml-16 mt-6 mr-12">
      {/* Main Video Section */}
      <div className="flex-1">
        <VideoPlayer videoUrl={videoData.url} />
        <VideoDetails video={videoData} />
        <VideoComments comments={videoData.comments} />
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3">
        <Sidebar videos={suggestedVideos} />
      </div>
    </div>
    </div>
  )
}

export default VideoDetail 
