import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface GenerateRequest {
  key: string;
  scale: string;
  progressionCount: number;
  chordsPerProgression: number;
  mood: string;
  genre: string;
  additionalNotes: string;
  model: string;
}

interface Progression {
  chords: string[];
  progression: string;
  description: string;
}

const SCALE_DESCRIPTIONS: Record<string, string> = {
  "major": "Major scale (Ionian mode)",
  "natural-minor": "Natural Minor scale (Aeolian mode)",
  "harmonic-minor": "Harmonic Minor scale",
  "melodic-minor": "Melodic Minor scale",
  "dorian": "Dorian mode",
  "phrygian": "Phrygian mode",
  "lydian": "Lydian mode",
  "mixolydian": "Mixolydian mode",
  "locrian": "Locrian mode",
  "pentatonic-major": "Major Pentatonic scale",
  "pentatonic-minor": "Minor Pentatonic scale",
  "blues": "Blues scale",
};

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient();

    const body: GenerateRequest = await request.json();
    const { key, scale, progressionCount, chordsPerProgression, mood, genre, additionalNotes, model } = body;

    const scaleDescription = SCALE_DESCRIPTIONS[scale] || scale;

    const systemPrompt = `You are a music theory expert specializing in chord progressions. Your task is to generate chord progressions that can be directly pasted into FL Studio's "Type in Progression" feature.

CRITICAL RULES FOR OUTPUT:
1. Output the chord names separated by commas, followed by a pipe (|) and a brief 2-5 word emotional/musical description of the overall progression
2. Use standard chord notation: C, Dm, Em, F, G, Am, Bdim for major scale, etc.
3. For extended chords, use: maj7, m7, 7, dim7, m7b5, sus2, sus4, add9, etc.
4. Use capital letters for root notes: C, D, E, F, G, A, B
5. Use # for sharps (e.g., F#m, C#) and b for flats (e.g., Bb, Ebmaj7)
6. Do NOT use Roman numerals - use actual chord names
7. Ensure all chords fit within the specified key and scale
8. Do NOT include any numbering or labels like "1." or "Progression 1:"
9. Each progression should be DIFFERENT and UNIQUE from the others
10. Separate each progression with a newline

VALID OUTPUT FORMAT (for 3 progressions of 4 chords each):
C, Am, F, G | nostalgic and uplifting
Dm7, G7, Cmaj7, Am7 | smooth jazz sophistication
Em, Am, Dm, G | melancholic tension release

The description should capture the overall emotional character or vibe of the progression as a whole.`;

    const userPrompt = `Generate ${progressionCount} DIFFERENT chord progression${progressionCount > 1 ? 's' : ''} with the following specifications:

Key: ${key}
Scale: ${scaleDescription}
Chords per progression: ${chordsPerProgression}
${mood ? `Mood/Feel: ${mood}` : ""}
${genre ? `Genre/Style: ${genre}` : ""}
${additionalNotes ? `Additional notes: ${additionalNotes}` : ""}

Generate exactly ${progressionCount} unique progression${progressionCount > 1 ? 's' : ''}, each with exactly ${chordsPerProgression} chords.
${progressionCount > 1 ? 'Make each progression distinctly different from the others.' : ''}
Output each progression on its own line, chords separated by commas. No labels or numbering.`;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";

    const lines = responseText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && /^[A-G]/.test(line));

    const progressions: Progression[] = lines.map(line => {
      const cleanedLine = line
        .replace(/^\d+[\.\)]\s*/, '')
        .replace(/^(Progression|Option)\s*\d*:?\s*/i, '')
        .trim();
      
      const [chordPart, descriptionPart] = cleanedLine.split('|').map(s => s.trim());
      
      const chordNames = chordPart
        .split(/[,\s]+/)
        .map(chord => chord.trim())
        .filter(chord => chord.length > 0 && /^[A-G]/.test(chord));
      
      return {
        chords: chordNames,
        progression: chordNames.join(", "),
        description: descriptionPart || "unique harmonic journey",
      };
    }).filter(prog => prog.chords.length > 0);

    if (progressions.length === 0) {
      return NextResponse.json(
        { error: "Failed to parse chord progressions from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      progressions,
      raw: responseText,
    });
  } catch (error) {
    console.error("Error generating chords:", error);
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate chord progressions" },
      { status: 500 }
    );
  }
}
