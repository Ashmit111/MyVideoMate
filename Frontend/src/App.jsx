import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from 'react';
import { FaVideo, FaBars, FaTimes, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import AuthModal from './components/ui/AuthModal';  

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Login Modal
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 


  const toggleModal = () => setIsOpen(!isOpen);
  const toggleForm = () => setIsLogin(!isLogin);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className='bg-gray-900 h-screen w-screen overflow-x-hidden'>
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-gray-900/20 backdrop-blur-sm z-0" />
      
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FaVideo className="text-red-600 text-2xl" />
              </motion.div>
              <span className="text-xl font-bold text-white">MyTube</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-6 py-2 rounded-2xl bg-transparent text-white hover:bg-gray-800 transition-all duration-300 text-md">
                HOME
              </button>
              <button className="px-6 py-2 rounded-2xl bg-transparent text-white hover:bg-gray-800 transition-all duration-300 text-md">
                ABOUT
              </button>
              <button className="px-6 py-2 rounded-2xl bg-transparent text-white hover:bg-gray-800 transition-all duration-300 text-md"
              onClick={() => {
                setIsLogin(true);
                toggleModal();
              }}>
                LOGIN
              </button>
            </div>


            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-transparent text-white hover:bg-gray-800/30 transition-all duration-300"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["GO", "ABOUT", "LOGIN"].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-3 py-1 rounded-lg bg-transparent text-white hover:bg-gray-800/30 transition-all duration-300 text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-16">
  <motion.div
    style={{ opacity }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
  >
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Left Content */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-left space-y-6 md:w-5/12" 
      >
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-900">
          Welcome to MYTube
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Your ultimate video companion for seamless <br />content creation and
          sharing
        </p>
        <div className="flex items-start">
          <button className="px-6 py-2 rounded-lg bg-red-600 hover:bg-gray-700 transition-all duration-300 text-base font-semibold text-white">
            Get Started
          </button>
        </div>
      </motion.div>
      <AuthModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        isLogin={isLogin}
        toggleForm={toggleForm} 
      />
        
      {/* Right Content */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{ scale }}
        transition={{ duration: 1 }}
        className="md:w-5/12 mt-10 md:mt-0 relative"
      >
        <div className="relative">
          <img
            src="https://img.freepik.com/free-vector/youtube-tutorial-concept-illustration_114360-2807.jpg?t=st=1732461862~exp=1732465462~hmac=375da324153529c378512e99bc900cbd910dd8db7a9333cfefd888d5b212f4f9&w=900"
            alt="Video editing"
            className="rounded-2xl shadow-2xl"
          />
          <motion.div
            className="absolute -inset-2 bg-gradient-to-l from-gray-600 to-gray-900 rounded-2xl -z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  </motion.div>
</main>

{/* Footer */}
<footer className="relative z-0 bg-gray-900  backdrop-blur-md py-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Top Section */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      {/* Logo and Description */}
      <div className="flex items-center space-x-3 mb-6 md:mb-0">
        <FaVideo className="text-red-600 text-xl" />
        <div>
          <h2 className="text-lg font-semibold text-white">MyTube</h2>
          <p className="text-sm text-gray-400">
            Your ultimate video companion for seamless content creation and sharing.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-medium text-white mb-3">Company</h3>
          <ul className="space-y-2">
            {["About Us", "Careers", "Blog"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-white mb-3">Support</h3>
          <ul className="space-y-2">
            {["Help Center", "FAQs", "Contact Us"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-white mb-3">Legal</h3>
          <ul className="space-y-2">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-gray-800 my-6"></div>

    {/* Bottom Section */}
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Social Media */}
      <div className="flex space-x-4 mb-4 md:mb-0">
        {[
          { icon: <FaFacebookF />, href: "#" },
          { icon: <FaTwitter />, href: "#" },
          { icon: <FaInstagram />, href: "#" },
          { icon: <FaLinkedin />, href: "#" },
        ].map(({ icon, href }, index) => (
          <a
            key={index}
            href={href}
            className="text-gray-400 hover:text-red-600 transition-colors duration-300 text-xl"
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <span className="text-sm text-gray-400">
        © 2024 MyTube. All rights reserved.
      </span>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-sm text-gray-400 hover:text-red-600 transition-colors duration-300 mt-4 md:mt-0"
      >
        Back to Top ↑
      </button>
    </div>
  </div>
</footer>

    </div>
  )
}

export default App
