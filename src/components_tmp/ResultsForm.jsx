import { useState, useMemo } from "react";
import { STREAMS, AL_SUBJECTS_BY_STREAM } from "../data/streams";
import { GRADE_OPTIONS, GRADE_LABELS } from "../data/grades";

/*
  Fonts: Lora (headings) + IBM Plex Sans (body/UI).
  Add to your index.html <head>:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Lora:wght@500;600&display=swap" rel="stylesheet">
*/

const INK = "#1A2E44";
const PAPER = "#F6F5F1";
const BRASS = "#B8863B";
const LINE = "#D9D6CC";
const ALERT = "#B5502D";

const OL_SUBJECTS = [
  { key: "Mathematics", label: "Mathematics" },
  { key: "English", label: "English" },
  { key: "Sinhala/Tamil", label: "Sinhala / Tamil (First Language)" },
  { key: "Science", label: "Science" },
];

function FormRow({ question, helper, children }) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-6"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <div className="order-1 md:w-64 md:flex-shrink-0">{children}</div>
      <div className="order-2">
        <p
          className="text-[15px] font-medium"
          style={{ color: INK, fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          {question}
        </p>
        {helper && <p className="text-sm mt-1 text-[#6B7280]">{helper}</p>}
      </div>
    </div>
  );
}

function Toggle({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border" style={{ borderColor: LINE }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="px-4 py-2 text-sm font-medium transition-colors"
          style={{
            backgroundColor: value === opt.value ? INK : "#fff",
            color: value === opt.value ? "#fff" : INK,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function GradeSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full md:w-56 rounded-lg border px-3 py-2 text-sm bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ borderColor: LINE, color: INK }}
    >
      <option value="">Select grade</option>
      {GRADE_OPTIONS.map((g) => (
        <option key={g} value={g}>
          {GRADE_LABELS[g]}
        </option>
      ))}
    </select>
  );
}

export default function ResultsForm({ onSubmit }) {
  const [doneOL, setDoneOL] = useState("");
  const [olPassCategory, setOlPassCategory] = useState("");
  const [ol, setOl] = useState({ Mathematics: "", English: "", "Sinhala/Tamil": "", Science: "" });

  const [doneAL, setDoneAL] = useState("");
  const [alPassCategory, setAlPassCategory] = useState("");
  const [stream, setStream] = useState("");
  const [alSubjects, setAlSubjects] = useState(["", "", ""]);
  const [alGrades, setAlGrades] = useState(["", "", ""]);

  const streamSubjects = stream ? AL_SUBJECTS_BY_STREAM[stream] : [];

  const availableFor = (slotIndex) =>
    streamSubjects.filter((s) => !alSubjects.some((chosen, i) => chosen === s && i !== slotIndex));

  const handleStreamChange = (value) => {
    setStream(value);
    setAlSubjects(["", "", ""]);
    setAlGrades(["", "", ""]);
  };

  const handleSubjectChange = (index, value) => {
    const next = [...alSubjects];
    next[index] = value;
    setAlSubjects(next);
  };

  const handleGradeChange = (index, value) => {
    const next = [...alGrades];
    next[index] = value;
    setAlGrades(next);
  };

  const isComplete = useMemo(() => {
    if (doneOL !== "yes") return doneOL === "no";
    if (!olPassCategory) return false;
    if (Object.values(ol).some((g) => !g)) return false;
    if (doneAL !== "yes") return doneAL === "no";
    if (!alPassCategory || !stream) return false;
    if (alSubjects.some((s) => !s) || alGrades.some((g) => !g)) return false;
    return true;
  }, [doneOL, olPassCategory, ol, doneAL, alPassCategory, stream, alSubjects, alGrades]);

  const handleSubmit = () => {
    const payload = {
      doneOL: doneOL === "yes",
      olPassCategory,
      ol,
      doneAL: doneAL === "yes",
      alPassCategory,
      stream,
      alSubjects: alSubjects.reduce((acc, subj, i) => {
        if (subj) acc[subj] = alGrades[i];
        return acc;
      }, {}),
    };
    if (onSubmit) onSubmit(payload);
    else console.log("Results submitted:", payload);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPER }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-sm tracking-wide" style={{ color: BRASS }}>
          Degree Pathway Finder
        </p>
        <h1 className="text-3xl mt-2 mb-10" style={{ color: INK, fontFamily: "'Lora', serif" }}>
          Enter your O/L and A/L results
        </h1>

        {/* O/L SECTION */}
        <FormRow question="Have you completed your O/Ls?">
          <Toggle
            value={doneOL}
            onChange={setDoneOL}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </FormRow>

        {doneOL === "no" && (
          <div className="py-6 text-sm" style={{ color: ALERT, borderBottom: `1px solid ${LINE}` }}>
            You'll need to complete your O/Ls before a degree pathway can be worked out — O/Ls are a prerequisite
            for the A/L exam in Sri Lanka.
          </div>
        )}

        {doneOL === "yes" && (
          <>
            <FormRow question="What were your overall O/L results?">
              <Toggle
                value={olPassCategory}
                onChange={setOlPassCategory}
                options={[
                  { value: "min6", label: "6 or more passes" },
                  { value: "less6", label: "Fewer than 6" },
                ]}
              />
            </FormRow>

            {OL_SUBJECTS.map(({ key, label }) => (
              <FormRow key={key} question={`O/L ${label} result`}>
                <GradeSelect value={ol[key]} onChange={(v) => setOl({ ...ol, [key]: v })} />
              </FormRow>
            ))}

            {/* A/L SECTION */}
            <FormRow question="Have you completed your A/Ls?">
              <Toggle
                value={doneAL}
                onChange={setDoneAL}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </FormRow>

            {doneAL === "no" && (
              <div className="py-6 text-sm" style={{ color: ALERT, borderBottom: `1px solid ${LINE}` }}>
                Most degree pathways need A/L results to check eligibility against. Come back once you have them.
              </div>
            )}

            {doneAL === "yes" && (
              <>
                <FormRow question="What were your overall A/L results?">
                  <Toggle
                    value={alPassCategory}
                    onChange={setAlPassCategory}
                    options={[
                      { value: "min3", label: "3 or more passes" },
                      { value: "less3", label: "Fewer than 3" },
                    ]}
                  />
                </FormRow>

                <FormRow question="Which A/L stream did you follow?">
                  <select
                    value={stream}
                    onChange={(e) => handleStreamChange(e.target.value)}
                    className="w-full md:w-64 rounded-lg border px-3 py-2 text-sm bg-white"
                    style={{ borderColor: LINE, color: INK }}
                  >
                    <option value="">Select stream</option>
                    {STREAMS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormRow>

                {stream &&
                  [0, 1, 2].map((i) => (
                    <FormRow key={i} question={`A/L subject ${i + 1}`}>
                      <div className="flex flex-col gap-2">
                        <select
                          value={alSubjects[i]}
                          onChange={(e) => handleSubjectChange(i, e.target.value)}
                          className="w-full md:w-64 rounded-lg border px-3 py-2 text-sm bg-white"
                          style={{ borderColor: LINE, color: INK }}
                        >
                          <option value="">Select subject</option>
                          {availableFor(i).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <GradeSelect
                          value={alGrades[i]}
                          onChange={(v) => handleGradeChange(i, v)}
                          disabled={!alSubjects[i]}
                        />
                      </div>
                    </FormRow>
                  ))}
              </>
            )}
          </>
        )}

        <div className="pt-10">
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: BRASS }}
          >
            Find my degree pathways
          </button>
        </div>
      </div>
    </div>
  );
}
