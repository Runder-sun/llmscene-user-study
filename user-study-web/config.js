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
    imageBasePath: '../',
    
    // Full prompt texts for each scene
    promptTexts: {
        'bedroom/prompt33': 'I want a modern minimalist bedroom with a sleek bed, gray wardrobe, and a simple nightstand.',
        'bedroom/prompt36': 'I want a modern minimalist bedroom with sleek nightstands and a traditional dark wood wardrobe for ample storage.',
        'board_game_room/prompt29': 'This Scandinavian-style Board Game Room centers on a large rectangular light-oak gaming table with rounded edges, surrounded by six gray upholstered dining-style chairs with wooden legs and a slim white metal pendant lamp hanging directly above it. Along one side, a low white sideboard with three compartments holds a small bamboo tray organizer, a white ceramic bowl for dice, and a compact black Bluetooth speaker, with two matching light-oak stools tucked neatly beneath. On the opposite side, a long light-wood shelving unit with open cubbies houses a row of labeled storage boxes, three woven rattan baskets for card decks, two narrow vertical card organizers, a wooden game-piece tray with dividers, a slim wooden magazine rack for rulebooks, and a small portable game timer, all arranged in a very tidy manner.',
        'board_game_room/prompt30': 'This luxurious minimalist Board Game Room is centered around a large rectangular black oak gaming table with a felt inlay, surrounded by eight slim-profile leather chairs with metal legs, evenly spaced on all sides. On one side of the room, a low walnut sideboard runs parallel to the table, topped with a sculptural brass task lamp, a leather dice tray, and two organized acrylic storage boxes for game pieces, while a sleek glass-fronted bar cart with metal frame stands next to it.',
        'diningroom/prompt23': 'This minimalist dining room features a long rectangular light oak dining table centered along the length of the space, surrounded by eight slim black metal-framed dining chairs with light gray upholstered seats, four on each long side and none at the ends. At one end of the room, a low white sideboard stands against the long axis, with a narrow black metal-framed console table positioned directly beside it.',
        'diningroom/prompt40': 'This small industrial dining room centers on a rectangular, weathered dark-wood dining table with a black metal frame, surrounded by four mismatched metal dining chairs and two low, backless metal stools tucked on one side. A narrow black metal bar cart with two wooden shelves stands next to the table, cluttered with bottles and stacked glass tumblers.',
        'gym/prompt2': 'This modern gym is arranged along the length of a narrow space, with equipment lined up neatly to keep circulation clear. At one end, a compact rubber-coated dumbbell rack holds a full set of black hex dumbbells, with an adjustable flat-to-incline weight bench positioned directly in front of it and a small metal utility stool tucked beside the bench.',
        'gym/prompt15': 'This open-plan traditional-style gym features a central row of six black metal squat racks with matching barbell sets facing a line of three heavy-duty flat weight benches, with a pair of adjustable dumbbell racks in chrome and dark wood finish running parallel to them. In one corner, four classic wooden-framed cardio machines (two treadmills and two ellipticals) face a freestanding mirrored storage console.',
        'livingroom/prompt33': 'I want a modern livingroom with a tufted leather sofa and comfy mid-century lounge chairs.',
        'livingroom/prompt59': 'I want a modern minimalist livingroom with a sleek sofa, lounge chair, and plenty of storage.',
        'office/prompt34': 'This spacious minimalist office features a long black matte executive desk centered in the room with a low-profile black ergonomic office chair behind it, a slim dark wood credenza directly behind the chair, and two charcoal fabric guest chairs facing the desk; to one side sits a large dark wood meeting table with four black metal-framed chairs around it.',
        'office/prompt36': 'This modern open-plan office features four white laminate workstation desks with metal legs arranged in two facing rows, each desk paired with a black mesh ergonomic task chair and a slim dual-monitor stand, with a shared low mobile pedestal drawer unit between each pair.',
        'poolroom/prompt18': 'This Billiards Room centers on a full-size, dark-stained oak pool table with a slightly worn green felt surface, surrounded by a mix of mismatched industrial-style metal stools clustered on one long side where people watch the game. A scuffed, low metal-and-reclaimed-wood bar cart is parked near one corner of the table, crowded with liquor bottles, glass tumblers, and a metal ice bucket.',
        'poolroom/prompt23': 'This large Bohemian Billiards Room centers on a full-size dark-stained wooden pool table with a woven jute rug underneath, flanked on one side by a low rattan bench with earth-toned cushions and a carved wooden cue rack standing beside it, and on the other side by a pair of mismatched upholstered armchairs in muted terracotta and olive facing the table.',
        'studyroom/prompt12': 'A spacious mid-century modern study room features a large walnut executive desk at the center with a worn leather swivel chair behind it, a slim metal desk lamp, two ceramic pencil cups, a cluttered stack of folders, a brass-framed tabletop clock, and an open laptop docking station on top; a low teak credenza runs behind the desk holding a record player, a row of vinyl records, a vintage radio, and a small potted plant.',
        'studyroom/prompt24': 'This industrial-style study room centers around a long, reclaimed wood desk with black metal legs placed along the back wall, holding a dual-monitor setup, a slim matte-black desk lamp on the left, and a small concrete pen holder on the right. A low-backed, dark brown leather swivel chair with a black metal base is positioned at the desk.'
    }
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
