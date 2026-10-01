import NavBar from "./NavBar";

const NAVY = "#0A1F44";
const NAVY_SOFT = "#3c8781";
const ORANGE = "#F5821F";
const BG = "#FFFFFF";
const LINE = "#E2E5EA";

const GREEN = "#16A34A";   // eligible
const RED = "#D64545";     // not eligible
const AMBER = "#D97706";   // needs checking
const BLUE = "#012b88";    // Apply now button

function Badge({ children, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

function DegreeCard({ degree }) {
  const statusColor =
    degree.status === "eligible" ? GREEN : degree.status === "unknown" ? AMBER : RED;
  const statusLabel =
    degree.status === "eligible"
      ? "Eligible"
      : degree.status === "unknown"
      ? "Check with university"
      : "Not eligible";

  return (
    <div
      className="rounded-2xl border p-5 md:p-6 bg-white shadow-sm"
      style={{ borderColor: LINE }}
    >
      <div className="flex items-start justify-between gap-4 mb-1">
        <p
          className="font-semibold text-base md:text-lg"
          style={{ color: NAVY, fontFamily: "'Sora', sans-serif" }}
        >
          {degree.name}
        </p>
        <Badge color={statusColor}>{statusLabel}</Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge color={NAVY}>{degree.university}</Badge>
        <Badge color={NAVY_SOFT}>{degree.faculty}</Badge>
        <Badge color={ORANGE}>{degree.duration}</Badge>
      </div>

      {degree.status === "eligible" && degree.bridgingNeeded && (
        <p className="text-sm mb-3" style={{ color: AMBER }}>
          Additional requirement: {degree.bridgingNeeded}
        </p>
      )}

      {degree.status === "eligible" && degree.extraRequirements?.length > 0 && (
        <ul className="text-sm mb-3 text-[#6B7280] list-disc list-inside space-y-0.5">
          {degree.extraRequirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {degree.status !== "eligible" && degree.reasons?.length > 0 && (
        <ul className="text-sm mb-3 text-[#6B7280] list-disc list-inside space-y-0.5">
          {degree.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      <div className="pt-2">
        <a
          target="_blank"
rel="noopener noreferrer"
          href="https://apply.sliit.lk/"
          className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ORANGE }}
        >
          Apply now
        </a>
      </div>
    </div>
  );
}

export default function ResultsView({ results, onBack }) {
  const eligible = results.filter((d) => d.status === "eligible");
  const unknown = results.filter((d) => d.status === "unknown");
  const notEligible = results.filter((d) => d.status === "not-eligible");

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <NavBar />

      <div className="max-w-2xl mx-auto px-6 pb-16">
        <button
          type="button"
          onClick={onBack}
          className="text-sm mb-6 font-medium"
          style={{ color: BLUE }}
        >
          ← Back
        </button>

        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ color: NAVY, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
        >
          Your pathway results
        </h1>
        <p className="text-sm md:text-base mb-10" style={{ color: NAVY_SOFT }}>
          {eligible.length} eligible · {notEligible.length} not eligible · {unknown.length} need checking
        </p>

        {eligible.length > 0 && (
          <>
            <h2 className="text-lg mb-3" style={{ color: GREEN, fontFamily: "'Sora', sans-serif" }}>
              You're eligible for
            </h2>
            <div className="flex flex-col gap-4 mb-10">
              {eligible.map((d) => (
                <DegreeCard key={d.id} degree={d} />
              ))}
            </div>
          </>
        )}

        {unknown.length > 0 && (
          <>
            <h2 className="text-lg mb-3" style={{ color: AMBER, fontFamily: "'Sora', sans-serif" }}>
              Requirements not confirmed yet
            </h2>
            <div className="flex flex-col gap-4 mb-10">
              {unknown.map((d) => (
                <DegreeCard key={d.id} degree={d} />
              ))}
            </div>
          </>
        )}

        {notEligible.length > 0 && (
          <>
            <h2 className="text-lg mb-3" style={{ color: RED, fontFamily: "'Sora', sans-serif" }}>
              Not eligible right now
            </h2>
            <div className="flex flex-col gap-4">
              {notEligible.map((d) => (
                <DegreeCard key={d.id} degree={d} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
