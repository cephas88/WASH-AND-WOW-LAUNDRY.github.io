Image optimization guide

This project contains sample images used by the site (LOGO.jpg, colourful.webp, bucket.webp, etc.). To replace placeholder images with higher-resolution photography and generate optimized sizes and WebP versions, follow these steps.

1) Prepare or obtain high-resolution source images
   - Name them clearly (e.g., hero-colourful.jpg, service-bucket.jpg, blanket-hero.jpg)
   - Keep originals in the project root or a separate `images-source` folder for safekeeping.

2) Install ImageMagick (Windows)
   - Download from: https://imagemagick.org
   - During installation, check the box to add "Install legacy utilities (e.g., convert)" if prompted, or ensure `magick.exe` is available in PATH.

3) Run the provided PowerShell script to generate optimized images
   - Open PowerShell in the project folder and run:

   ./optimize-images.ps1

   This will create an `images-optimized` folder with resized JPG and WebP images at widths: 1600, 1200, 800, 400 px.

4) Update `index.html` to point to the optimized images
   - Use the appropriately sized image for the hero (e.g., `images-optimized/hero-colourful-1200.webp`) and smaller sizes for service icons.
   - Keep `loading="lazy"` and width/height attributes to help layout stability and performance.

5) Optional: use <picture> elements for best results
   - Example:

   <picture>
     <source srcset="images-optimized/hero-colourful-1200.webp" type="image/webp">
     <img src="images-optimized/hero-colourful-1200.jpg" alt="Hero" loading="lazy" width="1200" height="700">
   </picture>

6) Test performance
   - Open the site locally and check with browser devtools (Network tab) and Lighthouse to verify improvements.

If you'd like I can:
- Replace current images in `index.html` to reference optimized images from `images-optimized` (I can do this after you run the script or if you provide the higher-res source images here).
- Convert the hero to use a responsive <picture> element with srcsets for progressive enhancement.
