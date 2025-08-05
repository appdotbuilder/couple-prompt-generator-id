
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { StubNotice } from '@/components/StubNotice';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { 
  PromptOptions, 
  GeneratePromptInput, 
  CreatePromptTemplateInput, 
  PromptTemplate,
  GeneratedPrompt,
  RandomizePromptInput
} from '../../server/src/schema';

// STUB DATA - Used when backend is not available
const STUB_OPTIONS: PromptOptions = {
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

function App() {
  // State for form data
  const [formData, setFormData] = useState<GeneratePromptInput>({
    theme: "Formal" as const,
    visual_style: "Realistic Photography" as const,
    studio_background: "Plain Grey Wall" as const,
    lighting: "Soft window light" as const,
    camera_angle: "Eye-level shot" as const,
    couple_pose: "Standing parallel, facing camera, soft expression" as const,
    mens_top: '',
    mens_bottom: '',
    womens_clothing: '',
    hijab_style: null,
    accessories: null,
    aspect_ratio: '--ar 2:3'
  });

  // State for template creation
  const [templateData, setTemplateData] = useState<CreatePromptTemplateInput>({
    name: '',
    description: null,
    theme: "Formal" as const,
    visual_style: "Realistic Photography" as const,
    studio_background: "Plain Grey Wall" as const,
    lighting: "Soft window light" as const,
    camera_angle: "Eye-level shot" as const,
    couple_pose: "Standing parallel, facing camera, soft expression" as const,
    mens_top: '',
    mens_bottom: '',
    womens_clothing: '',
    hijab_style: null,
    accessories: null,
    aspect_ratio: '--ar 2:3',
    is_preset: false
  });

  // State for app data
  const [options, setOptions] = useState<PromptOptions | null>(null);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [generatedPromptText, setGeneratedPromptText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [usingStubData, setUsingStubData] = useState(false);

  // Generate stub prompt text
  const generateStubPrompt = (data: GeneratePromptInput): string => {
    return `Professional couple photoshoot in ${data.theme.toLowerCase()} style. ${data.visual_style} photography featuring ${data.couple_pose.toLowerCase()}. Studio setting: ${data.studio_background.toLowerCase()} with ${data.lighting.toLowerCase()}. ${data.camera_angle}. Man wearing: ${data.mens_top}, ${data.mens_bottom}. Woman wearing: ${data.womens_clothing}${data.hijab_style ? `, ${data.hijab_style}` : ''}${data.accessories ? `. Accessories: ${data.accessories}` : ''}. High quality, professional photography, detailed, sharp focus ${data.aspect_ratio}`;
  };

  // Generate random values for stub randomization
  const getRandomFromArray = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Load options, templates, and generated prompts
  const loadData = useCallback(async () => {
    try {
      const [optionsResult, templatesResult, promptsResult] = await Promise.all([
        trpc.getPromptOptions.query(),
        trpc.getPromptTemplates.query(),
        trpc.getGeneratedPrompts.query()
      ]);
      
      setOptions(optionsResult);
      setTemplates(templatesResult);
      setGeneratedPrompts(promptsResult);
      setUsingStubData(false);
    } catch (error) {
      console.error('Failed to load data, using stub data:', error);
      // STUB: Use stub data when backend is not available
      setOptions(STUB_OPTIONS);
      setTemplates([
        {
          id: 1,
          name: "Formal Wedding Style",
          description: "Classic formal wedding photoshoot template",
          theme: "Formal" as const,
          visual_style: "Realistic Photography" as const,
          studio_background: "Red Velvet Curtains" as const,
          lighting: "Elegant studio lighting" as const,
          camera_angle: "Eye-level shot" as const,
          couple_pose: "Standing parallel, facing camera, soft expression" as const,
          mens_top: "Black formal tuxedo",
          mens_bottom: "Black dress pants",
          womens_clothing: "White elegant wedding dress",
          hijab_style: null,
          accessories: "Wedding rings, pearl necklace",
          aspect_ratio: "--ar 2:3",
          is_preset: true,
          created_at: new Date()
        }
      ]);
      setGeneratedPrompts([]);
      setUsingStubData(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle form submission for generating prompt
  const handleGeneratePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (usingStubData) {
        // STUB: Generate prompt locally when backend is not available
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        const stubPrompt = generateStubPrompt(formData);
        const newPrompt: GeneratedPrompt = {
          id: Date.now(),
          template_id: formData.template_id || null,
          theme: formData.theme,
          visual_style: formData.visual_style,
          studio_background: formData.studio_background,
          lighting: formData.lighting,
          camera_angle: formData.camera_angle,
          couple_pose: formData.couple_pose,
          mens_top: formData.mens_top,
          mens_bottom: formData.mens_bottom,
          womens_clothing: formData.womens_clothing,
          hijab_style: formData.hijab_style,
          accessories: formData.accessories,
          aspect_ratio: formData.aspect_ratio,
          generated_prompt: stubPrompt,
          created_at: new Date()
        };
        setGeneratedPromptText(stubPrompt);
        setGeneratedPrompts((prev: GeneratedPrompt[]) => [newPrompt, ...prev]);
      } else {
        const result = await trpc.generatePrompt.mutate(formData);
        setGeneratedPromptText(result.generated_prompt);
        setGeneratedPrompts((prev: GeneratedPrompt[]) => [result, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template creation
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (usingStubData) {
        // STUB: Create template locally when backend is not available
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        const newTemplate: PromptTemplate = {
          id: Date.now(),
          name: templateData.name,
          description: templateData.description,
          theme: templateData.theme,
          visual_style: templateData.visual_style,
          studio_background: templateData.studio_background,
          lighting: templateData.lighting,
          camera_angle: templateData.camera_angle,
          couple_pose: templateData.couple_pose,
          mens_top: templateData.mens_top,
          mens_bottom: templateData.mens_bottom,
          womens_clothing: templateData.womens_clothing,
          hijab_style: templateData.hijab_style,
          accessories: templateData.accessories,
          aspect_ratio: templateData.aspect_ratio,
          is_preset: templateData.is_preset,
          created_at: new Date()
        };
        setTemplates((prev: PromptTemplate[]) => [newTemplate, ...prev]);
      } else {
        const result = await trpc.createPromptTemplate.mutate(templateData);
        setTemplates((prev: PromptTemplate[]) => [result, ...prev]);
      }
      
      // Reset template form
      setTemplateData({
        name: '',
        description: null,
        theme: "Formal" as const,
        visual_style: "Realistic Photography" as const,
        studio_background: "Plain Grey Wall" as const,
        lighting: "Soft window light" as const,
        camera_angle: "Eye-level shot" as const,
        couple_pose: "Standing parallel, facing camera, soft expression" as const,
        mens_top: '',
        mens_bottom: '',
        womens_clothing: '',
        hijab_style: null,
        accessories: null,
        aspect_ratio: '--ar 2:3',
        is_preset: false
      });
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle randomization
  const handleRandomize = async (preserveAttire: boolean = false, preserveHijab: boolean = false) => {
    setIsLoading(true);
    try {
      if (usingStubData) {
        // STUB: Randomize locally when backend is not available
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        const randomData: Partial<GeneratePromptInput> = {
          theme: getRandomFromArray(STUB_OPTIONS.themes),
          visual_style: getRandomFromArray(STUB_OPTIONS.visualStyles),
          studio_background: getRandomFromArray(STUB_OPTIONS.studioBackgrounds),
          lighting: getRandomFromArray(STUB_OPTIONS.lighting),
          camera_angle: getRandomFromArray(STUB_OPTIONS.cameraAngles),
          couple_pose: getRandomFromArray(STUB_OPTIONS.couplePoses),
          aspect_ratio: getRandomFromArray(Object.values(STUB_OPTIONS.aspectRatios))
        };

        if (!preserveAttire) {
          randomData.mens_top = getRandomFromArray(['Black formal suit', 'Navy blazer', 'White dress shirt', 'Casual polo shirt']);
          randomData.mens_bottom = getRandomFromArray(['Dark dress pants', 'Khaki chinos', 'Black jeans', 'Navy trousers']);
          randomData.womens_clothing = getRandomFromArray(['Elegant red dress', 'White blouse with skirt', 'Floral summer dress', 'Black cocktail dress']);
          randomData.accessories = getRandomFromArray(['Wedding rings', 'Pearl necklace', 'Watch and bracelet', null]);
        }

        if (!preserveHijab) {
          randomData.hijab_style = getRandomFromArray(['Simple white hijab', 'Colorful patterned hijab', 'Elegant silk hijab', null]);
        }

        setFormData((prev: GeneratePromptInput) => ({
          ...prev,
          ...randomData
        }));
      } else {
        const randomizeInput: RandomizePromptInput = {
          preserve_attire: preserveAttire,
          preserve_hijab: preserveHijab
        };
        const result = await trpc.randomizePrompt.mutate(randomizeInput);
        setFormData((prev: GeneratePromptInput) => ({
          ...prev,
          ...result
        }));
      }
    } catch (error) {
      console.error('Failed to randomize prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load template into form
  const loadTemplate = (template: PromptTemplate) => {
    setFormData({
      template_id: template.id,
      theme: template.theme,
      visual_style: template.visual_style,
      studio_background: template.studio_background,
      lighting: template.lighting,
      camera_angle: template.camera_angle,
      couple_pose: template.couple_pose,
      mens_top: template.mens_top,
      mens_bottom: template.mens_bottom,
      womens_clothing: template.womens_clothing,
      hijab_style: template.hijab_style,
      accessories: template.accessories,
      aspect_ratio: template.aspect_ratio
    });
  };

  if (!options) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading... ✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            📸 AI Couple Photo Prompt Generator
          </h1>
          <p className="text-gray-600">Create perfect prompts for AI-generated couple photography</p>
        </div>

        {usingStubData && <StubNotice />}

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generate Prompt</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="create-template">Create Template</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎨 Generate AI Photo Prompt
                </CardTitle>
                <CardDescription>
                  Configure all parameters to generate the perfect prompt for your couple photoshoot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGeneratePrompt} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="theme">🎭 Theme</Label>
                      <Select 
                        value={formData.theme || "Formal"} 
                        onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ 
                          ...prev, 
                          theme: value as GeneratePromptInput['theme']
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.themes.map((theme) => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Visual Style */}
                    <div className="space-y-2">
                      <Label htmlFor="visual_style">🖼️ Visual Style</Label>
                      <Select 
                        value={formData.visual_style || "Realistic Photography"} 
                        onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ 
                          ...prev, 
                          visual_style: value as GeneratePromptInput['visual_style']
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.visualStyles.map((style) => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Studio Background */}
                    <div className="space-y-2">
                      <Label htmlFor="studio_background">🏛️ Studio Background</Label>
                      <Select 
                        value={formData.studio_background || "Plain Grey Wall"} 
                        onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ 
                          ...prev, 
                          studio_background: value as GeneratePromptInput['studio_background']
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.studioBackgrounds.map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Lighting */}
                    <div className="space-y-2">
                      <Label htmlFor="lighting">💡 Lighting</Label>
                      <Select 
                        value={formData.lighting || "Soft window light"} 
                        onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ 
                          ...prev, 
                          lighting: value as GeneratePromptInput['lighting']
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.lighting.map((light) => (
                            <SelectItem key={light} value={light}>{light}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Camera Angle */}
                    <div className="space-y-2">
                      <Label htmlFor="camera_angle">📷 Camera Angle</Label>
                      <Select 
                        value={formData.camera_angle || "Eye-level shot"} 
                        onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ 
                          ...prev, 
                          camera_angle: value as GeneratePromptInput['camera_angle']
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.cameraAngles.map((angle) => (
                            <SelectItem key={angle} value={angle}>{angle}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Aspect Ratio */}
                    <div className="space-y-2">
                      <Label htmlFor="aspect_ratio">📐 Aspect Ratio</Label>
                      <Select 
                        value={formData.aspect_ratio || "--ar 2:3"} 
                        onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ ...prev, aspect_ratio: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(options.aspectRatios).map(([label, value]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Couple Pose - Full Width */}
                  <div className="space-y-2">
                    <Label htmlFor="couple_pose">💃 Couple Pose</Label>
                    <Select 
                      value={formData.couple_pose || "Standing parallel, facing camera, soft expression"} 
                      onValueChange={(value: string) => setFormData((prev: GeneratePromptInput) => ({ 
                        ...prev, 
                        couple_pose: value as GeneratePromptInput['couple_pose']
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options.couplePoses.map((pose) => (
                          <SelectItem key={pose} value={pose}>{pose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Clothing Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="mens_top">👔 Men's Top</Label>
                      <Input
                        value={formData.mens_top}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: GeneratePromptInput) => ({ ...prev, mens_top: e.target.value }))
                        }
                        placeholder="e.g., Black formal suit jacket"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mens_bottom">👖 Men's Bottom</Label>
                      <Input
                        value={formData.mens_bottom}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: GeneratePromptInput) => ({ ...prev, mens_bottom: e.target.value }))
                        }
                        placeholder="e.g., Dark dress pants"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="womens_clothing">👗 Women's Clothing</Label>
                      <Input
                        value={formData.womens_clothing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: GeneratePromptInput) => ({ ...prev, womens_clothing: e.target.value }))
                        }
                        placeholder="e.g., Elegant red evening dress"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hijab_style">🧕 Hijab Style (Optional)</Label>
                      <Input
                        value={formData.hijab_style || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: GeneratePromptInput) => ({ 
                            ...prev, 
                            hijab_style: e.target.value || null 
                          }))
                        }
                        placeholder="e.g., Simple white hijab"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="accessories">💍 Accessories (Optional)</Label>
                      <Input
                        value={formData.accessories || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: GeneratePromptInput) => ({ 
                            ...prev, 
                            accessories: e.target.value || null 
                          }))
                        }
                        placeholder="e.g., Wedding rings, pearl necklace, watch"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      {isLoading ? 'Generating...' : '✨ Generate Prompt'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleRandomize(false, false)}
                      disabled={isLoading}
                    >
                      🎲 Randomize All
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleRandomize(true, false)}
                      disabled={isLoading}
                    >
                      🎯 Keep Attire
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleRandomize(false, true)}
                      disabled={isLoading}
                    >
                      🧕 Keep Hijab
                    </Button>
                  </div>
                </form>

                {/* Generated Prompt Result */}
                {generatedPromptText && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-200">
                    <Label className="text-lg font-semibold text-purple-800 mb-2 block">
                      🎨 Generated Prompt:
                    </Label>
                    <Textarea
                      value={generatedPromptText}
                      readOnly
                      className="min-h-[100px] bg-white/50"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigator.clipboard.writeText(generatedPromptText)}
                    >
                      📋 Copy to Clipboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📋 Saved Templates</CardTitle>
                <CardDescription>Load previously saved template configurations</CardDescription>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No templates saved yet. Create one in the 'Create Template' tab!</p>
                ) : (
                  <div className="grid gap-4">
                    {templates.map((template: PromptTemplate) => (
                      <Card key={template.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{template.name}</h3>
                              {template.description && (
                                <p className="text-gray-600 text-sm">{template.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {template.is_preset && (
                                <Badge variant="secondary">System Preset</Badge>
                              )}
                              <Button 
                                size="sm" 
                                onClick={() => loadTemplate(template)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                Load Template
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <Badge variant="outline">{template.theme}</Badge>
                            <Badge variant="outline">{template.visual_style}</Badge>
                            <Badge variant="outline">{template.studio_background}</Badge>
                            <Badge variant="outline">{template.aspect_ratio}</Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {template.created_at.toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-template" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>💾 Create New Template</CardTitle>
                <CardDescription>Save current configuration as a reusable template</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTemplate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template_name">Template Name</Label>
                      <Input
                        value={templateData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTemplateData((prev: CreatePromptTemplateInput) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g., Formal Wedding Style"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="template_description">Description (Optional)</Label>
                      <Input
                        value={templateData.description || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTemplateData((prev: CreatePromptTemplateInput) => ({ 
                            ...prev, 
                            description: e.target.value || null 
                          }))
                        }
                        placeholder="Brief description of this template"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={templateData.is_preset}
                      onCheckedChange={(checked: boolean) =>
                        setTemplateData((prev: CreatePromptTemplateInput) => ({ ...prev, is_preset: checked }))
                      }
                    />
                    <Label>Mark as System Preset</Label>
                  </div>

                  {/* Copy current form data button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setTemplateData((prev: CreatePromptTemplateInput) => ({
                        ...prev,
                        theme: formData.theme,
                        visual_style: formData.visual_style,
                        studio_background: formData.studio_background,
                        lighting: formData.lighting,
                        camera_angle: formData.camera_angle,
                        couple_pose: formData.couple_pose,
                        mens_top: formData.mens_top,
                        mens_bottom: formData.mens_bottom,
                        womens_clothing: formData.womens_clothing,
                        hijab_style: formData.hijab_style,
                        accessories: formData.accessories,
                        aspect_ratio: formData.aspect_ratio
                      }));
                    }}
                  >
                    📋 Copy from Current Form
                  </Button>

                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {isLoading ? 'Creating...' : '💾 Create Template'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📜 Generated Prompt History</CardTitle>
                <CardDescription>View all your previously generated prompts</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPrompts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No prompts generated yet. Create your first prompt in the 'Generate Prompt' tab!</p>
                ) : (
                  <div className="space-y-4">
                    {generatedPrompts.map((prompt: GeneratedPrompt) => (
                      <Card key={prompt.id} className="border-l-4 border-l-pink-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{prompt.theme}</Badge>
                              <Badge variant="outline">{prompt.visual_style}</Badge>
                              <Badge variant="outline">{prompt.aspect_ratio}</Badge>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm font-mono">{prompt.generated_prompt}</p>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Generated: {prompt.created_at.toLocaleDateString()}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(prompt.generated_prompt)}
                              >
                                📋 Copy
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
