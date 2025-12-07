import { useEffect, useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import '../styles/blur-text.css'

const BlurText = ({
  text = '',
  delay = 150,
  animateBy = 'words', // 'words' or 'chars'
  direction = 'top', // 'top', 'bottom', 'left', 'right'
  onAnimationComplete,
  onFadeComplete,
  fadeDelay = 3000,
  fadeDuration = 1000,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldFade, setShouldFade] = useState(false)
  const controls = useAnimation()
  const completedCount = useRef(0)

  // Split text into words or characters
  const splitText = () => {
    if (animateBy === 'words') {
      return text.split(' ').filter(word => word.length > 0)
    } else if (animateBy === 'chars') {
      return text.split('').filter(char => char !== ' ')
    }
    return []
  }

  const elements = splitText()
  const totalElements = elements.length

  // Get initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'top':
        return { y: -30, x: 0 }
      case 'bottom':
        return { y: 30, x: 0 }
      case 'left':
        return { x: -30, y: 0 }
      case 'right':
        return { x: 30, y: 0 }
      default:
        return { y: -30, x: 0 }
    }
  }

  const initialPos = getInitialPosition()

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      controls.start('visible')
    }, 100)

    // Start fade out after fadeDelay
    const fadeTimer = setTimeout(() => {
      setShouldFade(true)
      setTimeout(() => {
        setIsVisible(false)
        if (onFadeComplete) {
          onFadeComplete()
        }
      }, fadeDuration)
    }, fadeDelay)

    return () => {
      clearTimeout(timer)
      clearTimeout(fadeTimer)
    }
  }, [controls, fadeDelay, fadeDuration, onFadeComplete])

  const handleElementComplete = () => {
    completedCount.current += 1
    if (completedCount.current === totalElements && onAnimationComplete) {
      onAnimationComplete()
    }
  }

  // Animation variants
  const elementVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      ...initialPos
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      className={`blur-text-container ${className}`}
      initial={{ opacity: 1 }}
      animate={shouldFade ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: fadeDuration / 1000, ease: 'easeInOut' }}
    >
      {animateBy === 'words' ? (
        <span className="blur-text">
          {elements.map((word, index) => (
            <motion.span
              key={index}
              className="blur-word"
              variants={elementVariants}
              initial="hidden"
              animate={controls}
              transition={{
                delay: (index * delay) / 1000,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              onAnimationComplete={handleElementComplete}
            >
              {word}
              {index < elements.length - 1 && '\u00A0'}
            </motion.span>
          ))}
        </span>
      ) : (
        <span className="blur-text">
          {elements.map((char, index) => (
            <motion.span
              key={index}
              className="blur-char"
              variants={elementVariants}
              initial="hidden"
              animate={controls}
              transition={{
                delay: (index * delay) / 1000,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              onAnimationComplete={handleElementComplete}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      )}
    </motion.div>
  )
}

export default BlurText

