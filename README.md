# idea:stream

**Seeds growing into forests.**

A sanctuary for your creative ideas. Plant seeds, watch them grow, trust the timing.

---

## Deploy to Vercel (Easiest Method)

### Step 1: Create a GitHub Account (if you don't have one)
1. Go to [github.com](https://github.com)
2. Sign up for free

### Step 2: Create a New Repository
1. Click the `+` icon in the top right → "New repository"
2. Name it: `idea-stream`
3. Make it Public
4. Don't add README, .gitignore, or license
5. Click "Create repository"

### Step 3: Upload Your Files
**Option A: Use GitHub's Web Interface (Easiest)**
1. On your new repository page, click "uploading an existing file"
2. Drag and drop ALL the files from the `idea-stream-deploy` folder
3. Write commit message: "Initial commit"
4. Click "Commit changes"

**Option B: Use Git (If you're comfortable with terminal)**
```bash
cd idea-stream-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/idea-stream.git
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Once logged in, click "Add New..." → "Project"
4. Import your `idea-stream` repository
5. Vercel will auto-detect Next.js
6. Click "Deploy"
7. Wait 2-3 minutes ☕

### Step 5: Your App is Live! 🎉
Vercel will give you a URL like: `idea-stream.vercel.app`

You can:
- Share this URL with anyone
- Open it on your phone (add to home screen for app-like experience)
- Connect a custom domain later (like `ideastream.com`)

---

## Features

✨ **Quick Capture** - Add ideas in seconds with emoji icons  
📸 **Mood Boards** - Upload inspiration images for each seed  
🔍 **Search & Filter** - Find your ideas by name, description, or tags  
⏰ **Time Stamps** - See when you planted each seed  
💾 **Auto-Save** - Everything persists in your browser  
🎨 **Beautiful Design** - Dark, minimal, Apple-inspired aesthetic  

---

## Tech Stack

- **Next.js 14** - React framework
- **Lucide React** - Beautiful icons
- **Local Storage** - Browser-based persistence

---

## Project Structure

```
idea-stream-deploy/
├── app/
│   ├── page.js       # Main app component
│   └── layout.js     # App layout & metadata
├── package.json      # Dependencies
├── next.config.js    # Next.js configuration
├── vercel.json       # Vercel deployment config
└── README.md         # This file
```

---

## Customization Ideas

Want to make it your own? Here are some things you could change:

1. **Colors** - Edit the gradient colors in the styles
2. **Emoji Set** - Add more emoji options in `emojiOptions` array
3. **Categories** - Change the filter categories in `categories` array
4. **Tagline** - Update "seeds growing into forests" in the header

---

## Support

If something breaks during deployment:
1. Check Vercel's build logs
2. Make sure all files uploaded correctly
3. Verify the repository is public

---

*Built with ✨ by a designer learning to vibe code*
