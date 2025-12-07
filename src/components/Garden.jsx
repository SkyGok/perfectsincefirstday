import BloomingFlower from './BloomingFlower'
import '../styles/garden.css'

// Placeholder images - replace these with your actual images
// You can use local images from public folder or URLs
const placeholderClosed = 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300&h=300&fit=crop'
const placeholderOpen = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop'

// Alternative: Use local images (uncomment and adjust paths)
// import closedBud1 from '../assets/closed-bud-1.jpg'
// import openFlower1 from '../assets/open-flower-1.jpg'

const Garden = () => {
  const flowers = [
    {
      id: 1,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "Every moment with you is a beautiful bloom 🌸"
    },
    {
      id: 2,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "You are the sunshine that makes my garden grow ☀️"
    },
    {
      id: 3,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "My love for you grows stronger every day 💖"
    },
    {
      id: 4,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "You make my heart bloom with happiness 🌺"
    },
    {
      id: 5,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "In your presence, everything becomes beautiful 🌷"
    },
    {
      id: 6,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "You are the most beautiful flower in my garden 🌹"
    },
    {
      id: 7,
      imageClosed: placeholderClosed,
      imageOpen: placeholderOpen,
      message: "With you, every day feels like spring 🌼"
    }
  ]

  return (
    <div className="garden">
      {flowers.map((flower, index) => (
        <div 
          key={flower.id} 
          className="flower-position"
          style={{ '--flower-index': index }}
        >
          <BloomingFlower
            imageClosed={flower.imageClosed}
            imageOpen={flower.imageOpen}
            message={flower.message}
          />
        </div>
      ))}
    </div>
  )
}

export default Garden

