/**
 * Main Application Logic & State Controller
 */

const STORAGE_KEY = 'atomic_habits_coach_app_state_v1';
let appState = {
  habits: [],
  currentTab: 'today',
  selectedCategory: 'All',
  isCompactMode: false
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadAppState();
  renderApp();
  setupTouchAndGestures();
});

// Load state from localStorage or load default seed data
function loadAppState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState.habits = parsed.habits || [];
      appState.currentTab = parsed.currentTab || 'today';
      appState.selectedCategory = parsed.selectedCategory || 'All';
      appState.isCompactMode = parsed.isCompactMode || false;
      
      hydrateAppStateChapters();
    } else {
      appState.habits = JSON.parse(JSON.stringify(initialHabitsData));
      saveAppState();
    }
  } catch (err) {
    console.error('Failed to load state from storage:', err);
    appState.habits = JSON.parse(JSON.stringify(initialHabitsData));
  }
}

// Hydrate state for Chapter 11-17 upgrades
function hydrateAppStateChapters() {
  if (!appState.habits || !Array.isArray(appState.habits)) return;

  appState.habits.forEach(habit => {
    const seedMatch = initialHabitsData.find(seed => seed.id === habit.id);
    if (seedMatch) {
      seedMatch.actionItems.forEach(seedItem => {
        const exists = habit.actionItems.some(item => item.id === seedItem.id || item.chapter === seedItem.chapter);
        if (!exists) {
          habit.actionItems.push(JSON.parse(JSON.stringify(seedItem)));
        }
      });
      if (!habit.gatewayHabit) habit.gatewayHabit = seedMatch.gatewayHabit;
      if (!habit.commitmentDevice) habit.commitmentDevice = seedMatch.commitmentDevice;
      if (!habit.neverMissTwiceRule) habit.neverMissTwiceRule = seedMatch.neverMissTwiceRule;
      if (!habit.accountabilityContract) habit.accountabilityContract = seedMatch.accountabilityContract;
    } else {
      const existingChapters = new Set(habit.actionItems.map(i => i.chapter));

      if (!existingChapters.has("Ch 11: Motion vs Action")) {
        habit.actionItems.push({
          id: `${habit.id}-act-11`,
          chapter: "Ch 11: Motion vs Action",
          text: `Action Over Motion: Execute daily practice of ${habit.title} over planning/researching`,
          completed: false,
          isIdentityVote: false
        });
      }
      if (!existingChapters.has("Ch 12: Law of Least Effort")) {
        habit.actionItems.push({
          id: `${habit.id}-act-12`,
          chapter: "Ch 12: Law of Least Effort",
          text: `Prime Environment: Set up physical workspace/gear night before for 60-second start`,
          completed: false,
          isIdentityVote: false
        });
      }
      if (!existingChapters.has("Ch 13: 2-Minute Rule")) {
        habit.actionItems.push({
          id: `${habit.id}-act-13`,
          chapter: "Ch 13: 2-Minute Rule",
          text: `2-Minute Gateway Habit: ${habit.gatewayHabit || `Execute starter 2-minute version of ${habit.title}`}`,
          completed: false,
          isIdentityVote: false
        });
      }
      if (!existingChapters.has("Ch 14: Commitment & Automation")) {
        habit.actionItems.push({
          id: `${habit.id}-act-14`,
          chapter: "Ch 14: Commitment & Automation",
          text: `Commitment & Automation: ${habit.commitmentDevice || 'Automate recurring reminder or calendar block'}`,
          completed: false,
          isIdentityVote: false
        });
      }
      if (!existingChapters.has("Ch 15: Immediate Reward")) {
        habit.actionItems.push({
          id: `${habit.id}-act-15`,
          chapter: "Ch 15: Immediate Reward",
          text: `Immediate Reward: Reward yourself immediately after completing daily action`,
          completed: false,
          isIdentityVote: false
        });
      }
      if (!existingChapters.has("Ch 16: Habit Tracker & Rule")) {
        habit.actionItems.push({
          id: `${habit.id}-act-16`,
          chapter: "Ch 16: Habit Tracker & Rule",
          text: `Tracker & Rule: Visual daily checkmark + NEVER MISS TWICE rule enforced`,
          completed: false,
          isIdentityVote: false
        });
      }
      if (!existingChapters.has("Ch 17: Habit Contract")) {
        habit.actionItems.push({
          id: `${habit.id}-act-17`,
          chapter: "Ch 17: Habit Contract",
          text: `Habit Contract: ${habit.accountabilityContract || 'Share goal with partner; set penalty if skipped'}`,
          completed: false,
          isIdentityVote: false
        });
      }
    }
  });

  saveAppState();
}

