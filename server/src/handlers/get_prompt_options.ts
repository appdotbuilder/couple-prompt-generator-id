
import { type PromptOptions } from '../schema';

export async function getPromptOptions(): Promise<PromptOptions> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is providing all available options for each dropdown/selection field.
    // This enables the frontend to populate selection lists dynamically and consistently.
    return Promise.resolve({
        themes: [
            'traditional_indonesian',
            'modern_casual',
            'formal_elegant',
            'bohemian',
            'minimalist',
            'vintage',
            'beach',
            'urban',
            'garden',
            'cultural_fusion'
        ],
        visualStyles: [
            'cinematic',
            'portrait',
            'lifestyle',
            'documentary',
            'artistic',
            'candid',
            'fashion',
            'dreamy',
            'dramatic',
            'natural'
        ],
        studioBackgrounds: [
            'white_seamless',
            'black_backdrop',
            'gray_gradient',
            'wooden_texture',
            'brick_wall',
            'fabric_drape',
            'nature_backdrop',
            'abstract_pattern',
            'solid_color',
            'textured_paper'
        ],
        lighting: [
            'natural_light',
            'studio_lighting',
            'golden_hour',
            'soft_diffused',
            'dramatic_contrast',
            'rim_lighting',
            'low_key',
            'high_key',
            'warm_tone',
            'cool_tone'
        ],
        cameraAngles: [
            'eye_level',
            'slightly_above',
            'slightly_below',
            'close_up',
            'medium_shot',
            'full_body',
            'three_quarter',
            'profile_view',
            'candid_angle',
            'artistic_perspective'
        ],
        couplePoses: [
            'standing_embrace',
            'sitting_together',
            'walking_hand_in_hand',
            'forehead_touch',
            'back_to_back',
            'piggyback',
            'dancing_pose',
            'looking_at_each_other',
            'laughing_together',
            'romantic_gaze'
        ]
    } as PromptOptions);
}
