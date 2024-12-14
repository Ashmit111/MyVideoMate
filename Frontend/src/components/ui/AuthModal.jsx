import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import emailjs from '@emailjs/browser';

const AuthModal = ({ isOpen, toggleModal, isLogin, toggleForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [avatar, setAvatar] = useState(null);
 
  const sendOTPEmail = async (email, otp) => {
    if (!email) {
      setError('Email is missing!');
      console.error('Email not provided for OTP');
      return;
    }

    const templateParams = {
      user_email: email, // Correctly use email from the form data
      otp_code: otp,
    };

    try {
      await emailjs.send(
        'service_97368wp',  // Replace with your EmailJS service ID
        'template_5ch5w8s', // Replace with your EmailJS template ID
        templateParams,
        'sjhWYCaqHvchcm5EZ'   // Replace with your EmailJS public key
      );
      console.log('OTP sent to email');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const onSubmit = (data) => {
    const avatarInput = document.getElementById("avatar");
    const coverImageInput = document.getElementById("coverImage");

    const formData = {
      ...data,
      avatar: avatarInput?.files[0] || null,
      coverImage: coverImageInput?.files[0] || null,
    };

    console.log(formData);
    reset();
    setAvatar(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAvatar(null);
    }
  };

  const closeOnOverlayClick = (e) => {
    if (e.target.id === "overlay") toggleModal();
  };

  if (!isOpen) return null;

  return (
    <div
      id="overlay"
      onClick={closeOnOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-black text-white rounded-lg px-6 py-4 w-full max-w-sm relative shadow-2xl border border-white">
        <button
          onClick={toggleModal}
          className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center bg-white text-transparent bg-clip-text">
          {isLogin ? "Welcome Back" : "Join Us"}
        </h2>

        {!isLogin && (
          <div className="flex justify-center mb-3">
            <label
              htmlFor="avatar"
              className="relative cursor-pointer rounded-full w-20 h-20 overflow-hidden border-2 border-gray-400 flex items-center justify-center"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-400 text-lg">+</span>
              )}
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  {...register("username", { required: "Username is required" })}
                  type="text"
                  id="username"
                  className="w-full px-4 py-1 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white text-white"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  Fullname
                </label>
                <input
                  {...register("fullName", { required: "Fullname is required" })}
                  type="text"
                  id="fullName"
                  className="w-full px-4 py-1 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white text-white"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className="w-full px-4 py-1 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              id="password"
              className="w-full px-4 py-1 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white text-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-300">
                Cover Image
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                className="w-full px-4 py-1 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-white text-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-gray-200 text-black rounded hover:opacity-90 transition font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <button
            type="button"
            className="w-full py-2 bg-gray-800 text-white rounded flex items-center justify-center space-x-2 hover:bg-gray-900 transition border border-gray-600"
          >
            <FcGoogle size={20} />
            <span>{isLogin ? "Login with Google" : "Register with Google"}</span>
          </button>

          <p className="text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-white font-medium"
            >
              {isLogin ? "Register" : "LogIn"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
