// ============================================
// API: /api/generate-slide
// Generate custom HTML for a slide using LLM
// Uses Vercel AI Gateway for fast, unified access
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { generateText, createGateway } from 'ai';

const SLIDE_GENERATION_SYSTEM_PROMPT = `You are an expert presentation designer who creates stunning, memorable slide HTML. You generate self-contained HTML+CSS for presentation slides that are visually striking and professionally designed.

## Your Design Philosophy
- **Bold and Memorable**: Each slide should have a clear visual hierarchy and be instantly readable from a distance
- **Cinematic Quality**: Think Apple keynotes, TED talks, high-end conference presentations
- **Purposeful Animation**: Use CSS animations sparingly but effectively for emphasis
- **Dark Theme Default**: Rich dark backgrounds (#0a0a0f, #0d1117, #1a1a2e) with high-contrast text
- **Typography First**: Large, bold headlines. Generous whitespace. Clear hierarchy.

## Technical Requirements
1. Output ONLY the HTML - no markdown, no explanation, no code fences
2. Use inline <style> tags for CSS (self-contained)
3. The slide must fill a 16:9 viewport (use 100vw x 100vh)
4. Use modern CSS: flexbox, grid, clamp(), CSS variables
5. Include @import for Google Fonts if using custom fonts
6. For **pause** markers: wrap elements in <div class="reveal reveal-N"> where N is the reveal order (0 = immediate, 1 = first pause, etc.)

## Visual Techniques to Use
- Gradient backgrounds (subtle, not overwhelming)
- Text shadows for glow effects on accent text
- Backdrop blur for layered elements
- CSS animations: fadeIn, slideUp, scale, glow pulses
- Geometric shapes as decorative elements
- Strategic use of accent colors (cyan #00d4aa, magenta #ff006e, amber #ffbe0b)

## Element Styling Guide
- **Titles (# H1)**: 6-10vw font-size, bold/black weight, slight letter-spacing
- **Subtitles (## H2)**: 4-6vw font-size, medium weight
- **Body text (### H3)**: 2-4vw font-size, regular weight, muted color
- **Highlighted \`text\`**: Accent color with subtle glow or background
- **Images [image: desc]**: Create a styled placeholder with the description, aspect-ratio 16:9
- **Speaker notes (>)**: IGNORE these - they are not shown on slides

## Animation Classes to Include
\`\`\`css
.reveal { opacity: 0; transform: translateY(20px); }
.reveal.visible { opacity: 1; transform: translateY(0); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.reveal-0 { opacity: 1; transform: none; } /* Immediate */
.reveal-1, .reveal-2, .reveal-3 { /* Controlled by JS */ }
\`\`\`

## Example Output Structure
\`\`\`html
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

  .slide {
    width: 100vw; height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
    font-family: 'Inter', system-ui, sans-serif;
    color: #f0f0f5;
    padding: 5vw;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }
  /* ... more styles ... */
</style>

<div class="slide">
  <h1 class="reveal reveal-0">Your Title Here</h1>
  <p class="reveal reveal-1">Content after first pause</p>
</div>
\`\`\`

Remember: You are creating art. Each slide should be worthy of a premium tech keynote. Be creative, be bold, be memorable.`;

// Create Vercel AI Gateway client
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { slideContent, themePrompt, slideIndex, deckId } = await request.json();

    if (!slideContent || typeof slideContent !== 'string') {
      return NextResponse.json(
        { error: 'Slide content is required' },
        { status: 400 }
      );
    }

    // Build the user prompt
    let userPrompt = `Create a stunning HTML slide for the following content:\n\n${slideContent}`;

    if (themePrompt) {
      userPrompt += `\n\n## Theme Direction\n${themePrompt}`;
    }

    userPrompt += `\n\nGenerate the complete HTML now:`;

    // Use model from env - format: provider/model-name
    const modelId = process.env.AI_GATEWAY_MODEL || 'moonshotai/kimi-k2-0905';

    const { text: html } = await generateText({
      model: gateway(modelId),
      system: SLIDE_GENERATION_SYSTEM_PROMPT,
      prompt: userPrompt,
      maxOutputTokens: 4096,
    });

    // Clean up - remove any markdown code fences if present
    let cleanedHtml = html
      .replace(/^```html?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Ensure it starts with a style or div tag
    if (!cleanedHtml.startsWith('<')) {
      // Try to extract HTML from the response
      const htmlMatch = cleanedHtml.match(/<style[\s\S]*<\/div>/i);
      if (htmlMatch) {
        cleanedHtml = htmlMatch[0];
      }
    }

    return NextResponse.json({
      html: cleanedHtml,
      slideIndex,
      deckId,
    });
  } catch (error) {
    console.error('Error generating slide:', error);
    return NextResponse.json(
      { error: 'Failed to generate slide', details: String(error) },
      { status: 500 }
    );
  }
}
