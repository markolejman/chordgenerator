"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

const SCALES = [
  { value: "major", label: "Major" },
  { value: "natural-minor", label: "Natural Minor" },
  { value: "harmonic-minor", label: "Harmonic Minor" },
  { value: "melodic-minor", label: "Melodic Minor" },
  { value: "dorian", label: "Dorian" },
  { value: "phrygian", label: "Phrygian" },
  { value: "lydian", label: "Lydian" },
  { value: "mixolydian", label: "Mixolydian" },
  { value: "locrian", label: "Locrian" },
  { value: "pentatonic-major", label: "Pentatonic Major" },
  { value: "pentatonic-minor", label: "Pentatonic Minor" },
  { value: "blues", label: "Blues" },
];

const COUNTS_1_TO_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PROGRESSION_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NOTES_PER_CHORD = [3, 4, 5, 6, 7, 8, 9];

const MOOD_PRESETS = [
  "Happy", "Mysterious", "Sad", "Angry", "Romantic", "Energetic", "Chill", "Dark"
];

const GENRE_EXAMPLES = [
  "Club", "House", "Trap", "Jazz", "Rock", "Summer", "Lofi", "Drill",
  "Hip-hop", "R&B", "Pop", "EDM", "Ambient", "Classical", "Funk", "Soul",
  "Disco", "Techno", "Dubstep", "Reggaeton", "Country", "Folk", "Metal",
  "Gospel", "Cinematic", "Orchestral", "Future Bass", "Synthwave", "Phonk"
];



interface Progression {
  chords: string[];
  progression: string;
  description: string;
}

