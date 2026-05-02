# Chord Helper for FL Studio

A web app that helps producers quickly generate chord progressions for FL Studio's Piano Roll "Type in Progression" feature using AI.

## Features

- **Key & Scale Selection**: Choose any root note and scale/mode
- **Chord Count**: Select how many chords you want (2, 4, 6, 8, or 10)
- **Mood Presets**: Quick moods like Happy, Sad, Mysterious, or write your own
- **Genre/Vibe Input**: Describe the style with example suggestions
- **Multiple AI Models**: Choose from GPT-4o, GPT-4, GPT-3.5 Turbo
- **One-Click Copy**: Click any chord to copy, or copy the full progression
- **FL Studio Ready**: Output formatted for direct paste into FL Studio

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Select your **Key** (root note) and **Scale/Mode**
2. Choose how many **chords** you want in the progression
3. Pick a **mood** preset or type your own
4. Optionally add a **genre/vibe** description
5. Add any **additional notes** (optional)
6. Select your preferred **AI model**
7. Click **Generate Chords**
8. Click individual chords to copy, or copy the full progression
9. Paste directly into FL Studio's Piano Roll → Chord Progression Tool → "Type in progression" box

## FL Studio Compatibility

The generated progressions follow FL Studio's official "Type in Progression" format:
- Chord names separated by commas or spaces
- Standard notation (e.g., C, Am, F, G, Dm7, Cmaj7)
- Compatible with sharps (#) and flats (b)

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [OpenAI API](https://openai.com/)

## Color Palette

The app uses a custom dark palette inspired by FL Studio:
- Abyssal Stone: #0F151D
- Faded Denim: #A7B5C2
- Sky Veil: #CDD5DE
- Ghost Whisper: #E3E7EB
- Cloud Mist: #F0F2F5
