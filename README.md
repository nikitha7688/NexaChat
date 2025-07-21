 NexaChat AI – Intelligent FAQ Chatbot
NexaChat AI is a smart, responsive FAQ chatbot built using modern web technologies to simulate human-like conversation and assist users by answering common queries. It integrates with Gemini AI API (from Google) to deliver relevant, real-time responses based on user input.

📦 Tech Stack
🚀 Frontend
React JS – Component-based UI architecture

Tailwind CSS – Utility-first modern CSS framework for responsive design

JavaScript – For app logic, hooks, and user interactivity

🛠 Backend
Node.js – JavaScript runtime for server-side development

Express.js – Minimal and flexible Node.js web framework

Axios – Promise-based HTTP client for making API requests

🧠 AI Integration
Google Gemini AI API – Integrated via GEMINI_API_KEY to process and respond to user messages intelligently

💡 Features
💬 Interactive chatbot UI with animated message display

🎨 Clean, responsive design with light/dark theme toggle

📜 Chat history with message timestamping

🧠 AI-driven answers powered by Google Gemini API

🔄 Typing indicator animation to simulate real conversation

📁 Frontend and backend fully connected using Axios

🔐 Secure API key usage via environment variables (.env)



*How to Run NexaChat AI Locally*

Follow these steps to clone, install, and run both the frontend and backend of NexaChat AI on your local machine.

Step 1: Clone the Repository
git clone https://github.com/nikitha7688/NexaChat.git

Step 2: Setup the Frontend

Navigate into the frontend directory:
cd frontend

Navigate into your frontend project folder :
cd my-project
Install frontend dependencies:
npm install
Start the development server:
npm run dev
You can now access the frontend at: http://localhost:5173

Step 3: Setup the Backend
Open a new terminal
Navigate to the backend folder:
cd backend
Install backend dependencies:
npm install
In .env file in the backend folder and add your Gemini API key:
GEMINI_API_KEY=your_api_key_here
Note:You can either use your own Gemini API key or the existing one if it's already provided in the project.
Start the backend server:
node server.js


