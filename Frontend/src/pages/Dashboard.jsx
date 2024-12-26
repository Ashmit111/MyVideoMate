import React, { useState, useEffect } from 'react'; 
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import axiosInstance from '@/utils/axiosInstance'; 
import { useForm } from 'react-hook-form';

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState(""); 
  const [totalViews, setTotalViews] = useState(0);
  const [subscriptionCounts, setSubscriptionCounts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [updateModal, setUpdateModal] = useState(false); 
  const [videoId, setVideoId] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const { register, handleSubmit,setValue, formState: { errors } } = useForm();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file)); // Preview image
      setValue('thumbnail', file); // Set file in form state (for submission)
    }
  };

  const handleDelete = async (videoId) => { 
    const response = await axiosInstance.delete(`/videos/${videoId}`);
    console.log(response.data);
  }

  const onSubmit = async (data) => {  
    console.log(data);
     
    const response = await axiosInstance.patch(`/videos/${videoId}`,data, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    }); 
    console.log(response.data);
  }

  const openModal = async (videoId) => {
    setUpdateModal(true);
    setVideoId(videoId);
  }

  const closeModal = () => {
    setUpdateModal(false);
  }
 

  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        const response = await axiosInstance.get("/users/channel-views");
        setTotalViews(response.data.data);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    const fetchSubscriptionData = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/subscriberCount");
        const { subscriptionCount } = response.data.data;
        setSubscriptionCounts(subscriptionCount);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const response = await axiosInstance.get("/users/channel-likes");
        setTotalLikes(response.data.totalLikes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    const fetchUserVideoData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUsername(response.data.username);
        console.log(response.data.videos); 
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching user video data:", error);
      }
    };

    fetchUserVideoData();
    fetchTotalViews();
    fetchSubscriptionData();
    fetchTotalLikes();
  }, []);

  return (
    <div className="h-screen bg-black w-screen overflow-y-scroll">
      {/* Navbar */}
      <nav className="w-full fixed bg-black h-16 flex items-center z-50 border-b border-gray-600">
        <div className="flex items-center py-3">
          <div className="flex gap-2 items-center px-3 ml-2">
            <img src="./public/mytube.svg" alt="Logo" className="w-8 h-8 pt-1" />
            <h2 className="pt-1 text-lg text-white">MyTube</h2>
          </div>
        </div>
        <div className="mx-auto">
          <h2 className="text-white font-bold text-2xl pt-3 flex gap-2">
            Admin Dashboard
          </h2>
        </div>
      </nav>

      {/* Content Section */}
      <div className="pt-16 bg-black text-white w-full">
        {/* Header Section */}
        <header className="p-6 ">
          <h1 className="text-3xl font-bold">Welcome Back, {username}</h1>
          <p className="text-sm text-gray-400">Seamless Video Management, Elevated Results</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 m-10">
            <div className="p-4 bg-black rounded-lg pl-5 border border-white mx-4">
              <MdOutlineRemoveRedEye className="w-6 h-6 text-white mb-5" />
              <h2 className="text-md mb-1">Total Views</h2>
              <p className="text-3xl font-semibold">{totalViews}</p>
            </div>
            <div className="p-4 bg-black rounded-lg pl-5 border border-white mx-4">
              <FaRegUser className="w-6 h-6 text-white mb-5" />
              <h2 className="text-md mb-1">Total Subscribers</h2>
              <p className="text-3xl font-semibold">{subscriptionCounts}</p>
            </div>
            <div className="p-4 bg-black rounded-lg pl-5 border border-white mx-4">
              <FaRegHeart className="w-6 h-6 text-white mb-5" />
              <h2 className="text-md mb-1">Total Likes</h2>
              <p className="text-3xl font-semibold">{totalLikes}</p>
            </div>
          </div>
        </header>

        {/* Video Table */}
        <section className="mt-8 px-6">
          <div className="overflow-x-auto">
            <table className="w-full bg-black mb-3">
              <thead>
                <tr className=" border border-white">
                  <th className="p-4">Uploaded</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Date Uploaded</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className='ml-9'>
                {/* Uncomment and use when video data is available */}
                {videos.map((video) => (
                  <tr key={video._id} className="border-b border-l border-r border-gray-300 text-center">
                    <td className="p-4 flex items-center pl-14">
                      <img
                        src={video.thumbnail}
                        alt="thumbnail"
                        className="w-12 h-12 object-cover mr-4 rounded-3xl"
                      />
                      <span>{video.title}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-green-600 py-1 px-3 rounded-full">
                        {video.likes} likes
                      </span>
                    </td>
                    <td className="p-4">{video.date || "00"}</td>
                    <td className=" flex gap-2 justify-center p-2">
                    {/* Update Button */}
                      <button onClick={() => openModal(video._id)}  className=" bg-transparent  pb-3 text-white py-1 px-1 focus:outline-none hover:border-transparent  hover:text-gray-400" >
                         <LuPencil className='h-5 w-5' />
                      </button>

                    {/* Delete Button */}
                      <button onClick={() => handleDelete(video._id)} className=" bg-transparent pb-3 text-white py-1 px-1 focus:outline-none hover:border-transparent hover:text-gray-400" >
                        <MdDelete className='h-5 w-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {/* Update Modal */}  
      {updateModal && (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center bg-black bg-opacity-80">
        <div className="modal-content bg-black text-white p-6 rounded-md w-1/3">
          <h2 className="text-xl mb-4">Update Video</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Thumbnail File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="thumbnail">Thumbnail</label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
              />
              {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}

              {/* Display image preview if available */}
              {thumbnailPreview && (
                <div className="mt-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-700 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
     
  );
}

export default Dashboard;
