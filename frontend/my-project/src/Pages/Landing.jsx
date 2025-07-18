// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center text-white">
      <div className="text-center p-6">
        <motion.img
          src={logo}
          alt="NexaChatAI Logo"
          className="w-96 h-80 mx-auto  mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        />

        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          NexaChat AI
        </motion.h1>

        <motion.p
          className="text-2xl mb-2 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your intelligent assistant for instant answers.
        </motion.p>
        <motion.p
          className="text-xl mb-6 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Ask anything, get smarter, faster responses.
        </motion.p>

        <motion.button
          onClick={() => navigate("/chatbot")}
          className="bg-blue-300  px-6 py-3 rounded-2xl  w-40 h-16 mb-20 font-bold shadow-2xl transition cursor-pointer text-xl text-blue-900 "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Now
        </motion.button>
      </div>
     

    </div>
  );
}
