# 🌾 RythuMitra -- AI Voice Assistant for Farmers

**Talk to AI. Get farming guidance in your own language.**

RythuMitra is a mobile-first AI-powered voice assistant designed to make
agricultural information accessible to Indian farmers through simple,
natural conversations.

Farmers don't need to type messages, navigate complicated menus or
understand technical terminology. They simply open the application, tap
a microphone button, ask a question in their native language and receive
a spoken response.

Initially, the application focuses on Telugu-speaking farmers, with
support for additional Indian languages planned for the future.

------------------------------------------------------------------------

## 🎯 Vision

Make AI accessible to every farmer, regardless of their technical
knowledge or literacy level.

**The core experience:**

🎙️ Speak → 🧠 Understand → 🤖 Generate Response → 🔊 Listen

------------------------------------------------------------------------

## ✨ Key Features

-   **Voice-First Interaction:** Ask agricultural questions simply by
    speaking.
-   **Telugu Speech Recognition:** Convert spoken Telugu into text using
    Sarvam AI Saaras.
-   **AI-Powered Responses:** Understand questions and generate
    practical farming guidance.
-   **Natural Voice Responses:** Convert AI-generated answers into
    spoken Telugu using Sarvam AI Bulbul.
-   **Continuous Conversations:** Ask follow-up questions without
    restarting the application.
-   **Simple Interface:** One prominent microphone button with minimal
    navigation.
-   **Mobile-First Design:** Designed primarily for smartphones and
    elderly users.

------------------------------------------------------------------------

## 🛠️ Technology Stack

  Component           Technology
  ------------------- ---------------------------
  Frontend            React.js
  Build Tool          Vite
  Styling             Tailwind CSS
  Backend             Node.js
  Backend Framework   Express.js
  Speech-to-Text      Sarvam AI Saaras
  Language Model      Sarvam AI LLM
  Text-to-Speech      Sarvam AI Bulbul
  Audio Recording     Browser MediaRecorder API
  API Communication   Fetch API

------------------------------------------------------------------------

## 🏗️ System Architecture

``` text
             FARMER
                |
                v
        REACT MOBILE APP
                |
                v
        MICROPHONE BUTTON
                |
                v
          AUDIO RECORDING
                |
                v
         EXPRESS BACKEND
                |
                v
         SARVAM SAARAS
          (Speech to Text)
                |
                v
          SARVAM LLM
       (AI Understanding)
                |
                v
          SARVAM BULBUL
          (Text to Speech)
                |
                v
         GENERATED AUDIO
                |
                v
          FARMER LISTENS
```

All AI API calls are handled securely through the backend. API keys must
never be exposed in frontend code.

------------------------------------------------------------------------

## 📱 Mobile-First UI/UX

RythuMitra prioritizes smartphone usability.

### Design Principles

-   Large and prominent circular microphone button.
-   Simple Telugu instructions.
-   Large, readable typography.
-   High-contrast colours.
-   Agricultural-inspired green and warm neutral theme.
-   Minimal navigation and visual clutter.
-   Touch-friendly interactive elements.
-   Responsive layout for different smartphone screens.

### Application States

  State        User Feedback
  ------------ -----------------------------------------
  Idle         Tap to Speak
  Recording    Listening...
  Processing   Understanding your question...
  Speaking     Speaking...
  Completed    Response displayed
  Error        Something went wrong. Please try again.

------------------------------------------------------------------------

## 📂 Project Structure

``` text
rythumitra/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Microphone.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   └── Conversation.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   └── sarvamService.js
│   ├── middleware/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

-   Node.js
-   npm
-   Git
-   A Sarvam AI API key

### 1. Clone the Repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd rythumitra
```

### 2. Setup Backend

``` bash
cd server
npm install
```

Create a `.env` file inside the server directory.

``` env
PORT=5000
SARVAM_API_KEY=your_api_key_here
```

### 3. Setup Frontend

Open another terminal:

``` bash
cd client
npm install
```

### 4. Run the Application

Start the backend:

``` bash
cd server
npm run dev
```

Start the frontend in another terminal:

``` bash
cd client
npm run dev
```

Open the local development URL provided by Vite.

------------------------------------------------------------------------

## 🔐 Environment Variables

  Variable         Description
  ---------------- ----------------------------------
  PORT             Backend server port
  SARVAM_API_KEY   Sarvam AI API authentication key

Never commit `.env` files or expose API credentials publicly.

------------------------------------------------------------------------

## 🧠 AI Assistant Behaviour

RythuMitra should behave like a friendly agricultural assistant.

Its responses should:

-   Be in simple Telugu.
-   Be short and easy to understand.
-   Provide practical farming guidance.
-   Avoid complicated technical terminology.
-   Ask follow-up questions when necessary.
-   Avoid inventing agricultural facts.
-   Clearly communicate uncertainty.
-   Recommend consulting qualified agricultural experts for uncertain or
    potentially dangerous treatments.

------------------------------------------------------------------------

## 🚀 Development Roadmap

  Phase   Task                              Status
  ------- --------------------------------- ---------
  1       React and Express setup           Planned
  2       Mobile-first UI                   Planned
  3       Microphone and audio recording    Planned
  4       Sarvam Saaras integration         Planned
  5       Sarvam LLM integration            Planned
  6       Sarvam Bulbul integration         Planned
  7       Continuous conversations          Planned
  8       Mobile testing and optimization   Planned

------------------------------------------------------------------------

## 🔮 Future Enhancements

The initial version focuses exclusively on voice conversations.

Potential future enhancements include:

-   Additional Indian language support.
-   Crop disease identification through images.
-   Weather-based farming recommendations.
-   Real-time market price information.
-   Government agricultural scheme information.

These features are outside the initial MVP scope.

------------------------------------------------------------------------

## 🎯 MVP Success Criteria

The project is successful when a farmer can:

1.  Open RythuMitra on a smartphone.
2.  Tap the microphone.
3.  Ask a farming question in Telugu.
4.  Receive an AI-generated response.
5.  Listen to the response in clear, natural Telugu.
6.  Ask another question and continue the conversation.

No complicated navigation. No unnecessary features.

**Just a farmer, a microphone and an AI assistant that understands their
language.**

------------------------------------------------------------------------

## 👨‍💻 Project Philosophy

Technology should adapt to people, not the other way around.

RythuMitra aims to bridge the gap between modern AI technology and
everyday farming by making information accessible through the simplest
possible interface.

**🌾 RythuMitra -- మీ భాషలో, మీ వ్యవసాయానికి ఒక స్నేహితుడు.**
