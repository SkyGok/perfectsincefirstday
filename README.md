# 💕 Romantic Gallery Website

A beautiful, interactive 3D dome gallery website built with React, featuring romantic memories, smooth animations, and background music.

## ✨ Features

- **3D Dome Gallery**: Interactive rotatable dome displaying your memories
- **Blur Text Animation**: Beautiful animated intro message
- **Background Music**: Ambient music that plays throughout the experience
- **Color Bends Background**: Dynamic animated background
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Romantic Notes**: Click on any image to see a personalized note

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── public/
│   └── media/          # Images and audio files
├── src/
│   ├── components/     # React components
│   ├── styles/         # CSS files
│   └── App.jsx         # Main app component
└── .github/
    └── workflows/      # GitHub Actions for deployment
```

## 🎨 Customization

### Adding Images

1. Add your images to `/public/media/`
2. Update the `galleryItems` array in `src/App.jsx`
3. Add your romantic notes for each image

### Changing the Intro Message

Edit the `text` prop in `BlurText` component in `src/App.jsx`:

```jsx
<BlurText
  text="Your custom message here"
  ...
/>
```

### Background Music

1. Add your audio file to `/public/media/background-music.mp3`
2. Or update the `src` path in the `BackgroundMusic` component

## 📦 Deployment

This project is configured for GitHub Pages deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🛠️ Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [@use-gesture/react](https://use-gesture.netlify.app/)

## 📝 License

This project is private and personal.

## 💝 Made with Love

Created as a special gift for someone special.
