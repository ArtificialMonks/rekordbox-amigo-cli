import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { table } from "table";
import type { LibraryAudit, TrackIssue } from "./types";

export type ReportFormat = "json" | "markdown";

export async function writeReport(audit: LibraryAudit, outPath: string, format: ReportFormat): Promise<void> {
  await mkdir(dirname(outPath), { recursive: true });
  const body = format === "json" ? JSON.stringify(audit, null, 2) : renderMarkdown(audit);
  await writeFile(outPath, body, "utf8");
}

export function renderConsoleSummary(audit: LibraryAudit): string {
  return table([
    ["Tracks", audit.summary.totalTracks],
    ["Playlists", audit.summary.totalPlaylists],
    ["Missing files", audit.summary.missingFiles],
    ["Duplicate locations", audit.summary.duplicateLocations],
    ["Possible duplicates", audit.summary.possibleDuplicates],
    ["Weak metadata tracks", audit.summary.weakMetadataTracks]
  ]);
}

export function renderMarkdown(audit: LibraryAudit): string {
  const issueRows = Object.entries(audit.summary.issueCounts)
    .filter(([, count]) => count > 0)
    .map(([issue, count]) => `| ${labelIssue(issue as TrackIssue)} | ${count} |`)
    .join("\n");

  const topFindings = audit.findings.slice(0, 40).map((finding) => {
    const issues = finding.issues.map(labelIssue).join(", ");
    const suggestions = finding.suggestions.map((suggestion) => `  - ${suggestion}`).join("\n");
    return `### ${finding.artist} - ${finding.name}\n\n- Issues: ${issues}\n- Location: \`${finding.location}\`\n\n${suggestions}`;
  }).join("\n\n");
  const nextAction = buildNextAction(audit);

  return `# Rekordbox Amigo Audit

Generated: ${audit.generatedAt}
Source XML: \`${audit.sourceXml}\`

## Summary

| Metric | Count |
|---|---:|
| Tracks | ${audit.summary.totalTracks} |
| Playlists | ${audit.summary.totalPlaylists} |
| Missing files | ${audit.summary.missingFiles} |
| Duplicate file locations | ${audit.summary.duplicateLocations} |
| Possible duplicate tracks | ${audit.summary.possibleDuplicates} |
| Tracks with weak metadata | ${audit.summary.weakMetadataTracks} |

## Issue Counts

| Issue | Count |
|---|---:|
${issueRows || "| No issues found | 0 |"}

## First Action List

${topFindings || "No findings. Your library export looks clean from the current rules."}

## Next Action

${nextAction}
`;
}

export function labelIssue(issue: TrackIssue): string {
  return issue.replaceAll("_", " ");
}

function buildNextAction(audit: LibraryAudit): string {
  if (audit.summary.missingFiles > 0) {
    return `Start by fixing missing files. Then rerun \`rb-amigo audit --xml ${audit.sourceXml} --format json --out ./reports/library-audit.json\`.`;
  }
  if (audit.summary.weakMetadataTracks > 0) {
    return `Create a review crate for the first ${Math.min(audit.summary.weakMetadataTracks, 25)} weak-metadata tracks, then run \`rb-amigo tags --audit ./reports/library-audit.json\`.`;
  }
  if (audit.summary.possibleDuplicates > 0) {
    return "Compare possible duplicates manually before deleting. Preserve edits, remasters, radio versions, and clean/dirty variants when they serve different set roles.";
  }
  return "Ask Amigo for a set plan: `rb-amigo set-plan --audit ./reports/library-audit.json --hours 3 --context afterhours --vibe hypnotic --curve wave`.";
}
