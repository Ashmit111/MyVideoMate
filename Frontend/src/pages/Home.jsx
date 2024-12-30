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
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { logout } from '@/Features/authSlice';
import { useDispatch, useSelector } from 'react-redux'; 
import { showPromiseToast, showErrorToast } from '@/utils/toastNotification';
import UpdateProfileModal from '@/components/ui/updateProfileModal';
import Navbar from '@/components/ui/Navbar';


const Home = () => { 
    const [loading, setLoading] = useState(true); 
    // const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [videos, setVideos] = useState([]);
    // const [showModal,setShowModal] = useState(false);
    // const [notiModal,setNotiModal] = useState(false);
    // const [videoPreview, setVideoPreview] = useState(null);
    // const [thumbnailPreview, setThumbnailPreview] = useState(null);
    // const [Modal, setModal] = useState(false);  
    const navigate = useNavigate()
    const dispatch = useDispatch();

      // const user = useSelector((state) => state.auth.userData);

    // const notifications = [
    //   { id: 1, message: "Your order has been shipped!" },
    //   { id: 2, message: "New friend request received." },
    //   { id: 3, message: "Your subscription will expire soon." },
    //   { id: 4, message: "Update: System maintenance scheduled." },
    //   { id: 5, message: "You've earned a new badge!" },
    //   { id: 6, message: "Reminder: Your meeting starts in 30 minutes." },
    // ];

    const sideItems = [
      { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos", path: '/likedVideos' },
      { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel", path: '/dashboard' },
      { icon: <MdSubscriptions className="w-6 h-6" />, label: "Audience", path: '/audience' },
      { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists", path: '/myplaylist' },
      { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History", path: '/watchHistory' }, 
      { icon: <IoSettings className="w-6 h-6"/>, label: "Settings", path: '/dashboard'} 
    ];
      // const profilePic = user.avatar;

      // const {
      //   register,
      //   handleSubmit,
      //   reset, 
      //   formState: { errors, isSubmitting },
      // } = useForm();

      // const handleVideoChange = (e) => {
      //   const file = e.target.files[0];
      //   console.log(file)
      //   if (file) {
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       setVideoPreview(reader.result); // Set video preview 
      //     };
      //     reader.readAsDataURL(file); // Read the file as a data URL
      //   }
      // };
      
      // const handleThumbnailChange = (e) => {
      //   const file = e.target.files[0];
      //   console.log(file)
      //   if (file) {
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       setThumbnailPreview(reader.result); // Set thumbnail preview 
      //     };
      //     reader.readAsDataURL(file); // Read the file as a data URL
      //   }
      // }; 
    
      // const onSubmit = (data) => {
      //   const videoInput = document.getElementById("video-upload");
      //   const thumbnailInput = document.getElementById("thumbnail-upload");
      
      //   const formData = {
      //     ...data,
      //     videoFile: videoInput?.files[0] || null,
      //     thumbnail: thumbnailInput?.files[0] || null,
      //   };
      
      //   console.log(formData);
      
      //   // Create the promise for the video upload
      //   const uploadPromise = axiosInstance.post("/videos", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data", // Set the correct content type
      //     },
      //   });
      
      //   // Call showPromiseToast and pass the upload promise
      //   showPromiseToast(
      //     uploadPromise,  // The promise
      //     "Uploading video...",  // Loading message
      //     " Video uploaded successfully!",  // Success message
      //     "Failed to upload video",  // Error message
      //   );
        
      //   // Handle any further logic if necessary
      //   uploadPromise
      //     .then(() => {
      //       // Success block
      //       reset();
      //       setVideoPreview(null);
      //       setThumbnailPreview(null);
      //       setShowModal(false);
      //       fetchVideos();  // Fetch updated video list after successful upload
      //     })
      //     .catch(() => {
      //       // Failure block
      //       setVideoPreview(null);
      //       setThumbnailPreview(null);
      //       setShowModal(false);
      //       showErrorToast("Failed to upload video");
      //     });
      // };
      
    //  const handleRemoveVideo = () => {
    //     setVideoPreview(null);
    //     const videoInput = document.getElementById("video-upload");
    //     if (videoInput) {
    //       videoInput.value = "";
    //     }
    //   };
    
      const fetchVideos = async () => {
        try { 
          const response = await axiosInstance.get("/videos", {
            params: {
                limit: 16, // Limit to 16 videos
            },
        });

        const videosWithFormattedDuration = response.data.data.map((video) => {
            const formattedDuration = formatDuration(video.duration); // Format the duration
            return { ...video, formattedDuration }; // Add formatted duration to each video object
        });
        console.log(videosWithFormattedDuration);
        
        setVideos(videosWithFormattedDuration); // Update state with formatted videos
        setLoading(false);
        } catch (err) {
            // Handle any errors
            setError("Failed to fetch videos");
            setLoading(false);
        }
    };
    function formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } 

      useEffect(() => {
         fetchVideos();
    }, []);

  //   const handleSearch = (e) => {
  //     e.preventDefault();
  //     if (searchQuery.trim()) {
  //         setLoading(true);
  //         setLoading(false);
  //         navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  //     }
  // };

  //     const handleCreateVideo = () => {
  //       setShowModal(true) // Video Modal
  //     }

      // const handleCloseVideoModal = () => {
      //   setShowModal(false); // Close Video Modal
      //   reset(); // Reset form if needed
      //   setVideoPreview(null);
      //   setThumbnailPreview(null); 
      // };

      // const handleNotifications = () => {
      //   setNotiModal(true); // Notification Modal 
      // };

      // const handleCloseNotificationModal = () => {
      //   setNotiModal(false); // Notification Modal 
      // };

      const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('/users/logout');
            console.log(response.data);
            localStorage.removeItem('accessToken');
            dispatch(logout());
            navigate('/'); // Navigate to login page after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

      if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black">
                <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
            </div>
        );
      }

      if (error) {
        return <div className="text-center">{error}</div>;
      }


  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <Navbar />
      {/* Notification Modal */}
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-slate-500">
          <div>
            {sideItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex cursor-pointer items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
                aria-label={item.label}
                onClick={() => navigate(item.path)}
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
              onClick={handleLogout}
            >
              <BiLogOut className="h-5 w-5 text-red" />
              <span className="ml-4 text-sm">Log Out</span>
            </button>
          </div>
        </div>
 
      {/* Main Content */}
      <div className=" pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0 w-[calc(100vw-17px)] ">
        {videos.map(video => (
          <Link key={video._id} to={`/video/${video._id}`}>
            <VideoCard video={video} />
          </Link>
        ))}
     </div>
    
      
    </div>
  )
}

export default Home