export default function Home() {
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedScale, setSelectedScale] = useState("major");
  const [progressionCount, setProgressionCount] = useState(1);
  const [chordsPerProgression, setChordsPerProgression] = useState(4);
  const [notesPerChord, setNotesPerChord] = useState(3);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [customMood, setCustomMood] = useState("");
  const [genre, setGenre] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProgressions, setGeneratedProgressions] = useState<Progression[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  const getMood = () => customMood || selectedMood || "";

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: selectedKey,
          scale: selectedScale,
          progressionCount,
          chordsPerProgression,
          notesPerChord,
          mood: getMood(),
          genre,
          additionalNotes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate chords");
      }

      const data = await response.json();
      setGeneratedProgressions(data.progressions);
      setAnimationKey(prev => prev + 1);
      toast.success(`${data.progressions.length} progression${data.progressions.length > 1 ? 's' : ''} generated!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate chords");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAll = () => {
    setSelectedKey("C");
    setSelectedScale("major");
    setProgressionCount(1);
    setChordsPerProgression(4);
    setNotesPerChord(3);
    setSelectedMood(null);
    setCustomMood("");
    setGenre("");
    setAdditionalNotes("");
    setGeneratedProgressions([]);
    toast.success("All fields cleared");
  };

  const copyChord = (chord: string) => {
    navigator.clipboard.writeText(chord);
    toast.success(`Copied "${chord}" to clipboard`);
  };

  const copyProgression = (progression: string) => {
    navigator.clipboard.writeText(progression);
    toast.success("Copied progression to clipboard");
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Chord Helper for FL Studio
          </h1>
          <p className="text-muted-foreground">
            Generate chord progressions for FL Studio&apos;s &quot;Type in Progression&quot; tool
          </p>
        </header>

        {/* Step 1: Key & Scale */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </span>
              Key & Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key" className="text-muted-foreground">Root Note</Label>
                <Select value={selectedKey} onValueChange={(val) => val && setSelectedKey(val)}>
                  <SelectTrigger id="key" className="bg-card border-border">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    {KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scale" className="text-muted-foreground">Scale / Mode</Label>
                <Select value={selectedScale} onValueChange={(val) => val && setSelectedScale(val)}>
                  <SelectTrigger id="scale" className="bg-card border-border">
                    <SelectValue placeholder="Select scale" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALES.map((scale) => (
                      <SelectItem key={scale.value} value={scale.value}>
                        {scale.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Progression Settings */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </span>
              Progression Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-muted-foreground">
                Number of Progressions
                <span className="text-xs ml-2 text-muted-foreground/70">(how many different options to generate)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {PROGRESSION_COUNTS.map((count) => (
                  <Button
                    key={`prog-${count}`}
                    variant={progressionCount === count ? "default" : "secondary"}
                    size="sm"
                    className={`min-w-10 ${
                      progressionCount === count
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                    onClick={() => setProgressionCount(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-muted-foreground">
                Chords per Progression
                <span className="text-xs ml-2 text-muted-foreground/70">(length of each progression)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {COUNTS_1_TO_10.map((count) => (
                  <Button
                    key={`chords-${count}`}
                    variant={chordsPerProgression === count ? "default" : "secondary"}
                    size="sm"
                    className={`min-w-10 ${
                      chordsPerProgression === count
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                    onClick={() => setChordsPerProgression(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-muted-foreground">
                Notes per Chord
                <span className="text-xs ml-2 text-muted-foreground/70">(complexity of each chord)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {NOTES_PER_CHORD.map((count) => (
                  <Button
                    key={`notes-${count}`}
                    variant={notesPerChord === count ? "default" : "secondary"}
                    size="sm"
                    className={`min-w-10 ${
                      notesPerChord === count
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                    onClick={() => setNotesPerChord(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Mood */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </span>
              Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {MOOD_PRESETS.map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood && !customMood ? "default" : "secondary"}
                  className={`${
                    selectedMood === mood && !customMood
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setSelectedMood(mood);
                    setCustomMood("");
                  }}
                >
                  {mood}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customMood" className="text-muted-foreground">
                Or describe your own mood
              </Label>
              <Input
                id="customMood"
                placeholder="e.g., nostalgic summer evening, tense thriller scene..."
                value={customMood}
                onChange={(e) => {
                  setCustomMood(e.target.value);
                  if (e.target.value) setSelectedMood(null);
                }}
                className="bg-card border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Genre / Vibe */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                4
              </span>
              Genre / Vibe / Type of Beat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="e.g., lofi hip-hop, dark trap, 80s synth..."
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-card border-border flex-1"
              />
              <Popover>
                <PopoverTrigger
                  render={<Button variant="secondary" size="sm" className="shrink-0" />}
                >
                  Ideas
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-popover border-border">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Genre Ideas</h4>
                    <p className="text-sm text-muted-foreground">Click any to use:</p>
                    <div className="flex flex-wrap gap-1">
                      {GENRE_EXAMPLES.map((example) => (
                        <Badge
                          key={example}
                          variant="secondary"
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => setGenre(example)}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Additional Notes */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                5
              </span>
              Anything Else
              <span className="text-sm font-normal text-muted-foreground">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., keep it simple, add more tension, reference artists like The Weeknd, four-on-the-floor rhythm..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="bg-card border-border min-h-20 resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button
            size="lg"
            className="px-10 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Chords"
            )}
          </Button>
          
          {generatedProgressions.length > 0 && (
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              Re-generate
            </Button>
          )}
          
          <Button
            size="lg"
            variant="secondary"
            className="px-8 py-6 text-lg font-semibold"
            onClick={handleClearAll}
            disabled={isGenerating}
          >
            Clear All
          </Button>
        </div>

        {/* Results */}
        {generatedProgressions.length > 0 && (
          <div key={animationKey} className="space-y-4">
            <h2 
              className="text-xl font-bold text-foreground text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              Your Chord Progressions
            </h2>
            {generatedProgressions.map((prog, progIndex) => (
              <Card 
                key={progIndex} 
                className="border-border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${progIndex * 150}ms` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center justify-between">
                    <span>
                      {generatedProgressions.length > 1 ? `Option ${progIndex + 1}` : "Your Progression"}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyProgression(prog.progression)}
                      className="text-sm"
                    >
                      Copy Progression
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {prog.chords.map((chord, index) => (
                      <button
                        key={index}
                        onClick={() => copyChord(chord)}
                        className="group flex flex-col items-center justify-center px-5 py-4 bg-secondary hover:bg-accent rounded-lg border border-border transition-all hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both min-w-24 min-h-16"
                        style={{ animationDelay: `${progIndex * 150 + index * 80 + 200}ms` }}
                      >
                        <span className="text-xl font-bold text-foreground">
                          {chord}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p 
                    className="text-center text-sm italic text-muted-foreground animate-in fade-in duration-300 fill-mode-both"
                    style={{ animationDelay: `${progIndex * 150 + prog.chords.length * 80 + 250}ms` }}
                  >
                    {prog.description}
                  </p>

                  <div 
                    className="pt-4 border-t border-border animate-in fade-in duration-500 fill-mode-both"
                    style={{ animationDelay: `${progIndex * 150 + prog.chords.length * 80 + 300}ms` }}
                  >
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        Ready to paste into FL Studio:
                      </Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-4 py-3 bg-secondary rounded-lg font-mono text-foreground border border-border">
                          {prog.progression}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <p 
              className="text-xs text-muted-foreground text-center animate-in fade-in duration-500 fill-mode-both"
              style={{ animationDelay: `${generatedProgressions.length * 150 + 500}ms` }}
            >
              Paste directly into FL Studio&apos;s Piano Roll → Chord Progression Tool → &quot;Type in progression&quot; box
            </p>
          </div>
        )}

        <footer className="text-center text-sm text-muted-foreground pt-8 pb-4">
          <p>
            Made for FL Studio producers. Progressions follow diatonic, tonic-anchored templates (functional harmony)—not random chord guesses.
          </p>
        </footer>
      </div>
    </main>
  );
}
