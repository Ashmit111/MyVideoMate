import React from 'react' 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const OTPModal = ({ isOpen, toggleOTPModal, avatar, coverImage }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
  
    const onVerifyOTP = async (data) => {
      const storedData = JSON.parse(sessionStorage.getItem("userData"));
      const { otp } = data;
      console.log(storedData);
      console.log(otp);

      console.log(avatar);
      console.log(coverImage);

      const formData = new FormData();
      formData.append("fullName", storedData.fullName);
      formData.append("email", storedData.email);
      formData.append("username", storedData.username);
      formData.append("password", storedData.password);
      formData.append("avatar", avatar );
      formData.append("coverImage", coverImage  || null);
  
      
      if (otp === storedData.otpCode) {
        console.log("OTP verified successfully!");
         
        const response = await axios.post('/api/v1/users/register', formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        });
        
        console.log(response.data);
        sessionStorage.removeItem("userData");  
        reset();
        toggleOTPModal(); 
        navigate("/");
      } else {
        console.error("Invalid OTP!");
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div
        id="overlay"
        // onClick={(e) => e.target.id === "overlay" && toggleOTPModal()}
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
                className="w-full px-4 py-1 bg-black border border-white rounded focus:outline-none text-white"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
            </div>
  
            <button
              type="submit"
              className="w-full py-2 bg-white text-black rounded hover:opacity-90 transition font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying" : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    );
  };

export default OTPModal;
