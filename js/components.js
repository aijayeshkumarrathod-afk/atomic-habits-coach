/**
 * UI Components & HTML Templates Renderer
 */

// Render Overall Stats & Identity Scorecard
function renderDashboardStats(habits) {
  const totalVotes = habits.reduce((sum, h) => sum + h.identity.totalVotesCast, 0);
  const totalActionItems = habits.reduce((sum, h) => sum + h.actionItems.length, 0);
  const completedActionItems = habits.reduce((sum, h) => sum + h.actionItems.filter(i => i.completed).length, 0);
  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgAdherence = totalActionItems > 0 ? Math.round((completedActionItems / totalActionItems) * 100) : 0;

  const votesEl = document.getElementById('total-votes-count');
  const habitsEl = document.getElementById('active-habits-count');
  const streakEl = document.getElementById('total-streak-count');
  
  if (votesEl) votesEl.textContent = totalVotes;
  if (habitsEl) habitsEl.textContent = habits.length;
  if (streakEl) streakEl.textContent = `${totalStreaks} Days`;

  // Update progress bar
  const progressFill = document.getElementById('adherence-progress-fill');
  const progressText = document.getElementById('adherence-text');
  if (progressFill && progressText) {
    progressFill.style.width = `${avgAdherence}%`;
    progressText.textContent = `${completedActionItems} / ${totalActionItems} Action Items Completed Today (${avgAdherence}%)`;
  }

  // Update remaining counter on Today tab
  const remainingBadge = document.getElementById('today-counter-badge');
  if (remainingBadge) {
    const remainingCount = totalActionItems - completedActionItems;
    remainingBadge.textContent = remainingCount === 0 && totalActionItems > 0 
      ? '🎉 All Done Today!' 
      : `${remainingCount} Actions Remaining`;
  }
}

