import { useState, useRef, useEffect } from 'react'
import '../styles/background-music.css'

const BackgroundMusic = ({ 
  src,
  autoPlay = false,
  loop = true,
  volume = 0.5
}) => {
  // Use provided src or default with base URL
  const audioSrc = src || `${import.meta.env.BASE_URL}media/background-music.mp3`
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const audioRef = useRef(null)
  const hasAttemptedPlay = useRef(false)

  // Initialize audio and attempt autoplay
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set initial volume and loop
    audio.volume = volume
    audio.loop = loop

    // Try to play automatically when component mounts
    if (autoPlay && !hasAttemptedPlay.current) {
      hasAttemptedPlay.current = true
      const attemptPlay = async () => {
        try {
          // Small delay to ensure audio is ready
          await new Promise(resolve => setTimeout(resolve, 500))
          await audio.play()
          setIsPlaying(true)
        } catch (error) {
          console.log('Autoplay prevented by browser. User interaction required.')
          setIsPlaying(false)
          // Try again after user interaction
          const handleUserInteraction = async () => {
            try {
              await audio.play()
              setIsPlaying(true)
            } catch (e) {
              console.log('Play failed:', e)
            }
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
          }
          document.addEventListener('click', handleUserInteraction, { once: true })
          document.addEventListener('touchstart', handleUserInteraction, { once: true })
        }
      }
      attemptPlay()
    }
  }, [autoPlay, volume, loop])

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying && !isMuted) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Play failed:', error)
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }

    // Handle mute
    audio.muted = isMuted
  }, [isPlaying, isMuted])

  // Ensure loop is always set
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.loop = loop
    }
  }, [loop])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Hide controls after 3 seconds if not interacting
  useEffect(() => {
    if (!showControls) return
    
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [showControls, isPlaying])

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop={loop}
        preload="auto"
      />
      
      <div 
        className="background-music-controls"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && (
          <div className="music-controls-panel">
            <button
              className="music-control-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              className="music-control-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={volume}
              onChange={handleVolumeChange}
              className="music-volume-slider"
              aria-label="Volume"
            />
          </div>
        )}
        {!showControls && (
          <button
            className="music-toggle-btn"
            onClick={() => setShowControls(true)}
            aria-label="Show music controls"
          >
            🎵
          </button>
        )}
      </div>
    </>
  )
}

export default BackgroundMusic

