const INK = "#1A2E44";
const PAPER = "#F6F5F1";
const BRASS = "#B8863B";
const LINE = "#D9D6CC";
const GREEN = "#2F6D4F";
const ALERT = "#B5502D";

function Badge({ children, color }) {
  return (
    <span
      className="inline-block text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      {children}
    </span>
  );
}

function DegreeCard({ degree }) {
  const statusColor =
    degree.status === "eligible" ? GREEN : degree.status === "unknown" ? BRASS : ALERT;
  const statusLabel =
    degree.status === "eligible"
      ? "Eligible"
      : degree.status === "unknown"
      ? "Check with university"
      : "Not eligible";

  return (
    <div className="py-5" style={{ borderBottom: `1px solid ${LINE}` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium" style={{ color: INK, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            {degree.name}
          </p>
          <p className="text-sm text-[#6B7280]">{degree.university}</p>
        </div>
        <Badge color={statusColor}>{statusLabel}</Badge>
      </div>

      {degree.status === "eligible" && degree.bridgingNeeded && (
        <p className="text-sm mt-2" style={{ color: BRASS }}>
          Additional requirement: {degree.bridgingNeeded}
        </p>
      )}

      {degree.status === "eligible" && degree.extraRequirements?.length > 0 && (
        <ul className="text-sm mt-2 text-[#6B7280] list-disc list-inside">
          {degree.extraRequirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {degree.status !== "eligible" && degree.reasons?.length > 0 && (
        <ul className="text-sm mt-2 text-[#6B7280] list-disc list-inside">
          {degree.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResultsView({ results, onBack }) {
  const eligible = results.filter((d) => d.status === "eligible");
  const unknown = results.filter((d) => d.status === "unknown");
  const notEligible = results.filter((d) => d.status === "not-eligible");

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPER }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <button type="button" onClick={onBack} className="text-sm mb-8" style={{ color: BRASS }}>
          ← Back to edit results
        </button>

        <p className="text-sm tracking-wide" style={{ color: BRASS }}>
          Degree Pathway Finder
        </p>
        <h1 className="text-3xl mt-2 mb-2" style={{ color: INK, fontFamily: "'Lora', serif" }}>
          Your pathway results
        </h1>
        <p className="text-sm text-[#6B7280] mb-10">
          {eligible.length} eligible · {notEligible.length} not eligible · {unknown.length} need checking
        </p>

        {eligible.length > 0 && (
          <>
            <h2 className="text-lg mb-1" style={{ color: GREEN, fontFamily: "'Lora', serif" }}>
              You're eligible for
            </h2>
            {eligible.map((d) => (
              <DegreeCard key={d.id} degree={d} />
            ))}
          </>
        )}

        {unknown.length > 0 && (
          <>
            <h2 className="text-lg mt-10 mb-1" style={{ color: BRASS, fontFamily: "'Lora', serif" }}>
              Requirements not confirmed yet
            </h2>
            {unknown.map((d) => (
              <DegreeCard key={d.id} degree={d} />
            ))}
          </>
        )}

        {notEligible.length > 0 && (
          <>
            <h2 className="text-lg mt-10 mb-1" style={{ color: ALERT, fontFamily: "'Lora', serif" }}>
              Not eligible right now
            </h2>
            {notEligible.map((d) => (
              <DegreeCard key={d.id} degree={d} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
