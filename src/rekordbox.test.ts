import { describe, expect, it } from "vitest";
import { auditLibrary, decodeTrackLocation, inferMusicProfile } from "./audit";
import { parseRekordboxXml } from "./rekordbox";

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
});
