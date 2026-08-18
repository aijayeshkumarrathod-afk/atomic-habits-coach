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

  document.getElementById('total-votes-count').textContent = totalVotes;
  document.getElementById('active-habits-count').textContent = habits.length;
  document.getElementById('total-streak-count').textContent = `${totalStreaks} Days`;

  // Update progress bar
  const progressFill = document.getElementById('adherence-progress-fill');
  const progressText = document.getElementById('adherence-text');
  if (progressFill && progressText) {
    progressFill.style.width = `${avgAdherence}%`;
    progressText.textContent = `${completedActionItems} / ${totalActionItems} Action Items Completed Today (${avgAdherence}%)`;
  }
}

// Render Habit Cards Grid
function renderHabitsGrid(habits) {
  const container = document.getElementById('habits-container');
  if (!container) return;

  if (habits.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
        <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 16px;">No habit blueprints active yet.</p>
        <button class="btn-primary" onclick="openAddHabitModal()">+ Create First Habit Blueprint</button>
      </div>
    `;
    return;
  }

  container.innerHTML = habits.map(habit => renderHabitCard(habit)).join('');
}

// Render Individual Habit Card
function renderHabitCard(habit) {
  const completedCount = habit.actionItems.filter(i => i.completed).length;
  const totalCount = habit.actionItems.length;

  return `
    <div class="habit-card" id="card-${habit.id}">
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

        <div class="action-items-list">
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
    <div class="action-item-row ${isCompleted ? 'completed' : ''}" onclick="toggleActionItem('${habitId}', '${item.id}')">
      <div class="custom-checkbox">
        ${isCompleted ? '✓' : ''}
      </div>
      <div class="action-item-content">
        <span class="chapter-badge ${isIdentityVote ? 'identity-badge' : ''}">${escapeHtml(item.chapter)}</span>
        <div class="action-text">${escapeHtml(item.text)}</div>
      </div>
    </div>
  `;
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
