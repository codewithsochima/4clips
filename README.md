# 4Clips

**Turn long-form videos into short-form content.**

4Clips is an AI-powered video clipping platform designed to help content creators, streamers, podcasters and digital marketers transform long-form videos into engaging short-form clips.

The goal is to simplify video repurposing by using AI to identify interesting moments, generate captions and prepare videos for platforms such as TikTok, Instagram Reels and YouTube Shorts.

## Project Overview

Creating short-form content from long videos can be time-consuming. Finding the best moments, cutting footage, adding subtitles and adjusting video dimensions often requires multiple tools and manual effort.

4Clips aims to bring these processes together in one platform, making video repurposing faster and easier.

## Planned Features

- **Video Upload:** Upload supported video files for processing.
- **AI Highlight Detection:** Identify interesting and engaging moments in long-form videos.
- **Automatic Clip Generation:** Turn selected moments into short video clips.
- **Smart Captions:** Generate subtitles automatically using speech recognition.
- **Portrait Reframing:** Convert landscape videos into vertical 9:16 formats.
- **Engagement Scoring:** Evaluate clips for their potential to attract viewer attention.
- **Clip Preview:** Preview and review generated clips.
- **Video Export:** Download processed clips for social media.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend interface |
| Vite | Frontend development environment |
| Tailwind CSS | Styling |
| Node.js | Backend runtime |
| Express.js | Backend API |
| FFmpeg | Video processing |
| FFprobe | Video metadata analysis |
| Multer | Video upload handling |
| Whisper (planned) | AI-powered transcription |

## Project Structure

```text
4Clips/
├── client/             # React frontend
│   ├── src/
│   └── package.json
├── server/             # Node.js backend
│   ├── src/
│   ├── uploads/
│   ├── processed/
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- FFmpeg and FFprobe

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate into the project

```bash
cd 4Clips
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 5. Start the frontend

Inside the `client` folder:

```bash
npm run dev
```

### 6. Start the backend

Inside the `server` folder:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

The backend will run at:

`http://localhost:5000`

## Development Roadmap

- [x] Initialize React frontend
- [x] Configure Tailwind CSS
- [x] Set up Node.js and Express backend
- [x] Integrate FFmpeg and FFprobe into the development environment
- [ ] Build video upload functionality
- [ ] Implement video metadata extraction
- [ ] Implement automatic video clipping
- [ ] Integrate AI transcription
- [ ] Develop AI highlight detection
- [ ] Add automatic captions
- [ ] Implement smart portrait reframing
- [ ] Build clip preview and download functionality

## Content and Usage

Users should only upload or process videos they own or have permission to use. Support for external video links will depend on authorized sources and applicable platform restrictions.

## Contributions

Contributions, suggestions and feedback are welcome as the project develops.

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## Project Status

**Currently under active development.**

4Clips is being built incrementally, starting with the core frontend, backend and video-processing infrastructure. AI-powered features are planned for subsequent development stages.

---

**Built with curiosity and a passion for making content creation easier.**

If you find this project interesting, consider giving the repository a star.