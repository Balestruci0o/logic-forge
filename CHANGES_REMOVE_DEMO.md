# DEMO Section Removal & Gallery Addition

## Summary
Removed the interactive logic gate simulator demo and replaced it with a Gallery/Showcase section for displaying project images and videos.

## Files Removed
- `src/components/simulator/ComponentPalette.tsx` - Component palette UI for simulator
- `src/components/simulator/LogicSimulator.tsx` - Main simulator component
- `src/components/simulator/SimulatorCanvas.tsx` - Canvas rendering for circuits
- `src/components/simulator/types.ts` - TypeScript types for simulator
- `src/components/simulator/useSimulator.ts` - Simulator state management hook
- `src/components/DemoSection.tsx` - Demo section wrapper (replaced with GallerySection)

## Files Added
- `src/components/GallerySection.tsx` - Main gallery section component
- `src/components/gallery/types.ts` - TypeScript types for gallery
- `src/components/gallery/useGallery.ts` - Gallery state management hook
- `src/components/gallery/GalleryHeroSlider.tsx` - Hero slider component
- `src/components/gallery/GalleryGrid.tsx` - Masonry-style grid component
- `src/components/gallery/MediaModal.tsx` - Lightbox modal for media viewing
- `CHANGES_REMOVE_DEMO.md` - This changelog file

## Files Modified
- `src/pages/Index.tsx` - Updated to use GallerySection instead of DemoSection
- `src/components/Navigation.tsx` - Updated nav link from #demo to #gallery-showcase

## Asset Setup Instructions

### Required Folder Structure
Create the following folder: `/public/assets/gallery/`

### Image Files (PNG)
Place PNG images with these names:
- `gallery_img_01.png` through `gallery_img_13.png`

**Recommended dimensions:**
- Hero slider images: 900x506px (16:9 aspect ratio)
- Grid images: 800x600px (4:3 aspect ratio)

### Video Files (MP4)
Place MP4 videos with these names:
- `gallery_vid_01.mp4` through `gallery_vid_08.mp4`

**Video poster thumbnails (optional but recommended):**
- `gallery_vid_01_poster.png` through `gallery_vid_08_poster.png`

**Recommended video specs:**
- Resolution: 1280x720 or 1920x1080
- Format: H.264 MP4
- Duration: Keep under 2 minutes for optimal loading

## Accessibility Features

### Keyboard Navigation
- `ESC` - Close modal
- `←` / `→` - Navigate between items in modal
- `Tab` - Focus trap within modal

### Screen Reader Support
- All images have descriptive alt text
- Videos have aria-labels
- Modal has proper ARIA attributes (role="dialog", aria-modal, aria-labelledby)

### Motion Preferences
- Respects `prefers-reduced-motion` media query
- Animations are disabled/reduced when user prefers reduced motion

### Video Autoplay
- Videos autoplay only when ≥50% visible in viewport
- Always start muted (user must explicitly unmute)
- Visible mute/unmute controls on all video cards

## Testing Autoplay Behavior

1. Scroll the gallery into view - videos should start playing (muted)
2. Scroll away - videos should pause
3. Click the mute/unmute button - audio should toggle
4. Click a video to open modal - video plays with controls
5. Enable reduced motion in OS settings - verify animations are disabled

## Notes
- Placeholder images will display if actual assets are not found
- Gallery gracefully handles 8-13 items (fewer or more will work but layout optimized for this range)
- The hero slider shows first 5 items, grid shows remaining items
