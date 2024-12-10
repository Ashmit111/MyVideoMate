import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";

const AuthModal = ({ isOpen, toggleModal, isLogin, toggleForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  
  const [profilePic, setProfilePic] = useState(null);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    reset();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    } else {
      setProfilePic(null);
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
      <div className="bg-black text-white rounded-lg p-6 w-full max-w-sm relative shadow-2xl border border-white">
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

        {/* Profile Picture Upload Section */}
        {!isLogin && (
          <div className="flex justify-center mb-4">
            <label
              htmlFor="profilePic"
              className="relative cursor-pointer rounded-full w-24 h-24 overflow-hidden border-4 border-gray-400 flex items-center justify-center"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-400 text-xl">+</span>
              )}
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProfilePicChange}
              />
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                {...register("username", { required: "Username is required" })}
                type="text"
                id="username"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
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
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
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
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                OTP
              </label>
              <input
                {...register("otp", { required: "OTP is required" })}
                type="text"
                id="otp"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-gray-200 text-black rounded-md hover:opacity-90 transition-all font-semibold hover:bg-white"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <button
            type="button"
            className="w-full py-2 bg-gray-800 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-gray-900 transition-all border border-gray-600"
          >
            <FcGoogle size={20} />
            <span>{isLogin ? "Login with Google" : "Register with Google"}</span>
          </button>

          <p className="text-center text-sm text-gray-400 mt-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-white font-medium"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
