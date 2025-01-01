import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/utils/axiosInstance';
import { showEmojiToast,showErrorToast } from '@/utils/toastNotification'; 
import { updateUser } from '@/Features/authSlice'; 
import { useDispatch } from 'react-redux';

const UpdateProfileModal = ({ Modal, setModal }) => {
  const [activeTab, setActiveTab] = useState(null); // No tab active initially
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const dispatch = useDispatch();

  const onUpdateUsername = async (data) => {
    try {
        console.log('Username data submitted:', data.username); 
        const response = await axiosInstance.patch('/users/update-account', data);
        console.log(response.data.data.username);
        dispatch(updateUser({ username: response.data.data.username }));
        setModal(false);
        reset();
        showEmojiToast('Username updated successfully', '🎉');
    } catch (error) {
        showErrorToast('Failed to update username');
    }
  };

  const onUpdateAvatar = async (data) => {
    try {
      // Create a FormData object and append the avatar file
      const formData = new FormData();
      formData.append('avatar', data.avatar[0]);
  
      // Send the FormData object via axios
      const response = await axiosInstance.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data);
      dispatch(updateUser({ avatar: response.data.data.avatar }));
      setModal(false);
      reset();
      showEmojiToast('Avatar updated successfully', '🎉');
    } catch (error) {
      showErrorToast('Failed to update avatar');
      console.error('Error updating avatar:', error);
    }
  };
  

  const onUpdateCoverImage = async (data) => {
    try { 
        const formData = new FormData();
        formData.append('coverImage', data.coverImage[0]);
        const response = await axiosInstance.patch('/users/cover-image', formData,{headers: {
          'Content-Type': 'multipart/form-data',
        },});
        console.log(response.data);
        dispatch(updateUser({ coverImage: response.data.data.coverImage }));
        setModal(false);
        reset();
        showEmojiToast('Cover Image updated successfully', '🎉');
    } catch (error) {
        showErrorToast('Failed to update cover image');
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'username':
        return (
          <form onSubmit={handleSubmit(onUpdateUsername)} className="space-y-3">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                New Username
              </label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                id="username"
                className="w-full px-4 py-1 bg-black border border-white rounded focus:outline-none text-white"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-white text-black rounded hover:opacity-90 transition font-semibold "
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating' : 'Update Username'}
            </button>
          </form>
        );
      case 'avatar':
        return (
          <form onSubmit={handleSubmit(onUpdateAvatar)} className="space-y-3">
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-300"
              >
                Upload New Avatar
              </label>
              <input
                {...register('avatar', { required: 'Avatar is required' })}
                type="file"
                id="avatar"
                className="w-full px-4 py-1 bg-black border border-white rounded focus:outline-none text-white"
                accept="image/*"
              />
              {errors.avatar && (
                <p className="text-red-500 text-sm">{errors.avatar.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-white text-black rounded hover:opacity-90 transition font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating' : 'Update Avatar'}
            </button>
          </form>
        );
      case 'coverImage':
        return (
          <form onSubmit={handleSubmit(onUpdateCoverImage)} className="space-y-3">
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-300"
              >
                Upload New Cover Image
              </label>
              <input
                {...register('coverImage', { required: 'Cover image is required' })}
                type="file"
                id="coverImage"
                className="w-full px-4 py-1 bg-black border border-white rounded focus:outline-none text-white"
                accept="image/*"
              />
              {errors.coverImage && (
                <p className="text-red-500 text-sm">{errors.coverImage.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-white text-black rounded hover:opacity-90 transition font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating' : 'Update Cover Image'}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  if (!Modal) return null; // If modal is not active, don't render anything

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black text-white rounded-lg px-6 py-4 w-full max-w-sm relative shadow-2xl border border-white">
        <h2 className="text-2xl font-bold mb-4 text-center bg-white text-transparent bg-clip-text">
          Update Profile
        </h2>

        {/* Close Button */}
        <button
          onClick={() => setModal(false)}
          className="absolute top-2 right-2 text-white text-lg focus:outline-none hover:border-transparent bg-transparent"
        >
          &times;
        </button>

        {/* Tabs for switching between update options */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('username')}
            className={`px-2 py-2 focus:outline-none hover:border-transparent bg-transparent ${
              activeTab === 'username' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
            } rounded`}
          >
            Username
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-2 py-2 focus:outline-none hover:border-transparent bg-transparent ${
              activeTab === 'avatar' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
            } rounded`}
          >
            Avatar
          </button>
          <button
            onClick={() => setActiveTab('coverImage')}
            className={`px-2 py-2 focus:outline-none hover:border-transparent bg-transparent ${
              activeTab === 'coverImage'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            } rounded`}
          >
            Cover Image
          </button>
        </div>

        {/* Render the selected form only if a tab is active */}
        {activeTab && renderForm()}
      </div>
    </div>
  );
};

export default UpdateProfileModal;
