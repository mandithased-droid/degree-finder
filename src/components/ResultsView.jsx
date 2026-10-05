import { useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SifRecommendation from "./SifRecommendation";
import { GRADE_RANK } from "../data/grades";

const NAVY = "#0A1F44";
const NAVY_SOFT = "#3c8781";
const ORANGE = "#F5821F";
const BG = "#FFFFFF";
const LINE = "#E2E5EA";

const GREEN = "#16A34A";   // eligible
const RED = "#D64545";     // not eligible
const AMBER = "#D97706";   // needs checking
const BLUE = "#2563EB";    // Back button

// Fixed, sensible display order — unlisted faculties fall back to alphabetical at the end.
const FACULTY_ORDER = [
  "Faculty of Computing",
  "Faculty of Engineering",
  "School of Business",
  "School of Business & AI",
  "Faculty of Humanities and Sciences",
];

const FACULTY_COLORS = {
  "Faculty of Computing": "#2563EB",
  "Faculty of Engineering": "#15803D",
  "School of Business": "#7A1430",
  "School of Business & AI": "#5B9BD5",
  "Faculty of Humanities and Sciences": "#7C3AED",
};

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

function DegreeCard({ degree, delay = 0 }) {
  const statusColor =
    degree.status === "eligible" ? GREEN : degree.status === "unknown" ? AMBER : RED;
  const statusLabel =
    degree.status === "eligible"
      ? "You're eligible"
      : degree.status === "unknown"
      ? "Worth checking"
      : "Not quite yet";

  return (
    <div
      className="rounded-2xl border p-5 md:p-6 bg-white shadow-sm animate-fade-up transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: LINE, animationDelay: `${delay}ms` }}
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
          Just one more step: {degree.bridgingNeeded}
        </p>
      )}

      {degree.status === "eligible" && degree.extraRequirements?.length > 0 && (
        <>
          <p className="text-sm font-medium mb-1.5" style={{ color: "#4B5563" }}>
            A couple of things to also sort out:
          </p>
          <ul className="text-sm mb-3 text-[#6B7280] list-disc list-inside space-y-0.5">
            {degree.extraRequirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      )}

      {degree.status !== "eligible" && degree.reasons?.length > 0 && (
        <>
          <p className="text-sm font-medium mb-1.5" style={{ color: "#4B5563" }}>
            {degree.status === "unknown"
              ? "Here's why we can't confirm this one yet:"
              : "So close! Here's what's missing:"}
          </p>
          <ul className="text-sm mb-3 text-[#6B7280] list-disc list-inside space-y-0.5">
            {degree.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      )}

      <div className="pt-2">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://apply.sliit.lk/"
          className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          style={{ backgroundColor: ORANGE }}
        >
          Apply Now →
        </a>
      </div>
    </div>
  );
}

function FilterToggle({ value, onChange, eligibleCount, totalCount }) {
  const options = [
    { value: "eligible", label: `✨ My matches (${eligibleCount})` },
    { value: "all", label: `Show everything (${totalCount})` },
  ];
  return (
    <div className="inline-flex rounded-lg overflow-hidden border mb-8" style={{ borderColor: LINE }}>
      {options.map((opt, i) => (
        <div key={opt.value} className="flex items-center">
          {i > 0 && <span style={{ color: LINE }}>|</span>}
          <button
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-4 py-2 text-sm font-medium transition-all active:scale-95"
            style={{
              backgroundColor: value === opt.value ? NAVY : "#fff",
              color: value === opt.value ? "#fff" : NAVY,
            }}
          >
            {opt.label}
          </button>
        </div>
      ))}
    </div>
  );
}

function FacultyFilter({ faculties, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {faculties.map((faculty) => {
        const isOn = selected.includes(faculty);
        const color = FACULTY_COLORS[faculty] || NAVY;
        return (
          <button
            key={faculty}
            type="button"
            onClick={() => onToggle(faculty)}
            className="text-sm font-medium px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95"
            style={
              isOn
                ? { backgroundColor: color, borderColor: color, color: "#fff" }
                : { backgroundColor: "#fff", borderColor: color, color }
            }
          >
            {faculty}
          </button>
        );
      })}
    </div>
  );
}

function groupByFaculty(results) {
  const groups = {};
  for (const degree of results) {
    const key = degree.faculty || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(degree);
  }
  const orderedKeys = [
    ...FACULTY_ORDER.filter((f) => groups[f]),
    ...Object.keys(groups).filter((f) => !FACULTY_ORDER.includes(f)).sort(),
  ];
  return orderedKeys.map((faculty) => ({ faculty, degrees: groups[faculty] }));
}

export default function ResultsView({ results, student, onBack }) {
  const [filter, setFilter] = useState("eligible");

  const eligible = results.filter((d) => d.status === "eligible");

  const isSifEligible =
    student &&
    student.olPassCategory === "min6" &&
    GRADE_RANK[student.ol?.Mathematics] >= GRADE_RANK.C &&
    GRADE_RANK[student.ol?.English] >= GRADE_RANK.C;
  const statusFiltered = filter === "eligible" ? eligible : results;

  const allFaculties = [
    ...FACULTY_ORDER.filter((f) => statusFiltered.some((d) => d.faculty === f)),
    ...[...new Set(statusFiltered.map((d) => d.faculty))]
      .filter((f) => !FACULTY_ORDER.includes(f))
      .sort(),
  ];

  // Track explicitly turned-off faculties, not the selected set — so a faculty that only
  // appears after switching filters (e.g. "Eligible only" -> "Show all") shows by default.
  const [deselectedFaculties, setDeselectedFaculties] = useState([]);
  const selectedFaculties = allFaculties.filter((f) => !deselectedFaculties.includes(f));

  const toggleFaculty = (faculty) => {
    setDeselectedFaculties((prev) =>
      prev.includes(faculty) ? prev.filter((f) => f !== faculty) : [...prev, faculty]
    );
  };

  const filtered = statusFiltered.filter((d) => selectedFaculties.includes(d.faculty));
  const facultyGroups = groupByFaculty(filtered);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <NavBar />

      <div className="flex-1 max-w-2xl mx-auto px-6 pb-16 w-full">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border mb-6 bg-white transition-opacity hover:opacity-90"
          style={{ color: BLUE, borderColor: BLUE }}
        >
          ← Go Back
        </button>

        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ color: NAVY, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
        >
          {eligible.length > 0 ? "Here's what fits you!" : "Here's where you stand"}
        </h1>
        <p className="text-sm md:text-base mb-6" style={{ color: NAVY_SOFT }}>
          {eligible.length > 0
            ? `You're eligible for ${eligible.length} out of ${results.length} programmes we checked, nice work!`
            : `None of the ${results.length} programmes matched this time — but take a look below, you might be closer than you think.`}
        </p>

        {eligible.length === 0 && isSifEligible && (
          <SifRecommendation
            heading="No direct degree matches with your current A/L results — but you may qualify for the SLIIT International Foundation."
            body="The SLIIT International Foundation (SIF) is a 1-year programme that leads directly into selected degree pathways — Computing, Business, Psychology, Quantity Surveying, Nursing, Interior Design, and more — without needing A/L results to match. Your O/L results already meet what SIF asks for."
          />
        )}

        <FilterToggle
          value={filter}
          onChange={setFilter}
          eligibleCount={eligible.length}
          totalCount={results.length}
        />

        <FacultyFilter
          faculties={allFaculties}
          selected={selectedFaculties}
          onToggle={toggleFaculty}
        />

        {filtered.length === 0 && (
          <div
            className="rounded-2xl border p-6 text-sm text-center"
            style={{ borderColor: LINE, color: NAVY_SOFT }}
          >
            {selectedFaculties.length === 0 ? (
              <>👀 Looks like every faculty is hidden — turn at least one back on above to see your results.</>
            ) : (
              <>
                Nothing here just yet with this filter. Try{" "}
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="underline font-medium"
                  style={{ color: NAVY }}
                >
                  showing everything
                </button>{" "}
                to see what's close, or head back and double-check your answers.
              </>
            )}
          </div>
        )}

        {(() => {
          let cardIndex = 0;
          return facultyGroups.map(({ faculty, degrees }) => (
            <div key={faculty} className="mb-10">
              <h2
                className="text-2xl md:text-3xl mb-4 flex items-center gap-2"
                style={{
                  color: FACULTY_COLORS[faculty] || NAVY,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                }}
              >
                {faculty}
                <span className="text-base font-normal" style={{ color: NAVY_SOFT }}>
                  · {degrees.length} {degrees.length === 1 ? "match" : "matches"}
                </span>
              </h2>
              <div className="flex flex-col gap-4">
                {degrees.map((d) => {
                  const delay = Math.min(cardIndex++, 8) * 50;
                  return <DegreeCard key={d.id} degree={d} delay={delay} />;
                })}
              </div>
            </div>
          ));
        })()}
      </div>

      <Footer />
    </div>
  );
}
