// Constants
const MAX_CHARS = 280;
const MAX_ENTRIES_PER_DAY = 10;  // Limit entries per day
const MAX_DAYS_TO_KEEP = 30;     // Keep only last 30 days
const storage = chrome.storage.local;
const todayKey = () => new Date().toISOString().slice(0, 10);

// DOM Elements
const form = document.getElementById("til-form");
const input = document.getElementById("til-input");
const list = document.getElementById("til-list");
const charCount = document.getElementById("char-count");
const entriesCount = document.getElementById("entries-count");
const streakCount = document.getElementById("streak-count");
const entryTemplate = document.getElementById("entry-template");

// State Management
let currentEntries = [];

// Initialize
async function initialize() {
  await cleanupOldData();  // Add cleanup on startup
  await loadTodayEntries();
  await updateStreak();
  setupEventListeners();
}

// Cleanup old data
async function cleanupOldData() {
  const allData = await storage.get(null);
  const today = new Date();
  const keysToRemove = [];

  for (const key of Object.keys(allData)) {
    // Skip non-date keys like 'streak' and 'settings'
    if (key === 'streak' || key === 'settings') continue;
    
    try {
      const date = new Date(key);
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays > MAX_DAYS_TO_KEEP) {
        keysToRemove.push(key);
      }
    } catch (e) {
      // Skip if key is not a valid date
      continue;
    }
  }

  if (keysToRemove.length > 0) {
    await storage.remove(keysToRemove);
  }
}

// Load today's entries
async function loadTodayEntries() {
  const data = await storage.get([todayKey()]);
  currentEntries = data[todayKey()] || [];
  updateEntriesList();
  updateEntryCount();
}

// Update streak count
async function updateStreak() {
  const data = await storage.get(['streak']);
  const streak = data.streak || { count: 0, lastUpdate: '' };
  
  const today = todayKey();
  if (streak.lastUpdate !== today && currentEntries.length > 0) {
    if (isConsecutiveDay(streak.lastUpdate, today)) {
      streak.count++;
    } else {
      streak.count = 1;
    }
    streak.lastUpdate = today;
    await storage.set({ streak });
  }
  
  streakCount.textContent = streak.count;
}

// Helper to check consecutive days
function isConsecutiveDay(lastDate, currentDate) {
  if (!lastDate) return true;
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  const diffTime = current - last;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// Update entries list
function updateEntriesList() {
  list.innerHTML = '';
  currentEntries.forEach((text, index) => {
    const entry = createEntryElement(text, index);
    list.appendChild(entry);
  });
}

// Create entry element
function createEntryElement(text, index) {
  const clone = entryTemplate.content.cloneNode(true);
  const entryDiv = clone.querySelector('.entry');
  const textElement = entryDiv.querySelector('.entry-text');
  const deleteButton = entryDiv.querySelector('.delete-entry');
  
  textElement.textContent = text;
  deleteButton.addEventListener('click', () => deleteEntry(index));
  
  return entryDiv;
}

// Delete entry
async function deleteEntry(index) {
  currentEntries.splice(index, 1);
  await storage.set({ [todayKey()]: currentEntries });
  updateEntriesList();
  updateEntryCount();
}

// Update entry count
function updateEntryCount() {
  const count = currentEntries.length;
  entriesCount.textContent = `${count}/${MAX_ENTRIES_PER_DAY} entries`;
  
  // Update warning classes
  if (count >= MAX_ENTRIES_PER_DAY) {
    entriesCount.classList.add('at-limit');
    entriesCount.classList.remove('near-limit');
  } else if (count >= MAX_ENTRIES_PER_DAY - 2) {
    entriesCount.classList.add('near-limit');
    entriesCount.classList.remove('at-limit');
  } else {
    entriesCount.classList.remove('near-limit', 'at-limit');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || text.length > MAX_CHARS) return;
    
    // Check if we've reached the daily limit
    if (currentEntries.length >= MAX_ENTRIES_PER_DAY) {
      alert(`You've reached the maximum of ${MAX_ENTRIES_PER_DAY} entries for today. Consider reviewing and deleting old entries if needed.`);
      return;
    }
    
    currentEntries.push(text);
    await storage.set({ [todayKey()]: currentEntries });
    
    input.value = "";
    updateCharCount(0);
    
    updateEntriesList();
    updateEntryCount();
    await updateStreak();
  });

  // Character count
  input.addEventListener("input", () => {
    const length = input.value.length;
    updateCharCount(length);
  });
}

// Update character count display
function updateCharCount(length) {
  charCount.textContent = `${length}/${MAX_CHARS}`;
  const charCountContainer = charCount.parentElement;
  
  if (length > MAX_CHARS) {
    charCountContainer.classList.add('over-limit');
  } else {
    charCountContainer.classList.remove('over-limit');
  }
}

// Initialize the popup
initialize();
