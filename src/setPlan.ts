import type { LibraryAudit } from "./types";

export function renderSetPlan(audit: LibraryAudit, hours: number, context: string): string {
  const chapters = buildChapters(hours, context);
  const usableFindings = audit.findings.filter((finding) => !finding.issues.includes("missing_file"));
  const blockers = audit.findings.filter((finding) => finding.issues.includes("missing_file")).length;

  return `# Amigo Set Plan

Context: ${context}
Length: ${hours} hours

## Library Readiness

- Tracks needing attention before prep: ${audit.findings.length}
- Missing-file blockers: ${blockers}
- Usable tracks with metadata/tagging gaps: ${usableFindings.length}

## Chapter Shape

${chapters.map((chapter, index) => `${index + 1}. ${chapter}`).join("\n")}

## Prep Prompt

Ask Amigo:

> Build me a ${hours}-hour ${context} journey. Start from tracks with strong metadata, avoid missing-file blockers, and make a review crate for tracks needing genre, mood, or energy labels.
`;
}

function buildChapters(hours: number, context: string): string[] {
  if (context.toLowerCase().includes("after")) {
    return [
      "Arrival: loose, hypnotic, lower-pressure records",
      "Lock-in: groove continuity, fewer vocals, stable BPM",
      "Pressure: deeper tension, stranger textures, careful peaks",
      "Release: emotional final stretch without forcing the room"
    ];
  }

  if (hours >= 3) {
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
