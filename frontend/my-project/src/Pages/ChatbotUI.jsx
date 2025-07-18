import React, { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  TrashIcon,
  PlusIcon,
  PaperAirplaneIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.jpg";
import profile from "../assets/profile.jpg";

export default function ChatbotUI() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Hey there! I'm your assistant 🤖. How can I help you today?",
            time: new Date().toLocaleTimeString(),
          },
        ];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("chat_history");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (item) =>
            item &&
            typeof item === "object" &&
            "user" in item &&
            "bot" in item &&
            "time" in item
        )
      ) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const sidebarRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark_mode") === "true";
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("dark_mode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Update history with user & bot pair later after bot reply
    // So let's keep a temporary variable for history update on bot reply

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botReply = data.reply || "Hmm, I didn't catch that.";
      const botMessage = {
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setTyping(false);

        // Update history with structured object after bot reply is added
        setHistory((prev) => {
          const updated = [
            ...prev,
            {
              user: input,
              bot: botReply,
              time: new Date().toLocaleTimeString(),
            },
          ];
          localStorage.setItem("chat_history", JSON.stringify(updated));
          return updated;
        });
      }, 1500);
    } catch (error) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! API issue 😔 Please try again later.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chat_messages");
    setMessages([]);
  };

  const clearPromptHistory = () => {
    localStorage.removeItem("chat_history");
    setHistory([]);
  };

  const handleNewChat = () => {
    const initialBotMessage = {
      sender: "bot",
      text: "Hey! How can I assist you today? 😊",
      time: new Date().toLocaleTimeString(),
    };
    setMessages([initialBotMessage]);
  };

  const handleHistoryClick = (item) => {
    // item is { user, bot, time }
    setMessages([
      {
        sender: "user",
        text: item.user,
        time: new Date().toLocaleTimeString(),
      },
      {
        sender: "bot",
        text: item.bot,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div
      className={`h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="flex h-full relative">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`w-64 ${
            darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
          } p-4 flex-col justify-between transform transition-transform duration-300 z-50 h-full md:static md:flex ${
            sidebarOpen ? "flex fixed" : "hidden"
          }`}
        >
          <div>
            <div className="text-xl font-bold mb-4 flex items-center space-x-2">
              <img src={logo} alt="Logo" className="w-10 h-10 " />
              <span>NexaChat A.I+</span>
            </div>

            <button
              onClick={handleNewChat}
              className="bg-gray-600 text-white px-4 py-2 rounded mb-4 w-full font-semibold flex items-center justify-center gap-2 shadow"
            >
              <PlusIcon className="w-4 h-4" />
              New Chat
            </button>

            <h2
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              History
            </h2>
            <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {history.length > 0 ? (
                history
                  .slice()
                  .reverse()
                  .map((item, i) => (
                    <li
                      key={i}
                      className={`p-2 rounded cursor-pointer ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handleHistoryClick(item)}
                      title={`User: ${item.user}\nBot: ${item.bot}`}
                    >
                      <strong>User:</strong>{" "}
                      {item.user.length > 30
                        ? item.user.slice(0, 30) + "..."
                        : item.user}
                      <br />
                      <em>Bot:</em>{" "}
                      {item.bot.length > 30
                        ? item.bot.slice(0, 30) + "..."
                        : item.bot}
                    </li>
                  ))
              ) : (
                <li className="text-xs text-gray-400">No history yet</li>
              )}
            </ul>
          </div>

          <div className="space-y-2 mt-4">
            <button
              onClick={clearChat}
              className="bg-gray-600 text-white rounded px-3 py-2 text-sm hover:bg-gray-700 w-full flex items-center justify-center gap-1"
            >
              <TrashIcon className="w-4 h-4" />
              Clear Chat
            </button>
            <button
              onClick={clearPromptHistory}
              className="bg-gray-600 text-white rounded px-3 py-2 text-sm hover:bg-gray-700 w-full"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Header */}
          <div
            className={`p-4 flex justify-between items-center ${
              darkMode ? "bg-gray-950" : "bg-gray-400"
            }`}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl text-gray-100 md:hidden"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>

            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="w-16 h-12 " />
              <h2 className="text-2xl font-bold">NexaChat </h2>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4 text-gray-200 hover:text-white transition"
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Messages */}
          <div
            className={`p-6 overflow-y-auto space-y-4 flex-1 ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-6 h-6 " />
                  </div>
                )}
                <div
                  className={`p-4 rounded-lg max-w-xl ${
                    msg.sender === "bot"
                      ? darkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-white text-gray-700 shadow"
                      : darkMode
                      ? "bg-gray-600 text-gray-100"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-xs text-right mt-2 ${
                      darkMode ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center">
                    <img src={profile} alt="profile" className="w-6 h-6 " />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center">
                  <img src={logo} alt="Logo" className="w-6 h-6 " />
                </div>
                <div
                  className={`p-3 rounded-lg italic animate-pulse ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-500"
                  }`}
                >
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></span>
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1 delay-75"></span>
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className={`p-4 flex items-center ${
              darkMode ? "bg-gray-950" : "bg-gray-400"
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className={`flex-1 px-4 py-2 rounded-lg mr-2 focus:outline-none ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-300"
                  : "bg-gray-200 text-gray-800"
              }`}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className={`px-4 py-2 rounded-full flex items-center justify-center ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-700 hover:bg-gray-800 text-white"
              }`}
            >
              <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
