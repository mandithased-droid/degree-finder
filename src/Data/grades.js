// Local G.C.E. O/L and A/L grading scale (Department of Examinations, Sri Lanka).
// Both O/L and local-syllabus A/L use the same five grades.
// Note: Cambridge/Edexcel A/Ls use a different scale (A,B,C,D,E,U) — not handled here.

export const GRADE_OPTIONS = ["A", "B", "C", "S", "W"];

export const GRADE_LABELS = {
  A: "A — Distinction (75–100)",
  B: "B — Very Good Pass (65–74)",
  C: "C — Credit Pass (50–64)",
  S: "S — Ordinary Pass (35–49)",
  W: "W — Weak / Fail (0–34)",
};

// Higher number = better grade. Used by the matching engine (stage 2), not the form itself.
export const GRADE_RANK = { A: 5, B: 4, C: 3, S: 2, W: 0 };
