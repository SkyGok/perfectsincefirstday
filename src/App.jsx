import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DomeGallery from './components/DomeGallery'
import ColorBendsBackground from './components/ColorBendsBackground'
import BlurText from './components/BlurText'
import BackgroundMusic from './components/BackgroundMusic'
import './styles/index.css'

function App() {
  const [showGallery, setShowGallery] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  // Base URL for assets (works with GitHub Pages base path)
  const baseUrl = import.meta.env.BASE_URL

  // Gallery items with images and romantic notes
  const galleryItems = [
    {
      id: 1,
      image: `${baseUrl}media/pasted-image-2025-12-07T17-38-16-362Z_r1_c1_processed_by_imagy.png`,
      alt: 'Memory 1',
      note: 'I love every each one of your pictures here'
    },
    {
      id: 2,
      image: `${baseUrl}media/pasted-image-2025-12-07T17-38-16-362Z_r1_c2_processed_by_imagy.png`,
      alt: 'Memory 2',
      note: 'You do smell amazing'
    },
    {
      id: 3,
      image: `${baseUrl}media/pasted-image-2025-12-07T17-38-16-362Z_r2_c1_processed_by_imagy.png`,
      alt: 'Memory 3',
      note: 'NOOOOOOO'
    },
    {
      id: 4,
      image: `${baseUrl}media/pasted-image-2025-12-07T17-38-16-362Z_r2_c2_processed_by_imagy.png`,
      alt: 'Memory 4',
      note: 'Yeah I got no comments here'
    },
    {
      id: 5,
      image: `${baseUrl}media/pasted-image-2025-12-07T17-38-16-362Z_r3_c1_processed_by_imagy.png`,
      alt: 'Memory 5',
      note: 'Cant help but loosing myself in those eyes'
    },
    {
      id: 6,
      image: `${baseUrl}media/pasted-image-2025-12-07T17-38-16-362Z_r3_c2_processed_by_imagy.png`,
      alt: 'Memory 6',
      note: 'LOOK AT THAT PERFECT SMILE'
    },
    {
      id: 7,
      image: `${baseUrl}media/Snapchat-1033730327.jpg`,
      alt: 'Memory 7',
      note: 'This is the after picture of us running around in Gölyazı'
    },
    {
      id: 8,
      image: `${baseUrl}media/Snapchat-1211939135.jpg`,
      alt: 'Memory 8',
      note: 'this is before picture of us running around in Gölyazı'
    },
    {
      id: 9,
      image: `${baseUrl}media/Snapchat-1852487037.jpg`,
      alt: 'Memory 9',
      note: 'Gotta look good before going home'
    },
    {
      id: 10,
      image: `${baseUrl}media/Snapchat-411921736.jpg`,
      alt: 'Memory 10',
      note: 'Cute picture with the cutest smile'
    },
    {
      id: 11,
      image: `${baseUrl}media/IMG-20250505-WA0000(1).jpg`,
      alt: 'Memory 11',
      note: 'Literally the day we met, weird MUN day. Also the day you decided to adopt me :D'
    },
    {
      id: 12,
      image: `${baseUrl}media/IMG-20250505-WA0016.jpg`,
      alt: 'Memory 12',
      note: 'Just casually hanging around at park with Aziz'
    },
    {
      id: 13,
      image: `${baseUrl}media/IMG-20250530-WA0059.jpg`,
      alt: 'Memory 13',
      note: 'Gotta flex them muscles'
    },
    {
      id: 14,
      image: `${baseUrl}media/IMG-20250607-WA0020.jpg`,
      alt: 'Memory 14',
      note: 'Really loved these pictures we took that day'
    },
    {
      id: 15,
      image: `${baseUrl}media/IMG-20250607-WA0024.jpg`,
      alt: 'Memory 15',
      note: 'I love every and each one of your car pictures Kidnapp car magic'
    },
    {
      id: 16,
      image: `${baseUrl}media/IMG-20250711-WA0000.jpg`,
      alt: 'Memory 16',
      note: 'Hareem Graduation day! So proud of you <3'
    },
    {
      id: 17,
      image: `${baseUrl}media/IMG-20250806-WA0016.jpg`,
      alt: 'Memory 17',
      note: 'Gotta look good when you are going back home '
    },
    {
      id: 18,
      image: `${baseUrl}media/IMG-20250920-WA0002.jpg`,
      alt: 'Memory 18',
      note: 'One of the first pictures you sent me from Sweden'
    },
    {
      id: 19,
      image: `${baseUrl}media/IMG-20251004-WA0013(1).jpg`,
      alt: 'Memory 19',
      note: 'Our best car picture in my opinion'
    },
    {
      id: 20,
      image: `${baseUrl}media/IMG-20251126-WA0009.jpeg`,
      alt: 'Memory 20',
      note: 'Just running around in Istanbul'
    },
    {
      id: 21,
      image: `${baseUrl}media/IMG-20251126-WA0019.jpg`,
      alt: 'Memory 21',
      note: 'GALATA VIBES'
    },
    {
      id: 22,
      image: `${baseUrl}media/IMG-20251128-WA0005.jpg`,
      alt: 'Memory 22',
      note: 'Exploring around in the Mountain House'
    },
    {
      id: 23,
      image: `${baseUrl}media/Snapchat-234881766.jpg`,
      alt: 'Memory 23',
      note: 'Right before buying your perfect cookies'
    }
  ]

  const handleAnimationComplete = () => {
    console.log('Animation completed!')
  }

  const handleFadeComplete = () => {
    // Hide intro and show gallery after text fades away
    setTimeout(() => {
      setShowIntro(false)
      setShowGallery(true)
    }, 100)
  }

  return (
    <>
      {/* Background music - starts immediately on page load */}
      <BackgroundMusic 
        src={`${baseUrl}media/background-music.mp3`}
        autoPlay={true}
        loop={true}
        volume={0.4}
      />
      
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro"
            className="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <BlurText
              text="She's perfect since day one <3"
              delay={200}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              onFadeComplete={handleFadeComplete}
              fadeDelay={4000}
              fadeDuration={1000}
              className="blur-text-welcome"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {showGallery && (
        <>
          <ColorBendsBackground 
            intensity={0.5}
            speed={0.8}
          />
          <DomeGallery 
            items={galleryItems}
            fit={0.6}
            maxRadius={1200}
            minRadius={300}
            dragSensitivity={18}
            grayscale={false}
          />
        </>
      )}
    </>
  )
}

export default App

