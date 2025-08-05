
import { type RandomizePromptInput, type GeneratePromptInput } from '../schema';

export async function randomizePrompt(input: RandomizePromptInput): Promise<GeneratePromptInput> {
    // Available options for randomization - exact strings from frontend
    const themes = [
        "Formal",
        "Casual", 
        "Vintage",
        "Fantasy",
        "Traditional Javanese",
        "Traditional Balinese"
    ] as const;
    
    const visualStyles = [
        "Realistic Photography",
        "Cinematic",
        "Black and White", 
        "Oil Painting",
        "Anime Style"
    ] as const;
    
    const studioBackgrounds = [
        "Plain Grey Wall",
        "Classic Library Setting",
        "Industrial Loft Window",
        "Red Velvet Curtains",
        "Bookshelf Backdrop",
        "Floral Wall"
    ] as const;
    
    const lighting = [
        "Soft window light",
        "Elegant studio lighting",
        "Golden hour sunset glow",
        "Dramatic neon lights",
        "Dim ambient light"
    ] as const;
    
    const cameraAngles = [
        "Eye-level shot",
        "Full body shot",
        "Close-up",
        "Low angle shot", 
        "High angle shot"
    ] as const;
    
    const couplePoses = [
        "Standing parallel, facing camera, soft expression",
        "Man standing behind, woman sitting elegantly on a chair",
        "Looking at each other with a slight smile",
        "Man holding the woman's hand from the side",
        "Sitting side-by-side, slightly angled towards each other",
        "Woman seated, man sitting on the armrest",
        "Posed as if walking slowly, man slightly ahead",
        "Man holding the woman's arm from behind",
        "Sitting facing each other, hands on a small table",
        "Formal standing pose, hands in front",
        "Seated facing each other, half-body shot",
        "Man leaning against a wall, woman in front",
        "Woman holding a bouquet, man standing beside her",
        "Sitting on the studio floor with a carpet",
        "Man slightly bowing to greet the woman"
    ] as const;
    
    const aspectRatios = [
        "--ar 2:3",
        "--ar 9:16", 
        "--ar 3:2",
        "--ar 1:1",
        "--ar 16:9"
    ] as const;
    
    // Random mens clothing options
    const mensTopOptions = [
        "White formal dress shirt",
        "Black turtleneck sweater",
        "Navy blue blazer",
        "Casual white polo shirt",
        "Traditional batik shirt",
        "Light blue oxford shirt"
    ];
    
    const mensBottomOptions = [
        "Dark navy formal trousers",
        "Black dress pants", 
        "Khaki chinos",
        "Dark blue jeans",
        "Traditional sarong",
        "Grey formal slacks"
    ];
    
    // Random womens clothing options
    const womensClothingOptions = [
        "Elegant long-sleeve dress in navy blue",
        "White blouse with black pencil skirt",
        "Floral midi dress",
        "Traditional kebaya with batik skirt",
        "Vintage-style A-line dress",
        "Professional blazer with matching pants"
    ];
    
    // Random hijab styles (when not preserved)
    const hijabStyleOptions = [
        "Simple draped hijab in neutral color",
        "Elegant wrapped hijab with subtle patterns",
        "Traditional Indonesian jilbab style",
        "Modern layered hijab in pastel tones",
        null // Sometimes no hijab
    ];
    
    // Random accessories
    const accessoryOptions = [
        "Simple pearl earrings",
        "Traditional gold jewelry",
        "Minimalist watch and bracelet",
        "Vintage brooch on lapel",
        "Small flower corsage",
        null // Sometimes no accessories
    ];
    
    // Random selection helper
    const randomChoice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
    
    return {
        theme: randomChoice(themes),
        visual_style: randomChoice(visualStyles),
        studio_background: randomChoice(studioBackgrounds),
        lighting: randomChoice(lighting),
        camera_angle: randomChoice(cameraAngles),
        couple_pose: randomChoice(couplePoses),
        mens_top: input.preserve_attire ? "Preserved current attire" : randomChoice(mensTopOptions),
        mens_bottom: input.preserve_attire ? "Preserved current attire" : randomChoice(mensBottomOptions),
        womens_clothing: input.preserve_attire ? "Preserved current attire" : randomChoice(womensClothingOptions),
        hijab_style: input.preserve_hijab ? "Preserved current hijab style" : randomChoice(hijabStyleOptions),
        accessories: randomChoice(accessoryOptions),
        aspect_ratio: randomChoice(aspectRatios)
    };
}
