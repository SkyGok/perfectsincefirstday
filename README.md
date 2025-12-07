# 🌹 Blooming Garden of Love 🌹

A romantic React website featuring interactive blooming flowers with smooth animations.

## Features

- ✨ Beautiful blooming flower animations using Framer Motion
- 💕 Custom romantic messages revealed when flowers bloom
- 🎨 Soft, romantic styling with hover effects
- 📱 Fully responsive grid layout
- 🌸 Toggle bloom state with smooth transitions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Customization

### Adding Your Own Images

1. Place your images in the `public` folder (e.g., `public/images/`)
2. Update the `Garden.jsx` file to use your image paths:

```jsx
const flower = {
  imageClosed: '/images/closed-bud-1.jpg',
  imageOpen: '/images/open-flower-1.jpg',
  message: "Your custom message here 💕"
}
```

### Customizing Messages

Edit the `flowers` array in `Garden.jsx` to change the messages for each flower.

### Styling

- `src/styles/flower.css` - Individual flower styling
- `src/styles/garden.css` - Grid layout styling
- `src/styles/index.css` - Global styles

## Project Structure

```
src/
├── components/
│   ├── BloomingFlower.jsx  # Main flower component
│   └── Garden.jsx          # Grid layout with multiple flowers
├── styles/
│   ├── flower.css          # Flower component styles
│   ├── garden.css          # Garden grid styles
│   └── index.css           # Global styles
├── App.jsx
└── main.jsx
```

## Technologies

- React 18
- Vite
- Framer Motion

Enjoy creating your romantic garden! 💐

