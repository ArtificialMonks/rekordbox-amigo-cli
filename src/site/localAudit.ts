import { XMLParser } from "fast-xml-parser";
import type { LibraryAudit, RekordboxTrack, TrackFinding, TrackIssue } from "../types";

type XmlRecord = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  allowBooleanAttributes: true
});

const ISSUE_ORDER: TrackIssue[] = [
  "duplicate_location",
  "possible_duplicate",
  "missing_genre",
  "missing_label",
  "missing_comments",
  "missing_key",
  "missing_bpm",
  "missing_year",
  "missing_rating",
  "missing_colour",
  "missing_file"
];

export function auditRekordboxXmlInBrowser(xml: string, sourceName: string): LibraryAudit {
  const parsed = parser.parse(xml) as XmlRecord;
  const root = asRecord(parsed.DJ_PLAYLISTS);
  const product = asRecord(root.PRODUCT);
  const collection = asRecord(root.COLLECTION);
  const tracks = toArray(collection.TRACK).map((track) => mapTrack(asRecord(track)));
  const locationCounts = countBy(tracks, (track) => track.location.toLowerCase());
  const identityCounts = countBy(tracks, (track) => `${track.artist}::${track.name}`.toLowerCase());
  const findings = tracks.map((track) => buildFinding(track, locationCounts, identityCounts)).filter((finding) => finding.issues.length > 0);
  const issueCounts = Object.fromEntries(ISSUE_ORDER.map((issue) => [issue, 0])) as Record<TrackIssue, number>;

  for (const finding of findings) {
    for (const issue of finding.issues) {
      issueCounts[issue] += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    sourceXml: sourceName,
    product: {
      name: stringValue(product.Name),
      version: stringValue(product.Version),
      company: stringValue(product.Company)
    },
    summary: {
      totalTracks: tracks.length,
      totalPlaylists: countPlaylistNodes(asRecord(root.PLAYLISTS)),
      missingFiles: 0,
      duplicateLocations: issueCounts.duplicate_location,
      possibleDuplicates: issueCounts.possible_duplicate,
      weakMetadataTracks: findings.filter((finding) => finding.issues.some((issue) => issue.startsWith("missing_"))).length,
      issueCounts
    },
    findings,
    playlists: []
  };
}

function buildFinding(
  track: RekordboxTrack,
  locationCounts: Map<string, number>,
  identityCounts: Map<string, number>
): TrackFinding {
  const issues: TrackIssue[] = [];

  if (locationCounts.get(track.location.toLowerCase())! > 1) issues.push("duplicate_location");
  if (identityCounts.get(`${track.artist}::${track.name}`.toLowerCase())! > 1) issues.push("possible_duplicate");
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
    suggestions: buildSuggestions(track, issues)
  };
}

function buildSuggestions(track: RekordboxTrack, issues: TrackIssue[]): string[] {
  const suggestions: string[] = [];
  const bpm = track.averageBpm ?? 0;
  const role = bpm >= 130 ? "Peak" : bpm >= 124 ? "Build" : bpm >= 116 ? "Warm-up" : bpm > 0 ? "Arrival" : "Review";

  if (issues.includes("missing_genre")) suggestions.push("Add a genre/subgenre after listening, not from filename alone.");
  if (issues.includes("missing_label")) suggestions.push("Add label/source so crates can be searched by origin.");
  if (issues.includes("missing_comments")) suggestions.push(`Start comments with #${role.toLowerCase()} #review plus one mood word.`);
  if (issues.includes("missing_colour")) suggestions.push(`Use color as set role. Starter role: ${role}.`);
  if (issues.includes("missing_rating")) suggestions.push("Rate by trust: 1=research, 3=usable, 5=signature.");
  if (issues.includes("possible_duplicate")) suggestions.push("Compare versions before deleting. Edits, remasters, and radio versions may all matter.");

  return suggestions;
}

function mapTrack(track: XmlRecord): RekordboxTrack {
  return {
    trackId: stringValue(track.TrackID) ?? "unknown",
    name: stringValue(track.Name) ?? "Untitled",
    artist: stringValue(track.Artist) ?? "Unknown Artist",
    album: stringValue(track.Album),
    genre: stringValue(track.Genre),
    kind: stringValue(track.Kind),
    size: numberValue(track.Size),
    totalTime: numberValue(track.TotalTime),
    year: stringValue(track.Year),
    averageBpm: numberValue(track.AverageBpm),
    dateAdded: stringValue(track.DateAdded),
    bitRate: numberValue(track.BitRate),
    sampleRate: numberValue(track.SampleRate),
    comments: stringValue(track.Comments),
    playCount: numberValue(track.PlayCount),
    rating: numberValue(track.Rating),
    location: stringValue(track.Location) ?? "",
    tonality: stringValue(track.Tonality),
    label: stringValue(track.Label),
    remixer: stringValue(track.Remixer),
    colour: stringValue(track.Colour)
  };
}

function countPlaylistNodes(record: XmlRecord): number {
  return toArray(record.NODE).reduce<number>((count, node) => count + countPlaylistNodes(asRecord(node)) + 1, 0);
}

function asRecord(value: unknown): XmlRecord {
  return typeof value === "object" && value !== null ? value as XmlRecord : {};
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function stringValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function numberValue(value: unknown): number | undefined {
  const valueAsString = stringValue(value);
  if (!valueAsString) return undefined;
  const parsed = Number(valueAsString);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function countBy<T>(items: T[], getter: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getter(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
