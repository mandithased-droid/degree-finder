const NAVY = "#0A1F44";
const ORANGE = "#F5821F";
const LINE = "#E2E5EA";

/*
  Shown whenever a student has strong enough O/Ls (6+ passes, C in Maths and English)
  but hasn't completed A/Ls, or has A/L results that don't directly match any degree.
  SIF itself requires no A/Ls at all — it's a 1-year pathway into selected degrees.
*/
export default function SifRecommendation({
  heading = "Haven't done your A/Ls yet? The SLIIT International Foundation could be your path.",
  body = "The SLIIT International Foundation (SIF) is a 1-year programme that leads directly into selected degree pathways — Computing, Business, Psychology, Quantity Surveying, Nursing, Interior Design, and more — without needing A/L results at all. Your O/L results already meet what SIF asks for.",
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
        href="https://www.sliit.lk/study/find-a-program/sliit-international-foundation"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style={{ backgroundColor: ORANGE }}
      >
        Learn about SIF
      </a>
    </div>
  );
}
