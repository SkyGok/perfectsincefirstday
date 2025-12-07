import { useEffect, useRef, useState } from 'react'
import '../styles/color-bends.css'

// Detect mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const ColorBendsBackground = ({ 
  colors = null,
  intensity = 0.6,
  speed = 1,
  className = ''
}) => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timeRef = useRef(0)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  
  // Reduce intensity and complexity on mobile
  const effectiveIntensity = isMobileDevice ? intensity * 0.7 : intensity
  const effectiveSpeed = isMobileDevice ? speed * 0.8 : speed

  // Default romantic color palette
  const defaultColors = [
    { r: 255, g: 182, b: 193 }, // Pink
    { r: 255, g: 192, b: 203 }, // Light Pink
    { r: 221, g: 160, b: 221 }, // Plum
    { r: 186, g: 85, b: 211 },  // Medium Orchid
    { r: 255, g: 105, b: 180 }, // Hot Pink
    { r: 255, g: 20, b: 147 },  // Deep Pink
  ]

  const colorPalette = colors || defaultColors

  useEffect(() => {
    setIsMobileDevice(isMobile())
    const handleResize = () => setIsMobileDevice(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      timeRef.current += 0.01 * effectiveSpeed
      const time = timeRef.current

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient bends - reduce on mobile for performance
      const numBends = isMobileDevice ? 2 : 3
      for (let i = 0; i < numBends; i++) {
        const offset = (i / numBends) * Math.PI * 2
        const t = time + offset

        // Create curved gradient path
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        
        // Add color stops with animation
        const numStops = colorPalette.length
        colorPalette.forEach((color, index) => {
          const stop = (index / (numStops - 1))
          const animatedStop = (stop + Math.sin(t + offset) * 0.2 + 0.5) % 1
          
          // Add slight color variation based on time
          const r = Math.min(255, Math.max(0, color.r + Math.sin(t * 0.5 + index) * 20))
          const g = Math.min(255, Math.max(0, color.g + Math.cos(t * 0.7 + index) * 20))
          const b = Math.min(255, Math.max(0, color.b + Math.sin(t * 0.6 + index) * 20))
          
          gradient.addColorStop(animatedStop, `rgba(${r}, ${g}, ${b}, ${effectiveIntensity})`)
        })

        // Draw curved path
        ctx.save()
        ctx.beginPath()
        
        // Create a curved path using bezier curves
        const controlX1 = canvas.width * (0.3 + Math.sin(t) * 0.2)
        const controlY1 = canvas.height * (0.3 + Math.cos(t * 0.8) * 0.2)
        const controlX2 = canvas.width * (0.7 + Math.cos(t * 1.2) * 0.2)
        const controlY2 = canvas.height * (0.7 + Math.sin(t * 0.9) * 0.2)
        
        ctx.moveTo(-canvas.width * 0.2, canvas.height * 0.5)
        ctx.bezierCurveTo(
          controlX1, controlY1,
          controlX2, controlY2,
          canvas.width * 1.2, canvas.height * 0.5
        )
        
        // Create a gradient along the path
        const pathGradient = ctx.createLinearGradient(
          -canvas.width * 0.2, 0,
          canvas.width * 1.2, 0
        )
        
        colorPalette.forEach((color, index) => {
          const stop = index / (colorPalette.length - 1)
          const r = Math.min(255, Math.max(0, color.r + Math.sin(t + index) * 15))
          const g = Math.min(255, Math.max(0, color.g + Math.cos(t * 1.1 + index) * 15))
          const b = Math.min(255, Math.max(0, color.b + Math.sin(t * 0.9 + index) * 15))
          pathGradient.addColorStop(stop, `rgba(${r}, ${g}, ${b}, ${effectiveIntensity * 0.8})`)
        })
        
        ctx.strokeStyle = pathGradient
        ctx.lineWidth = canvas.height * 0.8
        ctx.lineCap = 'round'
        ctx.globalCompositeOperation = 'screen'
        ctx.stroke()
        ctx.restore()
      }

      // Add additional flowing gradients
      for (let i = 0; i < 2; i++) {
        const offset = (i / 2) * Math.PI
        const t = time + offset
        
        const radialGradient = ctx.createRadialGradient(
          canvas.width * (0.5 + Math.sin(t) * 0.3),
          canvas.height * (0.5 + Math.cos(t * 0.7) * 0.3),
          0,
          canvas.width * (0.5 + Math.sin(t) * 0.3),
          canvas.height * (0.5 + Math.cos(t * 0.7) * 0.3),
          Math.max(canvas.width, canvas.height) * 0.8
        )
        
        const color1 = colorPalette[i % colorPalette.length]
        const color2 = colorPalette[(i + 1) % colorPalette.length]
        
        radialGradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${effectiveIntensity * 0.4})`)
        radialGradient.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0)`)
        
        ctx.fillStyle = radialGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [colorPalette, effectiveIntensity, effectiveSpeed, isMobileDevice])

  return (
    <canvas
      ref={canvasRef}
      className={`color-bends-background ${className}`}
    />
  )
}

export default ColorBendsBackground

