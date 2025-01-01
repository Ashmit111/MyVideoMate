import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { RiVideoAddLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi"; 
import { FaRegUser  } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md"; 
import { FiUpload, FiX, FiAlertCircle  } from "react-icons/fi";  
import { useNavigate } from 'react-router-dom';  
import axiosInstance from '@/utils/axiosInstance'; 
import {  useSelector } from 'react-redux'; 
import { showPromiseToast, showErrorToast }from '@/utils/toastNotification';
import UpdateProfileModal from './updateProfileModal';


function Navbar() {
    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [videos, setVideos] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [notiModal,setNotiModal] = useState(false);
    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [Modal, setModal] = useState(false);  
    const navigate = useNavigate() 

    const user = useSelector((state) => state.auth.userData);

    const notifications = [
      { id: 1, message: "Your order has been shipped!" },
      { id: 2, message: "New friend request received." },
      { id: 3, message: "Your subscription will expire soon." },
      { id: 4, message: "Update: System maintenance scheduled." },
      { id: 5, message: "You've earned a new badge!" },
      { id: 6, message: "Reminder: Your meeting starts in 30 minutes." },
    ]; 
      const profilePic = user.avatar;

      const {
        register,
        handleSubmit,
        reset, 
        formState: { errors, isSubmitting },
      } = useForm();

      const handleVideoChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setVideoPreview(reader.result); // Set video preview 
          };
          reader.readAsDataURL(file); // Read the file as a data URL
        }
      };
      
      const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setThumbnailPreview(reader.result); // Set thumbnail preview 
          };
          reader.readAsDataURL(file); // Read the file as a data URL
        }
      }; 
    
      const onSubmit = (data) => {
        const videoInput = document.getElementById("video-upload");
        const thumbnailInput = document.getElementById("thumbnail-upload");
      
        const formData = {
          ...data,
          videoFile: videoInput?.files[0] || null,
          thumbnail: thumbnailInput?.files[0] || null,
        };
      
        console.log(formData);
      
        // Create the promise for the video upload
        const uploadPromise = axiosInstance.post("/videos", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        });
      
        // Call showPromiseToast and pass the upload promise
        showPromiseToast(
          uploadPromise,  // The promise
          "Uploading video...",  // Loading message
          " Video uploaded successfully!",  // Success message
          "Failed to upload video",  // Error message
        );
        
        // Handle any further logic if necessary
        uploadPromise
          .then(() => {
            // Success block
            reset();
            setVideoPreview(null);
            setThumbnailPreview(null);
            setShowModal(false);
            fetchVideos();  // Fetch updated video list after successful upload
          })
          .catch(() => {
            // Failure block
            setVideoPreview(null);
            setThumbnailPreview(null);
            setShowModal(false);
            showErrorToast("Failed to upload video");
          });
      };
      
     const handleRemoveVideo = () => {
        setVideoPreview(null);
        const videoInput = document.getElementById("video-upload");
        if (videoInput) {
          videoInput.value = "";
        }
      };
    
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

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          setLoading(true);
          setLoading(false);
          navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
  };

      const handleCreateVideo = () => {
        setShowModal(true) // Video Modal
      }

      const handleCloseVideoModal = () => {
        setShowModal(false); // Close Video Modal
        reset(); // Reset form if needed
        setVideoPreview(null);
        setThumbnailPreview(null); 
      };

      const handleNotifications = () => {
        setNotiModal(true); // Notification Modal 
      };

      const handleCloseNotificationModal = () => {
        setNotiModal(false); // Notification Modal 
      };
 

    //   if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black">
    //             <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
    //         </div>
    //     );
    //   }

    //   if (error) {
    //     return <div className="text-center">{error}</div>;
    //   }
  return (
    <>
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
              <button
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
              onClick={handleNotifications}
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
              onClick={() => setModal(true)}
              />
              ) : (
              <FaRegUser
                className="w-5 h-5 text-white"
                aria-label="Default user icon"
              />
          )}
          <UpdateProfileModal Modal={Modal} setModal={setModal}/>
        </div>

        {showModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 border-white">
            <div className="bg-black border  border-white rounded-xl w-5/12 max-w-3xl p-6 relative">

             <button
               onClick={handleCloseVideoModal}
               className="absolute right-4 top-4 bg-transparent text-gray-400 hover:text-white transition-colors focus:outline-none hover:border-transparent"
               aria-label="Close modal"
             >
               <FiX size={24} />
             </button>
 
             <h2 className="text-2xl font-bold text-white mb-6">Upload Video</h2>
 
             <div className="max-h-[70vh] overflow-y-auto pr-2">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <div className="space-y-2">
                   <label className="block text-gray-300 text-sm font-medium">
                     Video File
                   </label>
                   <div className="relative">
                     <input
                       type="file"
                       accept="video/*"
                       {...register("videoFile", { required: "Video is required" })}
                       onChange={handleVideoChange}
                       className="hidden"
                       id="video-upload"
                     />
                     {!videoPreview && (
                       <label
                         htmlFor="video-upload"
                         className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-white transition-colors"
                       >
                         <div className="text-center">
                           <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                           <span className="text-gray-400">Click to upload video</span>
                         </div>
                       </label>
                     )}
                     {errors.video && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <FiAlertCircle className="mr-1" />
                         {errors.video.message}
                       </p>
                     )}
                   </div>
                 </div>
 
                 {videoPreview && (
                   <div className="relative">
                     <button
                       onClick={handleRemoveVideo}
                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                       aria-label="Remove video"
                     >
                       <FiX size={20} />
                     </button>
                     <div className="aspect-w-16 aspect-h-9">
                       <video
                         src={videoPreview}
                         controls
                         className="rounded-lg w-full"
                       >
                         Your browser does not support the video tag.
                       </video>
                     </div>
                   </div>
                 )}
 
                 <div className="space-y-2">
                   <label className="block text-gray-300 text-sm font-medium">
                     Thumbnail
                   </label>
                   <div className="relative">
                     <input
                       type="file"
                       accept="image/*"
                       {...register("thumbnail", { required: "Thumbnail is required" })}
                       onChange={handleThumbnailChange}
                       className="hidden"
                       id="thumbnail-upload"
                     />
                     <label
                       htmlFor="thumbnail-upload"
                       className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-white  transition-colors"
                     >
                       {thumbnailPreview ? (
                         <img
                           src={thumbnailPreview}
                           alt="Thumbnail preview"
                           className="max-h-40 rounded"
                         />
                       ) : (
                         <div className="text-center">
                           <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                           <span className="text-gray-400">Click to upload thumbnail</span>
                         </div>
                       )}
                     </label>
                     {errors.thumbnail && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <FiAlertCircle className="mr-1" />
                         {errors.thumbnail.message}
                       </p>
                     )}
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <label className="block text-gray-300 text-sm font-medium">
                     Title
                   </label>
                   <input
                     type="text"
                     {...register("title", { required: "Title is required" })}
                     className="w-full bg-black border border-gray-300 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                     placeholder="Enter video title"
                   />
 
                   {errors.title && (
                     <p className="text-red-500 text-sm mt-1 flex items-center">
                       <FiAlertCircle className="mr-1" />
                       {errors.title.message}
                     </p>
                   )}
                 </div>
 
                 <div className="space-y-2">
                   <label className="block text-gray-300 text-sm font-medium">
                     Description
                   </label>
                   <textarea
                     {...register("description", { required: "Description is required" })}
                     className="w-full bg-black border border-gray-300 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors h-32 resize-none"
                     placeholder="Enter video description"
                   />
                   {errors.description && (
                     <p className="text-red-500 text-sm mt-1 flex items-center">
                       <FiAlertCircle className="mr-1" />
                       {errors.description.message}
                     </p>
                   )}
                 </div>
 
                 <div className="flex justify-end space-x-4">
                   <button
                     type="button"
                     onClick={() => setShowModal(false)}
                     className="px-6 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition-colors"
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? "Uploading" : "Upload"}
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
        )}

        {notiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 border-white">
            <div className="bg-black border  border-white rounded-xl w-5/12 max-w-3xl p-6 relative">
              <button onClick={handleCloseNotificationModal} className="absolute top-4 right-4 text-white hover:text-gray-400" >
                ✕
              </button>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className="flex items-start justify-between p-3 border-b border-gray-700 last:border-0"
                >
                  <p className="text-white">{notification.message}</p> 
                </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No notifications available.</p>
              )}  
            </div>
          </div>
        )}

      </nav>
    </>
  )
}

export default Navbar
