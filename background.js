// Constants
const ALARM_NAME = "daily-til";
const DEFAULT_REMINDER_HOUR = 20;
const NOTIFICATION_ID = "til-reminder";

// Install handler
chrome.runtime.onInstalled.addListener(async () => {
  await scheduleAlarm();
  await initializeStorage();
});

// Initialize storage with default values
async function initializeStorage() {
  const data = await chrome.storage.local.get(['streak', 'settings']);
  
  if (!data.streak) {
    await chrome.storage.local.set({
      streak: { count: 0, lastUpdate: '' }
    });
  }
  
  if (!data.settings) {
    await chrome.storage.local.set({
      settings: {
        reminderHour: DEFAULT_REMINDER_HOUR,
        notificationsEnabled: true
      }
    });
  }
}

// Schedule daily alarm
async function scheduleAlarm() {
  // Clear any existing alarms
  await chrome.alarms.clearAll();
  
  const data = await chrome.storage.local.get(['settings']);
  const reminderHour = data.settings?.reminderHour || DEFAULT_REMINDER_HOUR;
  
  const now = new Date();
  const target = new Date();
  target.setHours(reminderHour, 0, 0, 0);
  
  // If target time has passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  await chrome.alarms.create(ALARM_NAME, {
    when: target.getTime(),
    periodInMinutes: 24 * 60
  });
}

// Alarm handler
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const data = await chrome.storage.local.get(['settings']);
  if (!data.settings?.notificationsEnabled) return;

  const today = new Date().toISOString().slice(0, 10);
  const entries = await chrome.storage.local.get([today]);

  if ((entries[today] || []).length === 0) {
    await showNotification();
  }
});

// Show notification
async function showNotification() {
  const options = {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Time for Today's Learning!",
    message: "What new thing did you learn today? Take a moment to reflect and record.",
    buttons: [
      { title: "Open TIL" },
      { title: "Remind me later" }
    ],
    requireInteraction: true
  };

  await chrome.notifications.create(NOTIFICATION_ID, options);
}

// Notification click handler
chrome.notifications.onButtonClicked.addListener(async (notifId, buttonIndex) => {
  if (notifId !== NOTIFICATION_ID) return;

  if (buttonIndex === 0) {
    // Open TIL
    await chrome.action.openPopup();
  } else if (buttonIndex === 1) {
    // Remind later (in 1 hour)
    const now = new Date();
    now.setHours(now.getHours() + 1);
    
    await chrome.alarms.create(ALARM_NAME, {
      when: now.getTime()
    });
  }
  
  await chrome.notifications.clear(NOTIFICATION_ID);
});

// Regular notification click opens the popup
chrome.notifications.onClicked.addListener(async (notifId) => {
  if (notifId === NOTIFICATION_ID) {
    await chrome.action.openPopup();
    await chrome.notifications.clear(NOTIFICATION_ID);
  }
});
  