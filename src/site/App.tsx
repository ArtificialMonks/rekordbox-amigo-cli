import { useMemo, useState } from "react";
import type { LibraryAudit } from "../types";
import { auditRekordboxXmlInBrowser } from "./localAudit";

const commands = [
  "rb-amigo audit --xml ./rekordbox.xml --out ./reports/audit.md",
  "rb-amigo tags --audit ./reports/audit.json",
  "rb-amigo set-plan --audit ./reports/audit.json --hours 3 --context afterhours --vibe hypnotic --curve wave --anchor \"your track\"",
  "rb-amigo amigo"
];

const features = [
  "Read-only Rekordbox XML audits",
  "Missing file and duplicate detection",
  "Genre, label, comment, key, BPM, year, rating, and color gaps",
  "Starter tagging suggestions",
  "Chapter-based set-prep prompts",
  "Amigo-style conversational CLI guidance"
];

export function App() {
  const [audit, setAudit] = useState<LibraryAudit | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const nextAction = useMemo(() => {
    if (!audit) return "";
    if (audit.summary.weakMetadataTracks > 0) {
      return `Start with ${Math.min(audit.summary.weakMetadataTracks, 25)} weak-metadata tracks and turn them into a review crate.`;
    }
    if (audit.summary.possibleDuplicates > 0) {
      return "Review possible duplicate versions before deleting anything.";
    }
    return "Your export looks clean from the browser rules. Run the CLI for local missing-file checks.";
  }, [audit]);

  async function handleXmlFile(file: File | undefined) {
    setError("");
    setAudit(null);
    if (!file) return;

    try {
      const xml = await file.text();
      setAudit(auditRekordboxXmlInBrowser(xml, file.name));
      setFileName(file.name);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read this Rekordbox XML file.");
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Artificial Monks music tools</p>
          <h1>Ask Amigo what is hiding.</h1>
          <p className="lede">
            Private browser audit for your Rekordbox XML. Use the CLI for tags, crates, and set arcs.
          </p>
          <div className="actions">
            <a href="#audit">Run audit</a>
            <a href="#install" className="secondary">Install CLI</a>
          </div>
        </div>
        <div className="terminal" aria-label="CLI preview">
          <span>$ rb-amigo amigo</span>
          <strong>Fix what first?</strong>
          <p>Missing files: 12</p>
          <p>Possible duplicates: 38</p>
          <p>Weak metadata tracks: 421</p>
          <em>Next: review afterhours crate.</em>
        </div>
      </section>

      <section id="audit" className="auditPanel">
        <div className="auditIntro">
          <p className="eyebrow">Hosted audit</p>
          <h2>Try it without sending us your library.</h2>
          <p>
            This browser audit reads your Rekordbox XML locally. The XML does not upload to Artificial Monks.
            Use the CLI when you want deeper local checks like missing files.
          </p>
        </div>
        <div className="uploader">
          <label htmlFor="xmlUpload">Choose Rekordbox XML</label>
          <input id="xmlUpload" type="file" accept=".xml,text/xml" onChange={(event) => handleXmlFile(event.target.files?.[0])} />
          {error ? <p className="error">{error}</p> : null}
          {audit ? (
            <div className="auditResult">
              <p className="eyebrow">{fileName}</p>
              <div className="statGrid">
                <span><strong>{audit.summary.totalTracks}</strong> tracks</span>
                <span><strong>{audit.summary.possibleDuplicates}</strong> possible duplicates</span>
                <span><strong>{audit.summary.weakMetadataTracks}</strong> weak metadata</span>
              </div>
              <p>{nextAction}</p>
              <a
                className="textButton"
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(audit, null, 2))}`}
                download="rekordbox-amigo-browser-audit.json"
              >
                Download JSON report
              </a>
            </div>
          ) : (
            <p className="emptyState">Export XML from Rekordbox, drop it here, and get the first read in seconds.</p>
          )}
        </div>
      </section>

      <section id="mvp" className="band">
        <div>
          <p className="eyebrow">Why it is different</p>
          <h2>The audit is the hook. The conversation is the product.</h2>
        </div>
        <ul className="featureGrid">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section id="install" className="install">
        <div>
          <p className="eyebrow">CLI</p>
          <h2>Four commands to make a library actionable.</h2>
        </div>
        <div className="commandList">
          {commands.map((command) => (
            <code key={command}>{command}</code>
          ))}
        </div>
      </section>

      <section className="band split">
        <div>
          <p className="eyebrow">Privacy boundary</p>
          <h2>Your library is your identity. Local first by default.</h2>
        </div>
        <p>
          The web audit runs in the browser, and the CLI runs on your machine. We start with reports and reviewable suggestions,
          not risky Rekordbox database writes or silent cloud sync.
        </p>
      </section>
    </main>
  );
}
