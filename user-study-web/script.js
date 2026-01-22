// ========================================
// Main Script File
// ========================================

// Global state
let state = {
    sessionId: generateSessionId(),
    selectedPrompts: [],
    currentIndex: 0,
    results: [],
    startTime: null
};

// Generate unique session ID
function generateSessionId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Shuffle array randomly
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Bind start button
    document.getElementById('start-btn').addEventListener('click', startEvaluation);
    
    // Bind navigation buttons
    document.getElementById('prev-btn').addEventListener('click', previousPrompt);
    document.getElementById('next-btn').addEventListener('click', nextPrompt);
    
    // Bind modal close
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('image-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});

// Start evaluation
function startEvaluation() {
    state.startTime = new Date();
    
    // Generate all prompts and randomly select 5
    const allPrompts = generateAllPrompts();
    state.selectedPrompts = shuffleArray(allPrompts).slice(0, SCENE_CONFIG.promptsPerSession);
    
    // Initialize results array with random label-to-method mapping for each scene
    state.results = state.selectedPrompts.map(prompt => {
        // For each scene, randomly assign methods to labels A-E
        const shuffledMethods = shuffleArray([...SCENE_CONFIG.methodKeys]);
        const labelToMethod = {};  // e.g., {'A': 'holodeck', 'B': 'ours', ...}
        SCENE_CONFIG.methodLabels.forEach((label, index) => {
            labelToMethod[label] = shuffledMethods[index];
        });
        
        return {
            sceneType: prompt.sceneType,
            promptId: prompt.promptId,
            physicsRanking: null,  // Will store actual method names
            visualRanking: null,   // Will store actual method names
            labelToMethod: labelToMethod  // Random mapping for this scene
        };
    });
    
    // Switch to evaluation page
    showPage('evaluation-page');
    
    // Setup criteria toggle
    setupCriteriaToggle();
    
    loadCurrentPrompt();
}

// Setup criteria toggle panel
function setupCriteriaToggle() {
    const toggleBtn = document.getElementById('criteria-toggle');
    const content = document.getElementById('criteria-content');
    
    if (toggleBtn && content) {
        toggleBtn.addEventListener('click', function() {
            toggleBtn.classList.toggle('active');
            content.classList.toggle('active');
        });
    }
}

// Show specified page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Load current prompt
function loadCurrentPrompt() {
    const current = state.selectedPrompts[state.currentIndex];
    const result = state.results[state.currentIndex];
    
    // Update progress bar
    const progress = ((state.currentIndex + 1) / state.selectedPrompts.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = 
        `${state.currentIndex + 1} / ${state.selectedPrompts.length}`;
    
    // Update scene type (more prominent)
    document.getElementById('scene-type').textContent = current.displayName;
    
    // Update prompt text (full prompt instead of ID)
    const promptKey = `${current.sceneType}/${current.promptId}`;
    const promptText = SCENE_CONFIG.promptTexts[promptKey] || 'Prompt not available';
    document.getElementById('prompt-text').textContent = promptText;
    
    // Load images (always in fixed order A, B, C, D, E)
    loadImages(current, result);
    
    // Load ranking lists
    loadRankingLists(result);
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Load images - always display in fixed order A, B, C, D, E
function loadImages(prompt, result) {
    const grid = document.getElementById('images-grid');
    grid.innerHTML = '';
    
    // Display in fixed label order (A, B, C, D, E)
    SCENE_CONFIG.methodLabels.forEach((label) => {
        const method = result.labelToMethod[label];  // Get actual method for this label
        
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.method = method;
        card.dataset.label = label;
        
        const imgPath = getImagePath(prompt.sceneType, prompt.promptId, method);
        const displayName = label;  // Always show label (Method A, B, C, D, E)
        
        // Create image element with better error handling
        const img = document.createElement('img');
        img.alt = displayName;
        img.loading = 'lazy';
        
        // Add loading state
        card.classList.add('loading');
        
        img.onload = function() {
            card.classList.remove('loading');
            card.classList.add('loaded');
        };
        
        img.onerror = function() {
            card.classList.remove('loading');
            card.classList.add('error');
            // Try to reload once after a short delay
            if (!this.dataset.retried) {
                this.dataset.retried = 'true';
                setTimeout(() => {
                    this.src = imgPath + '?t=' + Date.now();
                }, 1000);
            } else {
                this.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect fill="#f0f0f0" width="400" height="300"/>
                        <text x="200" y="140" text-anchor="middle" fill="#999" font-size="16">Image Loading Failed</text>
                        <text x="200" y="170" text-anchor="middle" fill="#aaa" font-size="12">Click to retry</text>
                    </svg>
                `);
            }
        };
        
        img.src = imgPath;
        
        const label = document.createElement('div');
        label.className = 'method-label';
        label.textContent = displayName;
        
        card.appendChild(img);
        card.appendChild(label);
        
        // Click to enlarge or retry on error
        card.addEventListener('click', function() {
            if (card.classList.contains('error')) {
                // Retry loading
                card.classList.remove('error');
                card.classList.add('loading');
                img.dataset.retried = '';
                img.src = imgPath + '?t=' + Date.now();
            } else {
                openModal(imgPath, displayName);
            }
        });
        
        grid.appendChild(card);
    });
}

// Load ranking lists
function loadRankingLists(result) {
    // Get labels in fixed order, convert existing rankings (method names) to labels
    const labels = [...SCENE_CONFIG.methodLabels];  // Always A, B, C, D, E
    
    // Create reverse mapping: method -> label
    const methodToLabel = {};
    for (const [label, method] of Object.entries(result.labelToMethod)) {
        methodToLabel[method] = label;
    }
    
    // Physics plausibility ranking - convert method names to labels if exists
    let physicsLabels;
    if (result.physicsRanking) {
        physicsLabels = result.physicsRanking.map(method => methodToLabel[method]);
    } else {
        physicsLabels = [...labels];
    }
    loadSortableList('physics-ranking', physicsLabels, result);
    
    // Visual quality ranking - convert method names to labels if exists
    let visualLabels;
    if (result.visualRanking) {
        visualLabels = result.visualRanking.map(method => methodToLabel[method]);
    } else {
        visualLabels = [...labels];
    }
    loadSortableList('visual-ranking', visualLabels, result);
}

// Load sortable list - now takes labels (Method A, B, C, D, E) instead of method names
function loadSortableList(listId, labels, result) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    
    labels.forEach((label, index) => {
        const li = document.createElement('li');
        li.dataset.label = label;  // Store label
        li.dataset.method = result.labelToMethod[label];  // Store actual method
        li.innerHTML = `
            <span class="rank-number">${index + 1}</span>
            <span class="method-name">${label}</span>
            <span class="drag-handle">⋮⋮</span>
        `;
        list.appendChild(li);
    });
    
    // Initialize Sortable
    new Sortable(list, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function() {
            updateRankNumbers(list);
            saveCurrentRanking();
        }
    });
}

// Update rank numbers
function updateRankNumbers(list) {
    const items = list.querySelectorAll('li');
    items.forEach((item, index) => {
        item.querySelector('.rank-number').textContent = index + 1;
    });
}

// Save current ranking
function saveCurrentRanking() {
    const result = state.results[state.currentIndex];
    
    // Get physics ranking
    const physicsItems = document.querySelectorAll('#physics-ranking li');
    result.physicsRanking = Array.from(physicsItems).map(item => item.dataset.method);
    
    // Get visual ranking
    const visualItems = document.querySelectorAll('#visual-ranking li');
    result.visualRanking = Array.from(visualItems).map(item => item.dataset.method);
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = state.currentIndex === 0;
    
    if (state.currentIndex === state.selectedPrompts.length - 1) {
        nextBtn.textContent = 'Submit';
    } else {
        nextBtn.textContent = 'Next';
    }
}

// Previous prompt
function previousPrompt() {
    if (state.currentIndex > 0) {
        saveCurrentRanking();
        state.currentIndex--;
        loadCurrentPrompt();
    }
}

// Next prompt
function nextPrompt() {
    saveCurrentRanking();
    
    if (state.currentIndex < state.selectedPrompts.length - 1) {
        state.currentIndex++;
        loadCurrentPrompt();
    } else {
        // Submit results
        submitResults();
    }
}

// Submit results
async function submitResults() {
    showPage('completion-page');
    
    const statusBox = document.getElementById('submission-status');
    statusBox.innerHTML = '<p>⏳ Submitting data...</p>';
    statusBox.className = 'status-box';
    
    // Prepare submission data
    const submissionData = {
        sessionId: state.sessionId,
        timestamp: new Date().toISOString(),
        duration: Math.round((new Date() - state.startTime) / 1000),
        results: state.results.map(r => ({
            sceneType: r.sceneType,
            promptId: r.promptId,
            physicsRanking: r.physicsRanking,
            visualRanking: r.visualRanking
        }))
    };
    
    try {
        // Try to submit to Google Sheets
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            await submitToGoogleSheets(submissionData);
            statusBox.innerHTML = '<p>✅ Data successfully submitted!</p>';
            statusBox.className = 'status-box success';
        } else {
            // If URL not configured, show JSON data for manual submission
            statusBox.innerHTML = `
                <p>⚠️ Server not configured. Please save the following data manually:</p>
                <textarea style="width:100%; height:150px; margin-top:10px; font-family:monospace; font-size:12px;">${JSON.stringify(submissionData, null, 2)}</textarea>
                <button onclick="copyToClipboard()" style="margin-top:10px; padding:10px 20px; cursor:pointer;">Copy to Clipboard</button>
            `;
            statusBox.className = 'status-box';
        }
    } catch (error) {
        console.error('Submission error:', error);
        statusBox.innerHTML = `
            <p>❌ Submission failed. Please save the following data manually:</p>
            <textarea style="width:100%; height:150px; margin-top:10px; font-family:monospace; font-size:12px;">${JSON.stringify(submissionData, null, 2)}</textarea>
            <button onclick="copyToClipboard()" style="margin-top:10px; padding:10px 20px; cursor:pointer;">Copy to Clipboard</button>
        `;
        statusBox.className = 'status-box error';
    }
    
    // Show summary
    showSummary();
}

// Submit to Google Sheets
async function submitToGoogleSheets(data) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',  // Required for Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    // Cannot read response in no-cors mode, assume success
    return true;
}

// Copy to clipboard
function copyToClipboard() {
    const textarea = document.querySelector('#submission-status textarea');
    if (textarea) {
        textarea.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    }
}

// Show summary - display using labels (Method A, B, etc.) for user
function showSummary() {
    const summaryContent = document.getElementById('summary-content');
    
    let html = '<table style="width:100%; border-collapse:collapse;">';
    html += '<tr style="background:#f0f0f0;"><th style="padding:10px; text-align:left;">Scene</th><th style="padding:10px; text-align:left;">Physics Ranking</th><th style="padding:10px; text-align:left;">Visual Ranking</th></tr>';
    
    state.results.forEach(result => {
        // Create reverse mapping for this scene: method -> label
        const methodToLabel = {};
        for (const [label, method] of Object.entries(result.labelToMethod)) {
            methodToLabel[method] = label;
        }
        
        const physicsStr = result.physicsRanking.map(m => methodToLabel[m]).join(' > ');
        const visualStr = result.visualRanking.map(m => methodToLabel[m]).join(' > ');
        
        html += `<tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;">${SCENE_CONFIG.sceneTypes[result.sceneType]}<br><small>${result.promptId}</small></td>
            <td style="padding:10px; font-size:0.85em;">${physicsStr}</td>
            <td style="padding:10px; font-size:0.85em;">${visualStr}</td>
        </tr>`;
    });
    
    html += '</table>';
    
    // Note: Don't show average rankings to user since labels are random per scene
    html += '<p style="margin-top:20px; color:#666; font-style:italic;">Thank you for your evaluation! Your rankings have been recorded.</p>';
    
    summaryContent.innerHTML = html;
}

// Open modal
function openModal(imgSrc, caption) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    
    modal.classList.add('active');
    modalImg.src = imgSrc;
    modalCaption.textContent = caption;
}

// Close modal
function closeModal() {
    document.getElementById('image-modal').classList.remove('active');
}
