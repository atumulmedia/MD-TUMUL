# MD TUMUL Photo Upload Website

## Features
- Mobile-friendly Bengali photo upload website
- Select or drag and drop up to 10 images at once
- JPG, PNG, GIF and WEBP support
- 10 MB maximum per image
- Image preview before upload
- Gallery and full-size image preview

## Run locally
1. Install Node.js 18 or newer.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm start`
5. Visit `http://localhost:3000`

## Deploy on Render (free web service)
1. Push this project to a GitHub repository.
2. In Render, create a **New Web Service** and connect the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Deploy.

**Important storage note:** files saved in the local `uploads` folder on a free Render instance may be lost when the service restarts or redeploys. For permanent photo storage, connect a persistent disk (where available) or a cloud image-storage service such as Cloudinary and configure it before using the site for important photos.

## Important
This starter site is a public gallery: anyone who can access the website can view uploaded images. Do not upload private or sensitive photos. Add login and moderation before using it for private uploads.
