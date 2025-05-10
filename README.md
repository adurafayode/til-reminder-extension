# Today I Learned - Chrome Extension

> This repository was created as a learning resource for the "VIBE CODING: How Your Mood Shapes Your Code" session at the AI Knowledge Series (May 10, 2025). It demonstrates how to effectively use AI to build a Chrome extension through structured prompting and iterative development.

> **Looking for the complete solution?** Check out the `complete-solution` branch after trying to build it yourself:
>
> ```bash
> git checkout complete-solution
> ```

A Chrome extension that helps you track daily learnings with reminders and streak tracking.

## Extension Properties

- **Daily Entries**: Up to 10 entries per day, 280 characters each
- **Reminders**: Daily notification at 8 PM with snooze option
- **Storage**: Keeps last 30 days of entries
- **Streak Tracking**: Tracks consecutive days of learning
- **UI Features**: Character counter, entry management, modern design

## Building with AI - Step by Step Guide

### Before You Start

1. Fork this repository:

   - Click the "Fork" button at the top right of this page
   - This creates your own copy of the repository that you can modify

2. Clone your forked repository:

```bash
git clone https://github.com/YOUR_USERNAME/til-reminder-extension.git
cd til-reminder-extension
```

3. Create the project structure:

```bash
mkdir icons
touch manifest.json popup.html popup.js background.js styles.css
```

Your directory should look like this:

```
til-reminder-extension/
├── icons/              # Extension icons
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality
├── background.js     # Background service worker
├── styles.css        # Styling
└── README.md         # This file
```

4. Requirements:

- Chrome browser installed
- Text editor of your choice
- Git installed (for cloning)
- Node.js installed (for icon generation)

### Build Steps

Each step below contains a prompt for AI. Copy the entire prompt and wait for the AI to provide and explain the code before moving to the next step.

#### Step 1: Project Setup (10-15 mins)

```
I've cloned the til-reminder-extension repository and have the basic file structure.
Help me set up manifest.json with:
1. Required permissions (storage, alarms, notifications)
2. Basic extension metadata
3. Popup and background worker configuration
```

#### Step 2: Extension Icon (10-15 mins)

```
Create a modern SVG icon for the extension that:
1. Uses a notebook/journal design
2. Has a blue theme (#3B82F6)
3. Includes a plus symbol

After you provide the SVG code, help me:
1. Save it to icons/icon.svg
2. Install required tools for PNG generation (sharp)
3. Generate icons in sizes: 16, 32, 48, 128px
```

#### Step 3: Basic UI (15-20 mins)

```
Create the popup interface HTML and CSS with:
1. Input area for new entries (280 char limit)
2. Character counter
3. Save button
4. Area to display today's entries
Make it modern and clean using system fonts and subtle animations.
```

#### Step 4: Entry Management (15-20 mins)

```
Help me implement the core entry functionality:
1. Save entries to chrome.storage.local
2. Display entries for today
3. Add delete capability
4. Enforce 10 entries per day limit
5. Show appropriate success/error messages
```

#### Step 5: Streak System (10-15 mins)

```
Implement streak tracking that:
1. Counts consecutive days with entries
2. Resets if a day is missed
3. Shows current streak in the UI
4. Persists across browser restarts
```

#### Step 6: Reminder System (15-20 mins)

```
Create a notification system that:
1. Reminds users at 8 PM if no entry today
2. Offers a "remind later" option
3. Opens the extension when notification is clicked
```

#### Step 7: Data Management (10-15 mins)

```
Add data cleanup and optimization:
1. Keep only last 30 days of entries
2. Clean up old data automatically
3. Handle storage limits appropriately
```

### Tips for Working with AI

1. **One Step at a Time**: Complete each step fully before moving to the next
2. **Test as You Go**: Load the extension after each step to verify it works
3. **Error Handling**: If you get errors, share them with AI for help
4. **Understanding**: Ask AI to explain any code you don't understand
5. **Iterations**: Feel free to ask AI to modify code if it's not quite what you want

### Loading Your Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select your extension directory
4. The extension icon should appear in your toolbar

### Need Help?

If you get stuck, try these prompts:

- "Can you explain how [feature] works?"
- "I got this error: [error message]. How do I fix it?"
- "Can you help me modify [feature] to work like [description]?"

Total build time: About 90 minutes
