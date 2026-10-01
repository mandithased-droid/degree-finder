import NavBar from "./NavBar";

const NAVY = "#0A1F44";
const NAVY_SOFT = "#3C5A87";
const ORANGE = "#F5821F";
const BG = "#FFFFFF";

function ForkingPathBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M600,760 C 480,560 260,420 130,40"
        stroke={NAVY}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 20"
        opacity="0.18"
      />
      <path
        d="M600,760 C 720,560 950,420 1080,40"
        stroke={ORANGE}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 20"
        opacity="0.3"
      />
      <circle cx="600" cy="760" r="7" fill={NAVY} opacity="0.4" />
    </svg>
  );
}

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: BG }}>
      <ForkingPathBackground />
      <NavBar />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 md:pt-32">
        <h1
          className="text-4xl md:text-6xl leading-tight max-w-2xl"
          style={{ color: NAVY, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
        >
          Not sure what to study? Let's find your path.
        </h1>

        <p className="text-base md:text-lg mt-6 max-w-md" style={{ color: NAVY_SOFT }}>
          Answer a few quick questions and discover the SLIIT programmes that fit you best.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 px-10 py-4 rounded-lg font-semibold text-white text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: ORANGE }}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}
