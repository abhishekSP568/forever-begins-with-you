# Forever Begins With You

A romantic, responsive anniversary experience built with React, Vite, Tailwind CSS, Framer Motion, and Lucide React. The supplied couple photographs are included in the gallery and slideshow.

## Run it in VS Code

1. Install **Node.js 22.12 or newer** (the current Node.js LTS is recommended).
2. In VS Code, choose **File → Open Folder…** and open this project folder.
3. Open **Terminal → New Terminal** and run:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

4. Open the local URL printed by Vite (normally `http://localhost:5173/`) in a browser.
5. To create and check the production build, run:

   ```powershell
   npm.cmd run build
   npm.cmd run preview
   ```

`npm.cmd` works in the standard Windows PowerShell terminal even when script execution is restricted.

## Deploy to GitHub Pages

Push this project to a GitHub repository's `main` branch. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**. The workflow at `.github/workflows/deploy.yml` builds the site and deploys it automatically on each push to `main`.

## Personalize the story

- **Names:** Select **Make it yours** in the top navigation. Names are saved in this browser.
- **Wedding date:** The live counter and starry-night dedication start with November 16, 2025. Change the date in **Love in Numbers** to personalize it.
- **Timeline:** Select a chapter to edit its title, date, description, or photo. Choose **Add a chapter** for a new milestone. Story edits are saved in this browser.
- **Photos:** Twenty-four original photographs are in `public/memories/`. The gallery's **Add your own** control accepts multiple images for this visit.
- **Music:** Use the music controls to start the original, synthesized anniversary melody after an interaction. Music never autoplays.
- **Surprises:** Tap the heart in the wordmark five times, the small quotes, the gift, and the final-page controls to discover the interactive moments.

The original `New folder` photo collection is preserved. The website serves its optimized-for-web copies from `public/memories/`.
