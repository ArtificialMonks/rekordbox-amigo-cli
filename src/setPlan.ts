import type { LibraryAudit } from "./types";

export type SetPlanOptions = {
  hours: number;
  context: string;
  vibe?: string;
  curve?: "low-to-high" | "wave" | "flat";
  anchor?: string;
};

export function renderSetPlan(audit: LibraryAudit, options: SetPlanOptions): string {
  const chapters = buildChapters(options);
  const usableFindings = audit.findings.filter((finding) => !finding.issues.includes("missing_file"));
  const blockers = audit.findings.filter((finding) => finding.issues.includes("missing_file")).length;
  const vibe = options.vibe ? `\nVibe: ${options.vibe}` : "";
  const anchor = options.anchor ? `\nAnchor track: ${options.anchor}` : "";

  return `# Amigo Set Plan

Context: ${options.context}
Length: ${options.hours} hours
Energy curve: ${options.curve ?? "wave"}${vibe}${anchor}

## Library Readiness

- Tracks needing attention before prep: ${audit.findings.length}
- Missing-file blockers: ${blockers}
- Usable tracks with metadata/tagging gaps: ${usableFindings.length}

## Chapter Shape

${chapters.map((chapter, index) => `${index + 1}. ${chapter}`).join("\n")}

## Prep Prompt

Ask Amigo:

> Build me a ${options.hours}-hour ${options.context} journey${options.vibe ? ` with a ${options.vibe} feeling` : ""}${options.anchor ? ` around "${options.anchor}"` : ""}. Use a ${options.curve ?? "wave"} energy curve, start from tracks with strong metadata, avoid missing-file blockers, and make a review crate for tracks needing genre, mood, or energy labels.
`;
}

function buildChapters(options: SetPlanOptions): string[] {
  if (options.curve === "flat") {
    return [
      "Hold: establish a stable lane and stay inside it",
      "Color: rotate mood, texture, and percussion without forcing lift",
      "Refresh: add one contrast record when the room needs oxygen",
      "Exit: finish with continuity instead of spectacle"
    ];
  }

  if (options.curve === "low-to-high") {
    return [
      "Open: low-pressure records that define the palette",
      "Build: increase tempo, density, and confidence gradually",
      "Peak: a short trusted run of high-impact records",
      "Resolve: land with one memorable closing statement"
    ];
  }

  if (options.context.toLowerCase().includes("after")) {
    return [
      "Arrival: loose, hypnotic, lower-pressure records",
      "Lock-in: groove continuity, fewer vocals, stable BPM",
      "Pressure: deeper tension, stranger textures, careful peaks",
      "Release: emotional final stretch without forcing the room"
    ];
  }

  if (options.hours >= 3) {
    return [
      "Open: establish trust and room temperature",
      "Build: connect grooves and increase motion",
      "Peak: short focused lift, not constant maximum energy",
      "Land: give the story a memorable exit"
    ];
  }

  return [
    "Open: define the sound quickly",
    "Move: maintain flow with reliable bridges",
    "Close: leave one clear memory"
  ];
}
