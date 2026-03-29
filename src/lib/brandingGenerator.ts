import { GoogleGenAI } from "@google/genai";

export async function generateBrandingImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    {
      name: "hero_title_16_9",
      text: "EVOLUAELA",
      aspectRatio: "16:9",
      prompt: "A high-resolution minimalist branding image with the text 'EVOLUAELA' in a massive, extremely bold, heavy sans-serif font (style of Poppins Black). The text is pure white on a solid black background. Tight kerning, modern and luxurious appearance. 16:9 aspect ratio."
    },
    {
      name: "hero_subtitle_16_9",
      text: "DESPERTE SUA MELHOR VERSÃO",
      aspectRatio: "16:9",
      prompt: "A high-resolution minimalist branding image with the text 'DESPERTE SUA MELHOR VERSÃO' in a massive, extremely bold, heavy sans-serif font (style of Poppins Black). The text is pure white on a solid black background. Tight kerning, modern and luxurious appearance. 16:9 aspect ratio."
    },
    {
      name: "cta_16_9",
      text: "COMECE AGORA - TRANSFORME SUA VIDA",
      aspectRatio: "16:9",
      prompt: "A high-resolution minimalist branding image with the text 'COMECE AGORA - TRANSFORME SUA VIDA' in a massive, extremely bold, heavy sans-serif font (style of Poppins Black). The text is pure white on a solid black background. Tight kerning, modern and luxurious appearance. 16:9 aspect ratio."
    },
    {
      name: "hero_title_9_16",
      text: "EVOLUAELA",
      aspectRatio: "9:16",
      prompt: "A high-resolution minimalist branding image with the text 'EVOLUAELA' in a massive, extremely bold, heavy sans-serif font (style of Poppins Black). The text is pure white on a solid black background. Tight kerning, modern and luxurious appearance. 9:16 aspect ratio."
    }
  ];

  const results: { name: string, url: string }[] = [];

  for (const p of prompts) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: p.prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: p.aspectRatio as any,
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          results.push({ name: p.name, url: imageUrl });
        }
      }
    } catch (error) {
      console.error(`Error generating ${p.name}:`, error);
    }
  }
  return results;
}
