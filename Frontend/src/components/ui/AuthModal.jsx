import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";

const AuthModal = ({ isOpen, toggleModal, isLogin, toggleForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    reset();
  };

  const closeOnOverlayClick = (e) => {
    if (e.target.id === "overlay") toggleModal();
  };

  if (!isOpen) return null;

  return (
    <div
      id="overlay"
      onClick={closeOnOverlayClick}
      className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-black text-white rounded-lg p-8 w-full max-w-md relative shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
        <button
          onClick={toggleModal}
          className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          {isLogin ? "Welcome Back" : "Join Us"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
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
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
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
                  message: "Invalid email address"
                }
              })}
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
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
                  message: "Password must be at least 6 characters"
                }
              })}
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
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
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-800 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] border border-gray-600"
          >
            <FcGoogle size={20} />
            <span>{isLogin ? "Login with Google" : "Register with Google"}</span>
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300"
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
