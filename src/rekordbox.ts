import { readFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import type { RekordboxLibrary, RekordboxPlaylist, RekordboxTrack } from "./types";

type XmlRecord = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  allowBooleanAttributes: true
});

export async function parseRekordboxXml(xmlPath: string): Promise<RekordboxLibrary> {
  const xml = await readFile(xmlPath, "utf8");
  const parsed = parser.parse(xml) as XmlRecord;
  const root = asRecord(parsed.DJ_PLAYLISTS);
  const product = asRecord(root.PRODUCT);
  const collection = asRecord(root.COLLECTION);
  const rawTracks = toArray(collection.TRACK).map(asRecord);
  const playlistsRoot = asRecord(root.PLAYLISTS);

  return {
    product: {
      name: stringValue(product.Name),
      version: stringValue(product.Version),
      company: stringValue(product.Company)
    },
    tracks: rawTracks.map(mapTrack),
    playlists: toArray(playlistsRoot.NODE).map((node) => mapPlaylist(asRecord(node)))
  };
}

function mapTrack(track: XmlRecord): RekordboxTrack {
  return {
    trackId: requiredString(track.TrackID, "TrackID"),
    name: stringValue(track.Name) || "Untitled",
    artist: stringValue(track.Artist) || "Unknown Artist",
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
    location: requiredString(track.Location, "Location"),
    tonality: stringValue(track.Tonality),
    label: stringValue(track.Label),
    remixer: stringValue(track.Remixer),
    colour: stringValue(track.Colour)
  };
}

function mapPlaylist(node: XmlRecord): RekordboxPlaylist {
  const tracks = toArray(node.TRACK).map((track) => {
    const record = asRecord(track);
    return requiredString(record.Key, "playlist TRACK Key");
  });

  return {
    name: stringValue(node.Name) || "Untitled Playlist",
    trackIds: tracks,
    children: toArray(node.NODE).map((child) => mapPlaylist(asRecord(child)))
  };
}

function asRecord(value: unknown): XmlRecord {
  if (typeof value === "object" && value !== null) {
    return value as XmlRecord;
  }
  return {};
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return [];
  }
  return [value];
}

function stringValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function requiredString(value: unknown, field: string): string {
  const text = stringValue(value);
  if (!text) {
    throw new Error(`Invalid Rekordbox XML: missing ${field}.`);
  }
  return text;
}

function numberValue(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
