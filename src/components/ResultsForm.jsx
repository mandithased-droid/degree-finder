import { useState, useMemo } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SifRecommendation from "./SifRecommendation";
import { STREAMS, AL_SUBJECTS_BY_STREAM } from "../data/streams";
import { GRADE_OPTIONS, GRADE_LABELS, GRADE_RANK } from "../data/grades";

const NAVY = "#0A1F44";
const NAVY_SOFT = "#3C5A87";
const ORANGE = "#F5821F";
const BG = "#FFFFFF";
const LINE = "#E2E5EA";
const ALERT = "#D64545";

const OL_SUBJECTS = [
  { key: "Mathematics", label: "Mathematics" },
  { key: "English", label: "English" },
  { key: "Sinhala/Tamil", label: "Sinhala / Tamil (First Language)" },
  { key: "Science", label: "Science" },
];

// Question always sits above its answer options — same stacked order on every screen size.
// delay (ms) staggers multiple rows that appear at the same moment, e.g. the 4 O/L subject rows.
function FormRow({ question, helper, children, delay = 0 }) {
  return (
    <div
      className="py-6 animate-fade-up"
      style={{ borderBottom: `1px solid ${LINE}`, animationDelay: `${delay}ms` }}
    >
      <p
        className="text-[15px] font-medium mb-3"
        style={{ color: NAVY, fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        {question}
      </p>
      {helper && <p className="text-sm text-[#6B7280] mb-3">{helper}</p>}
      <div>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border" style={{ borderColor: LINE }}>
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

function GradeSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full md:w-56 rounded-lg border px-3 py-2 text-sm bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ borderColor: LINE, color: NAVY }}
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

// Shown whenever a student's O/L results rule out every degree pathway — PDP has no entry
// requirements, so it's always a valid next step regardless of O/L outcome.
function PdpRedirect({
  heading = "A degree pathway isn't the right fit yet — but Professional Development Programmes are.",
  body = "SLIIT's Professional Development Programmes (PDP) are open to anyone — no O/L results required. They cover short courses and certificates across IT, Business, and Engineering, and can be a great starting point no matter where you are in your education.",
}) {
  return (
    <div
      className="my-6 p-6 rounded-2xl animate-fade-up"
      style={{ backgroundColor: "#F3F4F6", border: `1px solid ${LINE}` }}
    >
      <p className="font-semibold text-base mb-2" style={{ color: NAVY, fontFamily: "'Sora', sans-serif" }}>
        {heading}
      </p>
      <p className="text-sm mb-4" style={{ color: "#4B5563" }}>
        {body}
      </p>
      <a
        href="https://www.sliit.lk/study/professional-programmes"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style={{ backgroundColor: ORANGE }}
      >
        Explore PDP Courses
      </a>
    </div>
  );
}

export default function ResultsForm({ onSubmit }) {
  const [doneOL, setDoneOL] = useState("");
  const [olPassCategory, setOlPassCategory] = useState("");
  const [ol, setOl] = useState({
    Mathematics: "",
    English: "",
    "Sinhala/Tamil": "",
    Science: "",
    "Business & Accounting Studies": "",
  });

  const [doneAL, setDoneAL] = useState("");
  const [alPassCategory, setAlPassCategory] = useState("");
  const [stream, setStream] = useState("");
  const [alSubjects, setAlSubjects] = useState(["", "", ""]);
  const [alGrades, setAlGrades] = useState(["", "", ""]);
  const [alGeneralEnglish, setAlGeneralEnglish] = useState("");
  const [alMedium, setAlMedium] = useState("");

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

  const olBelowCThreshold =
    (ol.Mathematics && GRADE_RANK[ol.Mathematics] < GRADE_RANK.C) ||
    (ol.English && GRADE_RANK[ol.English] < GRADE_RANK.C);

  // Only "no O/Ls at all" is a true hard stop — you can't sit A/Ls or apply to any SLIIT
  // degree without having done O/Ls. Fewer-than-6-passes and weak Maths/English are shown
  // as PDP suggestions, but don't block the A/L section: plenty of pathways (most transfer
  // degrees, several BEd programmes) don't require specific O/L subjects at all — the
  // matcher already checks O/L conditions per-degree where they actually matter.
  const isPdpActive = doneOL === "no";

  const isComplete = useMemo(() => {
    if (doneOL !== "yes") return doneOL === "no";
    if (!olPassCategory) return false;
    const requiredOlSubjects = ["Mathematics", "English", "Sinhala/Tamil", "Science"];
    if (requiredOlSubjects.some((subj) => !ol[subj])) return false;
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
      alGeneralEnglish,
      alMedium,
      alSubjects: alSubjects.reduce((acc, subj, i) => {
        if (subj) acc[subj] = alGrades[i];
        return acc;
      }, {}),
    };
    if (onSubmit) onSubmit(payload);
    else console.log("Results submitted:", payload);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <NavBar />

      <div className="flex-1 max-w-2xl mx-auto px-6 pb-16 w-full">
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ color: NAVY, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
        >
          Let's Get Started!
        </h1>
        <p className="text-sm md:text-base mb-10" style={{ color: NAVY_SOFT }}>
          Tell us about your Academic Background, and we'll handle the rest.
        </p>

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

        {doneOL === "no" && <PdpRedirect />}

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

            {olPassCategory === "less6" && (
              <PdpRedirect
                heading="Fewer than 6 O/L passes doesn't rule out every pathway — but PDP is worth a look too."
                body="Some degree pathways only check specific A/L results, not your total O/L pass count, so it's still worth continuing below. SLIIT's Professional Development Programmes (PDP) are also open to anyone, with no O/L requirements, if you'd like a parallel option."
              />
            )}

            {olPassCategory && (
              <>
                {OL_SUBJECTS.map(({ key, label }, i) => (
                  <FormRow key={key} question={`O/L ${label} result`} delay={i * 60}>
                    <GradeSelect value={ol[key]} onChange={(v) => setOl({ ...ol, [key]: v })} />
                  </FormRow>
                ))}

                <FormRow
                  question="O/L Business & Accounting Studies result"
                  helper="Optional — only answer this if you sat this subject at O/L."
                >
                  <GradeSelect
                    value={ol["Business & Accounting Studies"]}
                    onChange={(v) => setOl({ ...ol, "Business & Accounting Studies": v })}
                  />
                </FormRow>

                {olBelowCThreshold && (
                  <PdpRedirect
                    heading="A below-C in O/L Maths or English won't block every pathway — but PDP is worth a look too."
                    body="Only some degree pathways require a C pass in O/L Mathematics or English, so it's still worth continuing below to check your A/L-based options. SLIIT's Professional Development Programmes (PDP) are also open to anyone, with no O/L requirements, if you'd like a parallel option."
                  />
                )}

                <>
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

                    {doneAL === "no" && <SifRecommendation />}

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
                            style={{ borderColor: LINE, color: NAVY }}
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
                            <FormRow key={i} question={`A/L subject ${i + 1}`} delay={i * 60}>
                              <div className="flex flex-col gap-2">
                                <select
                                  value={alSubjects[i]}
                                  onChange={(e) => handleSubjectChange(i, e.target.value)}
                                  className="w-full md:w-64 rounded-lg border px-3 py-2 text-sm bg-white"
                                  style={{ borderColor: LINE, color: NAVY }}
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

                        <FormRow
                          question="A/L General English result"
                          helper="Optional — this is the common General English paper, separate from your 3 main subjects. Leave unselected if you don't have a result for it."
                        >
                          <GradeSelect value={alGeneralEnglish} onChange={setAlGeneralEnglish} />
                        </FormRow>

                        <FormRow
                          question="What was your A/L medium of instruction?"
                          helper="Optional — only relevant for a small number of programmes."
                        >
                          <Toggle
                            value={alMedium}
                            onChange={setAlMedium}
                            options={[
                              { value: "Sinhala", label: "Sinhala" },
                              { value: "Tamil", label: "Tamil" },
                              { value: "English", label: "English" },
                            ]}
                          />
                        </FormRow>
                      </>
                    )}
                  </>
              </>
            )}
          </>
        )}

        {!isPdpActive && (
          <div className="pt-10">
            <button
              type="button"
              disabled={!isComplete}
              onClick={handleSubmit}
              className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[1.02] active:scale-95"
              style={{ backgroundColor: ORANGE }}
            >
              Find my degree pathways
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
