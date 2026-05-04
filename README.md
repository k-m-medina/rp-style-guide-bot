# Research Park Style Guide Assistant

A style guide chatbot for the University of Illinois Research Park and EnterpriseWorks communications team. Checks AP Style, naming conventions, grammar, and spelling.

---

## First-Time Setup (do this once)

### Step 1 -- Create a GitHub account
Go to github.com and sign up for a free account if you don't already have one.

### Step 2 -- Create a new repository
1. Once logged in, click the green "New" button on the left sidebar (or go to github.com/new)
2. Name it: `style-guide-bot`
3. Set it to **Private** (so your code isn't public)
4. Click "Create repository"

### Step 3 -- Upload the files
1. On the repository page, click "uploading an existing file" (shown in the quick setup box)
2. Drag the entire `style-guide-bot` folder contents into the upload area
   - You need to upload all files keeping the folder structure intact
   - The easiest way: drag the whole folder in, then also drag the `src` and `functions` subfolders in separately
3. Scroll down and click "Commit changes"

### Step 4 -- Create a Cloudflare account
Go to cloudflare.com and sign up for a free account.

### Step 5 -- Connect Cloudflare Pages to your GitHub repo
1. In Cloudflare's dashboard, click "Workers & Pages" in the left sidebar
2. Click "Create application" then "Pages" then "Connect to Git"
3. Connect your GitHub account when prompted
4. Select your `style-guide-bot` repository
5. Under "Build settings":
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Click "Save and Deploy"

Cloudflare will build and deploy your site. This takes about 60 seconds.

### Step 6 -- Add your API key
This is the most important step -- it keeps your API key secure on the server.

1. In Cloudflare Pages, go to your project and click "Settings"
2. Click "Environment variables"
3. Click "Add variable"
4. Name: `ANTHROPIC_API_KEY`
5. Value: paste your API key here (the one that starts with `sk-ant-`)
6. Click "Save"
7. Go back to "Deployments" and click "Retry deployment" so it picks up the new variable

### Step 7 -- Share the link
Cloudflare gives you a permanent URL like `style-guide-bot.pages.dev`. Send that to your team. Anyone with the link can use it -- no account needed.

---

## Making Updates Later

### If the style guide rules change:
1. Open `functions/api/chat.js` in GitHub (click the file, then the pencil icon to edit)
2. Find the `SYSTEM_PROMPT` section at the top
3. Update the relevant rules
4. Click "Commit changes" at the bottom
5. Cloudflare automatically redeploys in about 60 seconds -- no other steps needed

### If you want to change the design or example prompts:
1. Open `src/App.jsx` in GitHub
2. Make your changes
3. Commit -- Cloudflare redeploys automatically

### If you get help from Claude to make changes:
1. Download the updated file from Claude
2. Go to the file in GitHub, click the pencil icon to edit
3. Select all the existing code and replace it with the new code
4. Commit changes -- done

---

## File Structure Reference

```
style-guide-bot/
├── index.html               -- App entry point
├── package.json             -- Project dependencies
├── vite.config.js           -- Build config
├── src/
│   ├── main.jsx             -- React entry point
│   └── App.jsx              -- Main app (UI, chat logic, branding)
└── functions/
    └── api/
        └── chat.js          -- Server function (holds API key + style rules)
```

**Where things live:**
- Style guide rules and AP Style rules: `functions/api/chat.js` (top of file, in SYSTEM_PROMPT)
- Example prompts on the home screen: `src/App.jsx` (top of file, in EXAMPLE_PROMPTS)
- Colors, fonts, and UI: `src/App.jsx`

---

## Costs

- **GitHub**: Free
- **Cloudflare Pages**: Free (unlimited bandwidth, no credit limits)
- **Anthropic API**: Pay-as-you-go, roughly $5-10/month for a small team doing regular style checks
