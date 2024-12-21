import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass, FaRegUser  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";
import { IoSettings } from "react-icons/io5";  
import axios from 'axios'; 
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import VideoComments from '@/components/videocomments';
import VideoPlayer from '@/components/videoplayer';
import VideoDetails from '@/components/videodetails';
import Sidebar from '@/components/sidebar';
import { useNavigate } from 'react-router-dom';

function VideoDetail () {

    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [url,setUrl] = useState({})
    const [videoData,setVideoData] = useState("")
    const [suggestedVideos, setSuggestedVideos] = useState([])
    const [id, setId] = useState("")
    const {videoId} = useParams()
    const navigate = useNavigate()

    const sideItems = [
        { icon: <BiLike className="w-6 h-6" />, },
        { icon: <FaRegCompass className="w-6 h-6" />, },
        { icon: <MdSubscriptions className="w-6 h-6" />, },
        { icon: <MdVideoLibrary className="w-6 h-6" />, },
        { icon: <FaHistory className="w-6 h-6"/>, }, 
        { icon: <IoSettings className="w-6 h-6"/>, } 
      ];
      const profilePic = ""; 

      useEffect(() => {
         const fetchVideo = async () => {
          const response = await axios.get(`/api/v1/videos/${videoId}`)
          console.log(response.data);
          const {videoFile, thumbnail} = response.data.data;
          const urls = {videoFile, thumbnail}
          const {_id} = response.data.data.userDetails
          const Id = _id.toString(); 
          setId(Id)
          setUrl(urls) 

          const { title, description, views,  userDetails: { username, avatar }, } = response.data.data;
          const extractedData = { username, avatar, title, description, views };
          setVideoData(extractedData)
          const query = `${extractedData.title} ${extractedData.description}`;
          const suggestedVideoResponse = await axios.get(`/api/v1/videos/search?query=${encodeURIComponent(query)}` );

          const videosWithFormattedDuration = suggestedVideoResponse.data.data.map((video) => {
          const formattedDuration = formatDuration(video.duration); // Format the duration
          return { ...video, formattedDuration };
          })   
          setSuggestedVideos(videosWithFormattedDuration)  
         }
         if (videoId) {
          fetchVideo()
         }

         function formatDuration(seconds) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        } 
      }, [videoId])
      
    

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
                  <img src="/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
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
                  <div className="flex flex-col lg:flex-row gap-4 bg-[#0F0F0F] text-white p-4 pl-20 pt-20 pb-8 px-4 overflow-y-auto space-y-8 w-[calc(100vw-129px)] ml-16 mt-6 mr-12">
                    {/* Main Video Section */}
                    <div className="flex-1">
                      <VideoPlayer video={url} />
                      <VideoDetails video={videoData} videoId={videoId} channelId={id}/>
                      <VideoComments videoId={videoId} />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full ml-5 lg:w-1/3">
                      {suggestedVideos.map((video) => (
                        <Link to={`/video/${video._id}`} key={video._id} className="block hover:no-underline">
                          <Sidebar video={video} />
                        </Link>
                      ))}
                    </div>
                  </div>
     </div>
  )
}

export default VideoDetail 
