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
`;
}

export function labelIssue(issue: TrackIssue): string {
  return issue.replaceAll("_", " ");
}