// Save state to localStorage
function saveAppState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.error('Failed to save state to storage:', err);
  }
}

// Render entire UI according to active tab
function renderApp() {
  // Always update global stats
  renderDashboardStats(appState.habits);

  // Update tab content visibilities
  const tabs = ['today', 'habits', 'stats', 'system'];
  tabs.forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) {
      if (t === appState.currentTab) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  // Update navigation button active states
  document.querySelectorAll('.nav-tab-item, .desktop-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === appState.currentTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Render specific view components
  if (appState.currentTab === 'today') {
    renderTodayChecklist(appState.habits);
  } else if (appState.currentTab === 'habits') {
    renderCategoryChips(appState.habits, appState.selectedCategory);
    renderHabitsGrid(appState.habits, appState.selectedCategory, appState.isCompactMode);
    
    // Update compact toggle label
    const compactLabel = document.getElementById('compact-toggle-label');
    const compactIcon = document.getElementById('compact-toggle-icon');
    if (compactLabel && compactIcon) {
      compactLabel.textContent = appState.isCompactMode ? 'Full View' : 'Compact View';
      compactIcon.textContent = appState.isCompactMode ? '📖' : '📐';
    }
  } else if (appState.currentTab === 'stats') {
    renderIdentityBreakdown(appState.habits);
  }
}

// Tab Switching Controller
function switchTab(tabId) {
  triggerHaptic('light');
  appState.currentTab = tabId;
  saveAppState();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter Habits by Category
function filterByCategory(category) {
  triggerHaptic('light');
  appState.selectedCategory = category;
  saveAppState();
  renderApp();
}

// Toggle Compact Card Mode
function toggleCompactMode() {
  triggerHaptic('medium');
  appState.isCompactMode = !appState.isCompactMode;
  saveAppState();
  renderApp();
}

// Expand individual habit card in compact mode
function toggleCardExpand(habitId) {
  triggerHaptic('light');
  const actionList = document.getElementById(`action-list-${habitId}`);
  const arrow = document.getElementById(`expand-arrow-${habitId}`);
  if (actionList) {
    actionList.classList.toggle('expanded');
    if (arrow) {
      arrow.textContent = actionList.classList.contains('expanded') ? '▲' : '▼';
    }
  }
}

// Toggle Action Item Checkbox with Haptic & Animation
function toggleActionItem(habitId, itemId, element) {
  const habit = appState.habits.find(h => h.id === habitId);
  if (!habit) return;

  const item = habit.actionItems.find(i => i.id === itemId);
  if (!item) return;

  item.completed = !item.completed;

  // Trigger haptic & animation
  if (item.completed) {
    triggerHaptic('success');
    if (element) {
      const checkbox = element.querySelector('.custom-checkbox');
      if (checkbox) {
        checkbox.classList.remove('pop');
        void checkbox.offsetWidth; // Trigger reflow
        checkbox.classList.add('pop');
      }
    }
  } else {
    triggerHaptic('light');
  }

  // Handle Identity Vote count
  if (item.isIdentityVote) {
    if (item.completed) {
      habit.identity.totalVotesCast += 1;
      showToast(`Vote cast for: "${habit.identity.statement}" 🗳️`);
    } else {
      habit.identity.totalVotesCast = Math.max(0, habit.identity.totalVotesCast - 1);
    }
  }

  // Check if all items completed today for streak bonus
  const allCompleted = habit.actionItems.every(i => i.completed);
  const todayStr = new Date().toISOString().split('T')[0];

  if (allCompleted && habit.lastCompletedDate !== todayStr) {
    habit.streak += 1;
    habit.lastCompletedDate = todayStr;
    showToast(`🎉 ${habit.title} protocol completed today! Streak: ${habit.streak} days!`);
  }

  saveAppState();
  renderApp();
}

// Tactile Web Haptics Helper
function triggerHaptic(type = 'light') {
  if (!('vibrate' in navigator)) return;
  try {
    if (type === 'light') navigator.vibrate(10);
    else if (type === 'medium') navigator.vibrate(25);
    else if (type === 'success') navigator.vibrate([15, 50, 20]);
  } catch (e) {
    // Ignore haptic errors on unsupported devices
  }
}

// Touch Gestures & Mobile Modal Listeners
function setupTouchAndGestures() {
  const modals = [document.getElementById('add-habit-modal'), document.getElementById('blueprint-modal')];

  modals.forEach(modal => {
    if (!modal) return;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Touch Swipe Down to Dismiss Bottom Sheet on Mobile
    const container = modal.querySelector('.modal-container');
    const dragBar = modal.querySelector('.drag-handle-bar');
    if (!container) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        container.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleTouchEnd = () => {
      const deltaY = currentY - startY;
      if (deltaY > 100) {
        modal.classList.remove('active');
        showToast('Sheet closed');
      }
      container.style.transform = '';
      startY = 0;
      currentY = 0;
    };

    if (dragBar) {
      dragBar.addEventListener('touchstart', handleTouchStart, { passive: true });
      dragBar.addEventListener('touchmove', handleTouchMove, { passive: true });
      dragBar.addEventListener('touchend', handleTouchEnd);
    }
  });
}

// Open / Close Blueprint Modal
function openBlueprintModal(habitId) {
  triggerHaptic('medium');
  const habit = appState.habits.find(h => h.id === habitId);
  if (!habit) return;

  renderBlueprintDetails(habit);
  const modal = document.getElementById('blueprint-modal');
  if (modal) modal.classList.add('active');
}

function closeBlueprintModal() {
  triggerHaptic('light');
  const modal = document.getElementById('blueprint-modal');
  if (modal) modal.classList.remove('active');
}

// Open / Close Add Habit Modal
function openAddHabitModal() {
  triggerHaptic('medium');
  const modal = document.getElementById('add-habit-modal');
  if (modal) modal.classList.add('active');
}

function closeAddHabitModal() {
  triggerHaptic('light');
  const modal = document.getElementById('add-habit-modal');
  if (modal) modal.classList.remove('active');
  const form = document.getElementById('add-habit-form');
  if (form) form.reset();
}

// Save New Custom Habit Blueprint
function saveNewHabit(event) {
  event.preventDefault();

  const title = document.getElementById('habit-title').value.trim();
  const category = document.getElementById('habit-category').value.trim();
  const icon = document.getElementById('habit-icon').value.trim() || '⭐️';
  const identityStatement = document.getElementById('habit-identity').value.trim();
  const cue = document.getElementById('habit-cue').value.trim();
  const craving = document.getElementById('habit-craving').value.trim();
  const response = document.getElementById('habit-response').value.trim();
  const reward = document.getElementById('habit-reward').value.trim();
  const stack = document.getElementById('habit-stack').value.trim();
  const envSetup = document.getElementById('habit-env').value.trim();

  if (!title || !identityStatement) {
    alert('Please provide a habit title and identity statement.');
    return;
  }

  const newId = `habit-${Date.now()}`;
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newHabit = {
    id: newId,
    title: title,
    icon: icon,
    category: category || 'Personal Development',
    color: randomColor,
    objective: `Master ${title} through daily compounding action items across all 17 chapters.`,
    identity: {
      statement: identityStatement,
      dailyVoteText: response || `Execute 2-minute version of ${title}`,
      totalVotesCast: 0
    },
    system: response || `Execute daily action for ${title}`,
    plateauMindset: "Focus on daily system consistency; compounding results will reflect over time.",
    habitLoop: {
      cue: cue || "Scheduled daily anchor",
      craving: craving || "Desire for positive growth",
      response: response || title,
      reward: reward || "Ticking off daily vote & feeling accomplished"
    },
    implementationIntention: `I will perform ${title} daily as planned.`,
    habitStack: stack || `After my current routine, I will execute ${title}.`,
    gatewayHabit: `Spend 2 minutes starting ${title}.`,
    commitmentDevice: `Lock calendar block & prime workspace night before.`,
    neverMissTwiceRule: `Log completion on visual tracker; mandatory execution if 1 day missed.`,
    accountabilityContract: `Pledge consistency with partner; set $5 penalty if skipped.`,
    streak: 0,
    lastCompletedDate: null,
    actionItems: [
      {
        id: `${newId}-act-1`,
        chapter: "Ch 2: Identity Vote",
        text: `Cast Daily Identity Vote: ${response || title}`,
        completed: false,
        isIdentityVote: true
      },
      {
        id: `${newId}-act-2`,
        chapter: "Ch 4: Pointing & Calling",
        text: `Awareness Antidote: 'I am about to skip ${title}. Starting 2 minutes right now.'`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-3`,
        chapter: "Ch 5: Habit Stack",
        text: `Habit Stack: ${stack || 'Execute anchor trigger'}`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-4`,
        chapter: "Ch 6: Environment Design",
        text: envSetup || "Prime environment cue in plain sight",
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-5`,
        chapter: "Ch 7: Cue Elimination",
        text: `Remove phone/digital distractions before initiating ${title}`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-6`,
        chapter: "Ch 8: Temptation Bundle",
        text: `Pair ${title} execution with an exclusive enjoyable audio/show reward`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-7`,
        chapter: "Ch 9: Social Culture",
        text: `Share weekly progress update with accountability buddy or community`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-8`,
        chapter: "Ch 10: Mindset Reframe",
        text: `Reframe: 'I GET to practice ${title} and strengthen my identity today'`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-9`,
        chapter: "Ch 11: Motion vs Action",
        text: `Action Over Motion: Execute actual practice of ${title} instead of endless planning`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-10`,
        chapter: "Ch 12: Law of Least Effort",
        text: `Prime Environment: Lay out tools/workspace the night before to start with zero friction`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-11`,
        chapter: "Ch 13: 2-Minute Rule",
        text: `2-Minute Gateway Habit: Downscale habit to 2-minute entry version to master showing up`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-12`,
        chapter: "Ch 14: Commitment & Automation",
        text: `Commitment Device: Set up automated reminder/calendar lock to ensure execution`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-13`,
        chapter: "Ch 15: Immediate Reward",
        text: `Immediate Reward: Grant instant positive reinforcement right after finishing session`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-14`,
        chapter: "Ch 16: Habit Tracker & Rule",
        text: `Tracker & Rule: Log daily checkmark. NEVER MISS TWICE rule strictly enforced`,
        completed: false,
        isIdentityVote: false
      },
      {
        id: `${newId}-act-15`,
        chapter: "Ch 17: Habit Contract",
        text: `Habit Contract: Signed pledge with partner—apply penalty if session missed`,
        completed: false,
        isIdentityVote: false
      }
    ]
  };

  appState.habits.push(newHabit);
  saveAppState();
  showToast(`Blueprint "${title}" created successfully! 🚀`);
  renderApp();
  closeAddHabitModal();
}

// Delete Habit Blueprint
function deleteHabit(habitId) {
  if (!confirm('Are you sure you want to delete this habit blueprint?')) return;
  appState.habits = appState.habits.filter(h => h.id !== habitId);
  saveAppState();
  showToast('Habit blueprint deleted.');
  renderApp();
}

// Reset All Daily Progress
function resetDailyProgress() {
  if (!confirm('Reset all daily action items for today? (Total identity votes & streaks will be preserved)')) return;
  appState.habits.forEach(habit => {
    habit.actionItems.forEach(item => {
      item.completed = false;
    });
  });
  saveAppState();
  showToast('Daily items reset for a fresh day! 🔄');
  renderApp();
}

// Export State to JSON File
function exportDataJSON() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atomic_habits_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded! 💾');
  } catch (err) {
    alert('Failed to export data: ' + err.message);
  }
}

// Import State from JSON File
function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && Array.isArray(imported.habits)) {
        appState = imported;
        saveAppState();
        renderApp();
        showToast('Backup restored successfully! 📥');
      } else {
        alert('Invalid JSON backup structure.');
      }
    } catch (err) {
      alert('Error parsing JSON backup file: ' + err.message);
    }
  };
  reader.readAsText(file);
}
