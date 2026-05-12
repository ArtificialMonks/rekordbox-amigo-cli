export type RekordboxTrack = {
  trackId: string;
  name: string;
  artist: string;
  album?: string;
  genre?: string;
  kind?: string;
  size?: number;
  totalTime?: number;
  year?: string;
  averageBpm?: number;
  dateAdded?: string;
  bitRate?: number;
  sampleRate?: number;
  comments?: string;
  playCount?: number;
  rating?: number;
  location: string;
  tonality?: string;
  label?: string;
  remixer?: string;
  colour?: string;
};

export type RekordboxPlaylist = {
  name: string;
  trackIds: string[];
  children: RekordboxPlaylist[];
};

export type RekordboxLibrary = {
  product?: {
    name?: string;
    version?: string;
    company?: string;
  };
  tracks: RekordboxTrack[];
  playlists: RekordboxPlaylist[];
};

export type TrackIssue =
  | "missing_file"
  | "duplicate_location"
  | "possible_duplicate"
  | "missing_genre"
  | "missing_label"
  | "missing_comments"
  | "missing_key"
  | "missing_bpm"
  | "missing_year"
  | "missing_rating"
  | "missing_colour";

export type TrackFinding = {
  trackId: string;
  name: string;
  artist: string;
  location: string;
  issues: TrackIssue[];
  suggestions: string[];
};

export type AuditSummary = {
  totalTracks: number;
  totalPlaylists: number;
  missingFiles: number;
  duplicateLocations: number;
  possibleDuplicates: number;
  weakMetadataTracks: number;
  issueCounts: Record<TrackIssue, number>;
};

export type LibraryAudit = {
  generatedAt: string;
  sourceXml: string;
  product?: RekordboxLibrary["product"];
  summary: AuditSummary;
  findings: TrackFinding[];
  playlists: {
    name: string;
    trackCount: number;
    path: string;
  }[];
};