// Render Today's Focused Checklist View (Tab 1)
function renderTodayChecklist(habits) {
  const container = document.getElementById('today-checklist-container');
  if (!container) return;

  if (habits.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 16px;">No habit protocols active for today.</p>
        <button class="btn-primary" onclick="openAddHabitModal()">+ Create First Blueprint</button>
      </div>
    `;
    return;
  }

  container.innerHTML = habits.map(habit => {
    const completedCount = habit.actionItems.filter(i => i.completed).length;
    const totalCount = habit.actionItems.length;

    return `
      <div class="today-habit-group">
        <div class="today-group-header">
          <div class="today-group-title">
            <span style="font-size: 1.5rem;">${habit.icon}</span>
            <div>
              <div style="color: white; font-weight: 700;">${escapeHtml(habit.title)}</div>
              <div style="font-size: 0.78rem; color: var(--purple-primary); font-weight: 600;">"${escapeHtml(habit.identity.statement)}"</div>
            </div>
          </div>
          <div class="action-counter" style="font-size: 0.8rem; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 12px;">
            ${completedCount} / ${totalCount} Done
          </div>
        </div>

        <div class="action-items-list">
          ${habit.actionItems.map(item => renderActionItem(habit.id, item)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Render Category Filter Chips Bar
function renderCategoryChips(habits, selectedCategory) {
  const container = document.getElementById('category-filter-chips');
  if (!container) return;

  const categories = ['All', ...new Set(habits.map(h => h.category).filter(Boolean))];
  
  container.innerHTML = categories.map(cat => {
    const isActive = (selectedCategory === cat) || (selectedCategory === 'all' && cat === 'All');
    return `
      <button class="category-chip ${isActive ? 'active' : ''}" onclick="filterByCategory('${escapeHtml(cat)}')">
        ${escapeHtml(cat)}
      </button>
    `;
  }).join('');
}

// Render Habit Cards Grid (Tab 2)
function renderHabitsGrid(habits, selectedCategory = 'All', isCompactMode = false) {
  const container = document.getElementById('habits-container');
  if (!container) return;

  let filtered = habits;
  if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
    filtered = habits.filter(h => h.category && h.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 16px;">No habit blueprints found for category "${escapeHtml(selectedCategory)}".</p>
        <button class="btn-primary" onclick="filterByCategory('All')">Show All Blueprints</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(habit => renderHabitCard(habit, isCompactMode)).join('');
}

// Render Individual Habit Card
function renderHabitCard(habit, isCompactMode = false) {
  const completedCount = habit.actionItems.filter(i => i.completed).length;
  const totalCount = habit.actionItems.length;

  return `
    <div class="habit-card ${isCompactMode ? 'compact' : ''}" id="card-${habit.id}">
      <div class="habit-card-header">
        <div class="habit-top-row">
          <div class="habit-title-area">
            <div class="habit-icon" style="box-shadow: 0 0 15px ${habit.color}33;">${habit.icon}</div>
            <div>
              <h3 class="habit-name">${escapeHtml(habit.title)}</h3>
              <span class="habit-category">${escapeHtml(habit.category)}</span>
            </div>
          </div>
          <div class="streak-badge">
            🔥 ${habit.streak} Day Streak
          </div>
        </div>

        <div class="habit-identity-banner">
          <span style="color: var(--text-muted); font-size: 0.78rem;">IDENTITY VOTE:</span><br/>
          <span class="identity-highlight">"${escapeHtml(habit.identity.statement)}"</span>
          <div style="margin-top: 6px; font-size: 0.78rem; color: var(--text-muted);">
            🗳️ Total Votes Cast: <strong style="color: white;">${habit.identity.totalVotesCast}</strong>
          </div>
        </div>
      </div>

      <div class="action-items-container">
        <div class="action-items-header">
          <span class="action-items-title">Daily Action Items & Upgrades</span>
          <span class="action-counter">${completedCount} / ${totalCount} Done</span>
        </div>

        ${isCompactMode ? `
          <div class="compact-summary" onclick="toggleCardExpand('${habit.id}')" style="cursor: pointer;">
            <span>Tap to expand ${totalCount} chapter protocols...</span>
            <span id="expand-arrow-${habit.id}">▼</span>
          </div>
        ` : ''}

        <div class="action-items-list" id="action-list-${habit.id}">
          ${habit.actionItems.map(item => renderActionItem(habit.id, item)).join('')}
        </div>
      </div>

      <div class="habit-card-footer">
        <button class="btn-link" onclick="openBlueprintModal('${habit.id}')">
          📖 View Full Blueprint (Ch. 1-17) ➔
        </button>
        <button class="btn-link" style="color: var(--text-muted);" onclick="deleteHabit('${habit.id}')">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;
}

// Render Single Action Item Row
function renderActionItem(habitId, item) {
  const isCompleted = item.completed;
  const isIdentityVote = item.isIdentityVote;

  return `
    <div class="action-item-row ${isCompleted ? 'completed' : ''}" onclick="toggleActionItem('${habitId}', '${item.id}', this)">
      <div class="custom-checkbox ${isCompleted ? 'pop' : ''}">
        ${isCompleted ? '✓' : ''}
      </div>
      <div class="action-item-content">
        <span class="chapter-badge ${isIdentityVote ? 'identity-badge' : ''}">${escapeHtml(item.chapter)}</span>
        <div class="action-text">${escapeHtml(item.text)}</div>
      </div>
    </div>
  `;
}

// Render Identity Scorecard Breakdown (Tab 3)
function renderIdentityBreakdown(habits) {
  const container = document.getElementById('identity-breakdown-container');
  if (!container) return;

  if (habits.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No identity records available.</p>`;
    return;
  }

  container.innerHTML = habits.map(h => `
    <div class="identity-breakdown-card">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span style="font-size: 1.5rem;">${h.icon}</span>
          <strong style="font-family: 'Outfit'; font-size: 1.1rem; color: white;">${escapeHtml(h.title)}</strong>
        </div>
        <p style="font-size: 0.85rem; color: var(--purple-primary); font-style: italic; margin-bottom: 12px;">
          "${escapeHtml(h.identity.statement)}"
        </p>
      </div>
      <div style="background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; color: var(--text-muted);">Total Identity Votes:</span>
        <span style="font-family: 'Outfit'; font-size: 1.3rem; font-weight: 800; color: var(--emerald-primary);">🗳️ ${h.identity.totalVotesCast}</span>
      </div>
    </div>
  `).join('');
}

// Render Full Blueprint Modal Content
function renderBlueprintDetails(habit) {
  const content = document.getElementById('blueprint-modal-body');
  if (!content) return;

  content.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
      <span style="font-size: 2.2rem;">${habit.icon}</span>
      <div>
        <h2 style="font-family: 'Outfit'; font-size: 1.5rem;">${escapeHtml(habit.title)}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${escapeHtml(habit.objective)}</p>
      </div>
    </div>

    <!-- 4-Step Habit Loop -->
    <h4 style="margin-bottom: 12px; font-family: 'Outfit'; color: var(--blue-primary);">🔄 The 4-Step Habit Loop (Chapter 3)</h4>
    <div class="habit-loop-grid">
      <div class="loop-step">
        <div class="loop-step-title">1. CUE (Ch. 4, 6, 7)</div>
        <div class="loop-step-desc">${escapeHtml(habit.habitLoop.cue)}</div>
      </div>
      <div class="loop-step">
        <div class="loop-step-title">2. CRAVING (Ch. 8, 9, 10)</div>
        <div class="loop-step-desc">${escapeHtml(habit.habitLoop.craving)}</div>
      </div>
      <div class="loop-step">
        <div class="loop-step-title">3. RESPONSE (Ch. 11-14)</div>
        <div class="loop-step-desc">${escapeHtml(habit.habitLoop.response)}</div>
      </div>
      <div class="loop-step">
        <div class="loop-step-title">4. REWARD (Ch. 15-17)</div>
        <div class="loop-step-desc">${escapeHtml(habit.habitLoop.reward)}</div>
      </div>
    </div>

    <!-- Implementation & Habit Stack -->
    <div style="background: var(--bg-surface-elevated); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 16px;">
      <h4 style="margin-bottom: 8px; font-family: 'Outfit'; color: var(--emerald-primary);">⏱️ Implementation Intention (Ch. 5)</h4>
      <p style="font-size: 0.9rem; margin-bottom: 12px; font-style: italic; color: #a7f3d0;">"${escapeHtml(habit.implementationIntention)}"</p>

      <h4 style="margin-bottom: 8px; font-family: 'Outfit'; color: var(--purple-primary);">🔗 Habit Stack Formula</h4>
      <p style="font-size: 0.9rem; font-style: italic; color: #e9d5ff;">"${escapeHtml(habit.habitStack)}"</p>
    </div>

    <!-- 3rd Law: Make It Easy Protocols (Ch. 11-14) -->
    <div style="background: var(--bg-surface-elevated); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 16px;">
      <h4 style="margin-bottom: 10px; font-family: 'Outfit'; color: #60a5fa;">⚡ 3rd Law: Make It Easy (Ch. 11–14)</h4>
      
      <div style="margin-bottom: 10px;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">⏱️ 2-MINUTE GATEWAY HABIT (Ch. 13):</span>
        <div style="font-size: 0.9rem; color: var(--text-main); font-weight: 500;">"${escapeHtml(habit.gatewayHabit || 'Execute 2-minute starter version')}"</div>
      </div>

      <div>
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">🔒 COMMITMENT DEVICE & AUTOMATION (Ch. 14):</span>
        <div style="font-size: 0.9rem; color: var(--text-main); font-weight: 500;">"${escapeHtml(habit.commitmentDevice || 'Automated recurring trigger or device setup')}"</div>
      </div>
    </div>

    <!-- 4th Law: Make It Satisfying Protocols (Ch. 15-17) -->
    <div style="background: var(--bg-surface-elevated); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 16px;">
      <h4 style="margin-bottom: 10px; font-family: 'Outfit'; color: #f472b6;">🎁 4th Law: Make It Satisfying (Ch. 15–17)</h4>
      
      <div style="margin-bottom: 10px;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">📊 NEVER MISS TWICE RULE (Ch. 16):</span>
        <div style="font-size: 0.9rem; color: var(--text-main); font-weight: 500;">"${escapeHtml(habit.neverMissTwiceRule || 'Visual tracker logged daily; mandatory execution if 1 day missed')}"</div>
      </div>

      <div>
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">📜 ACCOUNTABILITY CONTRACT (Ch. 17):</span>
        <div style="font-size: 0.9rem; color: var(--text-main); font-weight: 500;">"${escapeHtml(habit.accountabilityContract || 'Public pledge with partner with penalty for skipping')}"</div>
      </div>
    </div>

    <!-- Plateau of Latent Potential -->
    <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 16px; border-radius: var(--radius-md); margin-bottom: 24px;">
      <h4 style="color: #fbbf24; font-family: 'Outfit'; margin-bottom: 4px;">📈 Plateau of Latent Potential (Ch. 1)</h4>
      <p style="font-size: 0.88rem; color: var(--text-main);">${escapeHtml(habit.plateauMindset)}</p>
    </div>

    <!-- Full Chapter Action Breakdown -->
    <h4 style="margin-bottom: 14px; font-family: 'Outfit';">📋 Complete Chapter Action Items & Protocols (Ch. 1 to 17)</h4>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${habit.actionItems.map(item => `
        <div style="background: var(--bg-primary); padding: 12px 16px; border-radius: var(--radius-sm); border-left: 3px solid ${habit.color};">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${escapeHtml(item.chapter)}</span>
          <div style="font-size: 0.9rem; margin-top: 2px;">${escapeHtml(item.text)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Toast notification helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>⚡</span> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Utility HTML escaper to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
