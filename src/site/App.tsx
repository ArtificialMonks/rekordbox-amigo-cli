const commands = [
  "rb-amigo audit --xml ./rekordbox.xml --out ./reports/audit.md",
  "rb-amigo tags --audit ./reports/audit.json",
  "rb-amigo set-plan --audit ./reports/audit.json --hours 3 --context afterhours",
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
  return (
    <main>
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Artificial Monks music tools</p>
          <h1>Rekordbox prep that keeps DJs in flow.</h1>
          <p className="lede">
            A safe CLI for DJs who want cleaner metadata, smarter crates, and a creative assistant before they touch their USB.
          </p>
          <div className="actions">
            <a href="#install">Install CLI</a>
            <a href="#mvp" className="secondary">See MVP</a>
          </div>
        </div>
        <div className="terminal" aria-label="CLI preview">
          <span>$ rb-amigo audit --xml library.xml</span>
          <strong>Audit complete</strong>
          <p>Missing files: 12</p>
          <p>Possible duplicates: 38</p>
          <p>Weak metadata tracks: 421</p>
          <em>Next: build a review crate for afterhours records.</em>
        </div>
      </section>

      <section id="mvp" className="band">
        <div>
          <p className="eyebrow">MVP</p>
          <h2>Start safe. Earn trust. Then get smarter.</h2>
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
          <p className="eyebrow">Safety boundary</p>
          <h2>No risky Rekordbox database writes in the first version.</h2>
        </div>
        <p>
          The first product reads XML exports, generates reports, and keeps every suggested change reviewable.
          That makes it useful today and trustworthy enough to grow into deeper tagging and set-building flows.
        </p>
      </section>
    </main>
  );
}
