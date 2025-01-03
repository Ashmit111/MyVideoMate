import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaVideo } from "react-icons/fa";
import { motion } from "framer-motion"; // Required for Navbar animations

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Ashmit Singh",
      role: "Full Stack Developer",
      image:
        "http://res.cloudinary.com/dcelvyozd/image/upload/v1735719226/xom9jyoouzhewqtza6ee.jpg",
      github: "https://github.com/Ashmit111",
      linkedin: "https://www.linkedin.com/in/ashmit-singh-768456257/",
      twitter: "https://x.com/__ashmit____",
      bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code solutions.",
    },
  ];

  const platformFeatures = [
    {
      title: "Video Streaming",
      description:
        "High-quality, buffer-free streaming with adaptive bitrate technology for optimal viewing experience across all devices.",
    },
    {
      title: "Content Creation",
      description:
        "Advanced tools for creators including video editing, thumbnail creation, and analytics to grow their channel.",
    },
    {
      title: "Community Engagement",
      description:
        "Interactive features like comments, likes, and sharing to build and engage with your audience effectively.",
    },
    {
      title: "Monetization",
      description:
        "Multiple revenue streams including ads, channel memberships, and Super Chat to help creators earn from their content.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden w-[calc(100vw-17px)]">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-900 opacity-80 -z-10"></div>

      {/* Navbar Integration */}
      <nav
        className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md transition-all duration-300"
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
            <div className="hidden md:flex items-center space-x-4">
               
              <a href="/" className="text-white hover:text-gray-300">
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Welcome to MyTube, where we reimagine video sharing and content creation.
          </p>
        </div>

        {/* Platform Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {platformFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-8 transform hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold text-purple-400 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Team Members Section */}
<div id="team" className="mx-auto">
  {teamMembers.map((member, index) => (
    <div
      key={index}
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-10"
    >
      <div className="p-8">
        <div className="flex flex-col items-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-48 h-48 object-cover rounded-full shadow-lg mb-6"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3";
            }}
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {member.name}
            </h2>
            <p className="text-lg text-purple-400 mb-4">{member.role}</p>
            <p className="text-gray-300 mb-6">{member.bio}</p>
            <div className="flex justify-center space-x-4">
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  <FaGithub />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  <FaLinkedin />
                </a>
              )}
              {member.twitter && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  <FaTwitter />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default AboutUs;
