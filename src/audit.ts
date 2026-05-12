import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { LibraryAudit, RekordboxLibrary, RekordboxPlaylist, RekordboxTrack, TrackFinding, TrackIssue } from "./types";

const ISSUE_ORDER: TrackIssue[] = [
  "missing_file",
  "duplicate_location",
  "possible_duplicate",
  "missing_genre",
  "missing_label",
  "missing_comments",
  "missing_key",
  "missing_bpm",
  "missing_year",
  "missing_rating",
  "missing_colour"
];

export async function auditLibrary(library: RekordboxLibrary, sourceXml: string): Promise<LibraryAudit> {
  const locationCounts = countBy(library.tracks, (track) => normalizeLocation(track.location));
  const identityCounts = countBy(library.tracks, (track) => normalizeIdentity(track));

  const findings = await Promise.all(
    library.tracks.map(async (track) => {
      const issues: TrackIssue[] = [];

      if (!(await fileExists(track.location))) issues.push("missing_file");
      if (locationCounts.get(normalizeLocation(track.location))! > 1) issues.push("duplicate_location");
      if (identityCounts.get(normalizeIdentity(track))! > 1) issues.push("possible_duplicate");
      if (!track.genre) issues.push("missing_genre");
      if (!track.label) issues.push("missing_label");
      if (!track.comments) issues.push("missing_comments");
      if (!track.tonality) issues.push("missing_key");
      if (!track.averageBpm) issues.push("missing_bpm");
      if (!track.year) issues.push("missing_year");
      if (!track.rating) issues.push("missing_rating");
      if (!track.colour) issues.push("missing_colour");

      return {
        trackId: track.trackId,
        name: track.name,
        artist: track.artist,
        location: track.location,
        issues,
        suggestions: suggestionsFor(track, issues)
      } satisfies TrackFinding;
    })
  );

  const issueCounts = Object.fromEntries(ISSUE_ORDER.map((issue) => [issue, 0])) as Record<TrackIssue, number>;
  for (const finding of findings) {
    for (const issue of finding.issues) {
      issueCounts[issue] += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    sourceXml,
    product: library.product,
    summary: {
      totalTracks: library.tracks.length,
      totalPlaylists: flattenPlaylists(library.playlists).length,
      missingFiles: issueCounts.missing_file,
      duplicateLocations: issueCounts.duplicate_location,
      possibleDuplicates: issueCounts.possible_duplicate,
      weakMetadataTracks: findings.filter((finding) => finding.issues.some((issue) => issue.startsWith("missing_"))).length,
      issueCounts
    },
    findings: findings.filter((finding) => finding.issues.length > 0),
    playlists: flattenPlaylists(library.playlists).map(({ playlist, path }) => ({
      name: playlist.name,
      trackCount: playlist.trackIds.length,
      path
    }))
  };
}

function suggestionsFor(track: RekordboxTrack, issues: TrackIssue[]): string[] {
  const suggestions: string[] = [];
  const profile = inferMusicProfile(track);

  if (issues.includes("missing_genre")) {
    suggestions.push(`Review genre. Starter guess: ${profile.genre}.`);
  }
  if (issues.includes("missing_label")) {
    suggestions.push("Add label/source. This helps label owners and collectors search by origin.");
  }
  if (issues.includes("missing_comments")) {
    suggestions.push(`Add comment tags like ${profile.commentTags.join(", ")}.`);
  }
  if (issues.includes("missing_colour")) {
    suggestions.push(`Assign a color for set role. Starter role: ${profile.role}.`);
  }
  if (issues.includes("missing_rating")) {
    suggestions.push("Rate the track by trust level: 1=research, 3=usable, 5=signature weapon.");
  }
  if (issues.includes("missing_file")) {
    suggestions.push("Relocate or remove this reference before USB/export preparation.");
  }
  if (issues.includes("possible_duplicate")) {
    suggestions.push("Compare versions before deleting. Keep radio, extended, remaster, and edit variants if useful.");
  }

  return suggestions;
}

export function inferMusicProfile(track: RekordboxTrack): { genre: string; role: string; commentTags: string[] } {
  const text = `${track.name} ${track.artist} ${track.genre ?? ""} ${track.comments ?? ""}`.toLowerCase();
  const bpm = track.averageBpm ?? 0;

  const genre =
    text.includes("techno") ? "Techno" :
    text.includes("house") ? "House" :
    text.includes("disco") ? "Disco" :
    text.includes("ambient") ? "Ambient" :
    bpm >= 128 ? "Techno / Peak-time" :
    bpm >= 120 ? "House / Groove" :
    bpm > 0 ? "Downtempo / Warm-up" :
    "Needs listening pass";

  const role =
    bpm >= 130 ? "Peak" :
    bpm >= 124 ? "Build" :
    bpm >= 116 ? "Warm-up" :
    bpm > 0 ? "Arrival" :
    "Unknown";

  const mood =
    text.includes("dub") ? "dubby" :
    text.includes("acid") ? "acid" :
    text.includes("deep") ? "deep" :
    text.includes("soul") ? "soulful" :
    "needs-mood";

  return {
    genre,
    role,
    commentTags: [`#${role.toLowerCase()}`, `#${mood}`, "#review"]
  };
}

async function fileExists(location: string): Promise<boolean> {
  const path = decodeTrackLocation(location);
  if (!path) return false;

  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function decodeTrackLocation(location: string): string | undefined {
  try {
    if (location.startsWith("file://")) {
      return fileURLToPath(location);
    }
    return location;
  } catch {
    return undefined;
  }
}

function normalizeLocation(location: string): string {
  return location.trim().toLowerCase();
}

function normalizeIdentity(track: RekordboxTrack): string {
  return `${track.artist}::${track.name}`.toLowerCase().replace(/\s+/g, " ").trim();
}

function countBy<T>(items: T[], getter: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getter(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function flattenPlaylists(playlists: RekordboxPlaylist[], parent = ""): { playlist: RekordboxPlaylist; path: string }[] {
  return playlists.flatMap((playlist) => {
    const path = parent ? `${parent} / ${playlist.name}` : playlist.name;
    return [{ playlist, path }, ...flattenPlaylists(playlist.children, path)];
  });
}
