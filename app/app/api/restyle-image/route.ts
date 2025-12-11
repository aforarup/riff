// ============================================
// API: /api/restyle-image
// Apply style transformations to existing images
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { IMAGE_STYLE_PRESETS, ImageStyleId } from '@/lib/types';
import crypto from 'crypto';

// Get restyle prompt for a given preset
function getRestylePrompt(styleId: ImageStyleId): string {
  const preset = IMAGE_STYLE_PRESETS.find((p) => p.id === styleId);

  if (!preset || styleId === 'none') {
    return 'Recreate this image in a clean, professional style suitable for presentations.';
  }

  // Extract style description from the prompt template
  // Remove the {description} placeholder and focus on the style instructions
  const styleInstructions = preset.promptTemplate
    .replace('{description}', 'the subject in this image')
    .replace(/^Create a |^Create an /i, 'Transform this image into a ');

  return styleInstructions;
}

// Extract image data from Gemini response
function extractImageFromResponse(data: any): string | null {
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (part: any) => part.inlineData?.mimeType?.startsWith('image/')
  );
  return imagePart?.inlineData?.data || null;
}

// Fetch image and convert to base64
async function fetchImageAsBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || 'image/png';
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  return {
    data: base64,
    mimeType: contentType,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, styleId, customPrompt, backgroundColor } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (!styleId && !customPrompt) {
      return NextResponse.json(
        { error: 'Either styleId or customPrompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Fetch the original image
    console.log('Fetching original image...');
    const { data: imageBase64, mimeType } = await fetchImageAsBase64(imageUrl);

    // Build the transformation prompt
    let transformPrompt: string;
    if (customPrompt) {
      transformPrompt = customPrompt;
    } else {
      transformPrompt = getRestylePrompt(styleId as ImageStyleId);
    }

    // Add background color instruction if provided
    if (backgroundColor) {
      transformPrompt = `IMPORTANT: The output image MUST have a solid ${backgroundColor} background. ${transformPrompt}`;
    }

    // Add instruction to maintain the subject
    transformPrompt = `${transformPrompt}\n\nIMPORTANT: Maintain the core subject and composition of the original image while applying the new style. The output should be recognizable as the same scene/subject.`;

    console.log('Restyling with prompt:', transformPrompt);

    // Try Gemini 3 first for best quality
    console.log('Attempting Gemini 3 image transformation...');
    const gemini3Response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: imageBase64,
                  },
                },
                {
                  text: transformPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['image'],
          },
        }),
      }
    );

    if (gemini3Response.ok) {
      const data = await gemini3Response.json();
      const newImageData = extractImageFromResponse(data);

      if (newImageData) {
        // Save to blob storage
        const hash = crypto.randomBytes(8).toString('hex');
        const filename = `restyled/${hash}.png`;
        const imageBuffer = Buffer.from(newImageData, 'base64');

        const blob = await put(filename, imageBuffer, {
          access: 'public',
          contentType: 'image/png',
        });

        return NextResponse.json({
          url: blob.url,
          originalUrl: imageUrl,
          styleId: styleId || 'custom',
          customPrompt: customPrompt || null,
          model: 'gemini-3-pro-image-preview',
        });
      }
    }

    // Fallback to Gemini 2.0 Flash
    console.log('Gemini 3 failed, trying Gemini 2.0 Flash...');
    const gemini2Response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: imageBase64,
                  },
                },
                {
                  text: transformPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['image', 'text'],
          },
        }),
      }
    );

    if (gemini2Response.ok) {
      const data = await gemini2Response.json();
      const newImageData = extractImageFromResponse(data);

      if (newImageData) {
        const hash = crypto.randomBytes(8).toString('hex');
        const filename = `restyled/${hash}.png`;
        const imageBuffer = Buffer.from(newImageData, 'base64');

        const blob = await put(filename, imageBuffer, {
          access: 'public',
          contentType: 'image/png',
        });

        return NextResponse.json({
          url: blob.url,
          originalUrl: imageUrl,
          styleId: styleId || 'custom',
          customPrompt: customPrompt || null,
          model: 'gemini-2.0-flash-exp',
        });
      }
    }

    // All models failed
    const errorText = await gemini2Response.text();
    console.error('All image transformation models failed. Last error:', errorText);

    return NextResponse.json(
      { error: 'Failed to restyle image. All models failed.', details: errorText },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error restyling image:', error);
    return NextResponse.json(
      { error: 'Failed to restyle image', details: String(error) },
      { status: 500 }
    );
  }
}
