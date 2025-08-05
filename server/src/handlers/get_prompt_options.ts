
import { type PromptOptions } from '../schema';

export const getPromptOptions = async (): Promise<PromptOptions> => {
  // This handler provides all available options for each dropdown/selection field.
  // This enables the frontend to populate selection lists dynamically and consistently.
  return {
    themes: [
      "Formal",
      "Casual",
      "Vintage",
      "Fantasy",
      "Traditional Javanese",
      "Traditional Balinese"
    ],
    visualStyles: [
      "Realistic Photography",
      "Cinematic",
      "Black and White",
      "Oil Painting",
      "Anime Style"
    ],
    studioBackgrounds: [
      "Plain Grey Wall",
      "Classic Library Setting",
      "Industrial Loft Window",
      "Red Velvet Curtains",
      "Bookshelf Backdrop",
      "Floral Wall"
    ],
    lighting: [
      "Soft window light",
      "Elegant studio lighting",
      "Golden hour sunset glow",
      "Dramatic neon lights",
      "Dim ambient light"
    ],
    cameraAngles: [
      "Eye-level shot",
      "Full body shot",
      "Close-up",
      "Low angle shot",
      "High angle shot"
    ],
    couplePoses: [
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
    ],
    aspectRatios: {
      "Potret (2:3)": "--ar 2:3",
      "Potret (9:16)": "--ar 9:16",
      "Lanskap (3:2)": "--ar 3:2",
      "Persegi (1:1)": "--ar 1:1",
      "Layar Lebar (16:9)": "--ar 16:9"
    }
  };
};
