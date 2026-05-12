import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { auditLibrary, decodeTrackLocation, inferMusicProfile } from "./audit";
import { parseRekordboxXml } from "./rekordbox";
import { renderSetPlan } from "./setPlan";
import { auditRekordboxXmlInBrowser } from "./site/localAudit";

describe("rekordbox xml parsing", () => {
  it("parses tracks and playlists", async () => {
    const library = await parseRekordboxXml("test/fixtures/rekordbox.xml");
    const playlist = library.playlists[0].children[0];

    expect(library.tracks).toHaveLength(3);
    expect(library.playlists[0].name).toBe("ROOT");
    expect(playlist.name).toBe("Afterhours");
    expect(playlist.trackIds).toEqual(["1", "2"]);
  });

  it("audits weak metadata and likely duplicates", async () => {
    const library = await parseRekordboxXml("test/fixtures/rekordbox.xml");
    const audit = await auditLibrary(library, "test/fixtures/rekordbox.xml");

    expect(audit.summary.totalTracks).toBe(3);
    expect(audit.summary.possibleDuplicates).toBe(2);
    expect(audit.summary.issueCounts.missing_genre).toBe(1);
  });

  it("runs the browser-local audit without file existence checks", async () => {
    const xml = await readFile("test/fixtures/rekordbox.xml", "utf8");
    const audit = auditRekordboxXmlInBrowser(xml, "rekordbox.xml");

    expect(audit.summary.totalTracks).toBe(3);
    expect(audit.summary.missingFiles).toBe(0);
    expect(audit.summary.weakMetadataTracks).toBe(3);
  });
});

describe("local music intelligence helpers", () => {
  it("decodes file urls", () => {
    expect(decodeTrackLocation("file://localhost/tmp/test.mp3")).toContain("/tmp/test.mp3");
  });

  it("infers starter profile", () => {
    const profile = inferMusicProfile({
      trackId: "1",
      name: "Deep Acid Motion",
      artist: "Test Artist",
      genre: "",
      averageBpm: 126,
      location: "file://localhost/tmp/test.mp3"
    });

    expect(profile.genre).toBe("House / Groove");
    expect(profile.role).toBe("Build");
    expect(profile.commentTags).toContain("#acid");
  });

  it("renders set plans with vibe, curve, and anchor", () => {
    const plan = renderSetPlan({
      generatedAt: "2026-05-12T00:00:00.000Z",
      sourceXml: "rekordbox.xml",
      summary: {
        totalTracks: 0,
        totalPlaylists: 0,
        missingFiles: 0,
        duplicateLocations: 0,
        possibleDuplicates: 0,
        weakMetadataTracks: 0,
        issueCounts: {
          missing_file: 0,
          duplicate_location: 0,
          possible_duplicate: 0,
          missing_genre: 0,
          missing_label: 0,
          missing_comments: 0,
          missing_key: 0,
          missing_bpm: 0,
          missing_year: 0,
          missing_rating: 0,
          missing_colour: 0
        }
      },
      findings: [],
      playlists: []
    }, {
      hours: 3,
      context: "afterhours",
      vibe: "hypnotic",
      curve: "wave",
      anchor: "Deep Acid Motion",
      bridge: "deep house to organic",
      avoid: "anything played in last 30 days"
    });

    expect(plan).toContain("Vibe: hypnotic");
    expect(plan).toContain("Anchor track: Deep Acid Motion");
    expect(plan).toContain("Bridge goal: deep house to organic");
    expect(plan).toContain("Avoid: anything played in last 30 days");
  });
});
