import React from 'react' 
import { useForm } from 'react-hook-form';

const OTPModal = ({ isOpen, toggleModal }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    const onVerifyOTP = async (data) => {
      const storedData = JSON.parse(sessionStorage.getItem("userData"));
      const { otp } = data;
  
      if (otp === storedData.otpCode) {
        console.log("OTP verified successfully!");
        // Proceed with further logic, e.g., saving user to the database
        sessionStorage.removeItem("userData"); // Clean up
        toggleModal(); // Close OTP modal
      } else {
        console.error("Invalid OTP!");
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div
        id="overlay"
        onClick={(e) => e.target.id === "overlay" && toggleModal()}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-black text-white rounded-lg px-6 py-4 w-full max-w-sm relative shadow-2xl border border-white">
          <h2 className="text-2xl font-bold mb-4 text-center bg-white text-transparent bg-clip-text">
            OTP Verification
          </h2>
  
          <form onSubmit={handleSubmit(onVerifyOTP)} className="space-y-3">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                Enter OTP
              </label>
              <input
                {...register("otp", { required: "OTP is required" })}
                type="text"
                id="otp"
                className="w-full px-4 py-1 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white text-white"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
            </div>
  
            <button
              type="submit"
              className="w-full py-2 bg-gray-200 text-black rounded hover:opacity-90 transition font-semibold"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    );
  };

export default OTPModal;
