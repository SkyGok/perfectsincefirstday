# Media Directory

Place your images and audio files here.

## How to Add Images and Notes

1. **Add your images** to this folder (e.g., `image1.jpg`, `image2.jpg`, etc.)

2. **Update `src/App.jsx`** - Add items to the `galleryItems` array:

```javascript
const galleryItems = [
  {
    id: 1,
    image: '/media/image1.jpg',  // Path to your image
    alt: 'Description of image',
    note: 'Your romantic message here 💕'
  },
  {
    id: 2,
    image: '/media/image2.jpg',
    alt: 'Another moment',
    note: 'Another romantic note 💖'
  },
  // Add more items as needed...
]
```

## How to Add Background Music

1. **Convert YouTube video to MP3** (if needed):
   - Use online tools like yt-dlp, 4K Video Downloader, or online converters
   - Save the audio file as `background-music.mp3` in this folder

2. **Or use your own audio file**:
   - Place your audio file in this folder
   - Supported formats: MP3, OGG, WAV
   - Update the `src` path in `src/App.jsx` if using a different filename

3. **The music player** will appear in the bottom-right corner with controls to:
   - Play/Pause
   - Mute/Unmute
   - Adjust volume

## Image Tips

- Supported formats: JPG, PNG, WebP
- Recommended size: 800x800px or larger (square images work best)
- The gallery will automatically resize and display them

## Audio Tips

- Supported formats: MP3, OGG, WAV
- Recommended: MP3 format for best compatibility
- File size: Keep it reasonable (under 10MB recommended)
- The music will loop automatically

## Notes

- Each image can have a unique romantic note
- Notes appear when you click on an image
- Make them personal and meaningful! 💕

