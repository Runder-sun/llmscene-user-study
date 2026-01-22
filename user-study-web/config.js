// ========================================
// Configuration File - Modify as needed
// ========================================

// Google Apps Script Web App URL
// After deploying Google Apps Script, paste the generated URL here
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXgIFIfPM-ZEezSryVinmqhwBsnvR8LDksX_Q5IV-gSP58OOCvEiwPvmukQUGT_xSn/exec';

// Scene Configuration
const SCENE_CONFIG = {
    // Scene types and their display names
    sceneTypes: {
        'bedroom': 'Bedroom',
        'board_game_room': 'Board Game Room',
        'diningroom': 'Dining Room',
        'gym': 'Gym',
        'livingroom': 'Living Room',
        'office': 'Office',
        'poolroom': 'Pool Room',
        'studyroom': 'Study Room'
    },
    
    // Prompt list for each scene type
    prompts: {
        'bedroom': ['prompt33', 'prompt36'],
        'board_game_room': ['prompt29', 'prompt30'],
        'diningroom': ['prompt23', 'prompt40'],
        'gym': ['prompt2', 'prompt15'],
        'livingroom': ['prompt33', 'prompt59'],
        'office': ['prompt34', 'prompt36'],
        'poolroom': ['prompt18', 'prompt23'],
        'studyroom': ['prompt12', 'prompt24']
    },
    
    // Method list and display names
    methods: {
        'holodeck': 'Method A',
        'idesign': 'Method B',
        'layoutgpt': 'Method C',
        'layoutvlm': 'Method D',
        'ours': 'Method E'
    },
    
    // Special filename mapping (for inconsistent naming)
    specialFileNames: {
        'bedroom/prompt36': {
            'holodeck': 'Holodeck1_bed36.png',
            'idesign': 'Idesign1.png',
            'layoutgpt': 'Layoutgpt1.png',
            'layoutvlm': 'LayoutVLM1.png',
            'ours': 'Ours1_bed36.png'
        }
    },
    
    // Default filename format
    defaultFileNames: {
        'holodeck': 'holodeck.png',
        'idesign': 'idesign.png',
        'layoutgpt': 'layoutgpt.png',
        'layoutvlm': 'layoutvlm.png',
        'ours': 'ours.png'
    },
    
    // Number of scenes per evaluation session
    promptsPerSession: 5,
    
    // Image base path (relative to website root)
    imageBasePath: '../'
};

// Generate all possible prompt combinations
function generateAllPrompts() {
    const allPrompts = [];
    for (const [sceneType, prompts] of Object.entries(SCENE_CONFIG.prompts)) {
        for (const prompt of prompts) {
            allPrompts.push({
                sceneType: sceneType,
                promptId: prompt,
                displayName: SCENE_CONFIG.sceneTypes[sceneType]
            });
        }
    }
    return allPrompts;
}

// Get image filename
function getImageFileName(sceneType, promptId, method) {
    const key = `${sceneType}/${promptId}`;
    if (SCENE_CONFIG.specialFileNames[key] && SCENE_CONFIG.specialFileNames[key][method]) {
        return SCENE_CONFIG.specialFileNames[key][method];
    }
    return SCENE_CONFIG.defaultFileNames[method];
}

// Get full image path
function getImagePath(sceneType, promptId, method) {
    const fileName = getImageFileName(sceneType, promptId, method);
    return `${SCENE_CONFIG.imageBasePath}${sceneType}/${promptId}/${fileName}`;
}
