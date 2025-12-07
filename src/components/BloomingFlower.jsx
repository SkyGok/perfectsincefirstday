import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/flower.css'

const BloomingFlower = ({ 
  imageClosed, 
  imageOpen, 
  message = "You make my heart bloom 💕" 
}) => {
  const [isBloomed, setIsBloomed] = useState(false)

  const toggleBloom = () => {
    setIsBloomed(!isBloomed)
  }

  // Enhanced bloom animation variants
  const bloomVariants = {
    closed: {
      scale: 0.85,
      opacity: 0.9,
      rotate: 0,
      filter: "brightness(0.9) saturate(0.8)",
    },
    open: {
      scale: [0.85, 1.15, 1],
      opacity: [0.9, 1, 1],
      rotate: [0, 5, -3, 0],
      filter: "brightness(1.15) saturate(1.3)",
      transition: {
        duration: 0.8,
        times: [0, 0.6, 1],
        ease: [0.34, 1.56, 0.64, 1], // Custom easing for organic feel
      }
    }
  }

  // Glow effect animation
  const glowVariants = {
    closed: {
      scale: 0.9,
      opacity: 0,
    },
    open: {
      scale: [0.9, 1.3, 1.1],
      opacity: [0, 0.6, 0.3],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
      }
    }
  }

  return (
    <div className="flower-container">
      <motion.div
        className="flower-image-wrapper"
        onClick={toggleBloom}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow effect behind flower */}
        <AnimatePresence>
          {isBloomed && (
            <motion.div
              className="flower-glow"
              variants={glowVariants}
              initial="closed"
              animate="open"
              exit="closed"
            />
          )}
        </AnimatePresence>

        {/* Petal particles effect */}
        <AnimatePresence>
          {isBloomed && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`petal-${i}`}
                  className="petal-particle"
                  initial={{
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0,
                    rotate: i * 60,
                  }}
                  animate={{
                    scale: [0, 1, 0.8, 0],
                    opacity: [0, 1, 0.8, 0],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 40,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 40,
                    rotate: i * 60 + 180,
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isBloomed ? (
            <motion.img
              key="open"
              src={imageOpen}
              alt="Bloomed flower"
              className="flower-image flower-open"
              variants={bloomVariants}
              initial="closed"
              animate="open"
              exit="closed"
            />
          ) : (
            <motion.img
              key="closed"
              src={imageClosed}
              alt="Closed flower bud"
              className="flower-image flower-closed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.4
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isBloomed && (
          <motion.div
            className="flower-message"
            initial={{ opacity: 0, y: -15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BloomingFlower

