import NavBar from "./NavBar";
import Footer from "./Footer";

const NAVY = "#0A1F44";
const NAVY_SOFT = "#3C5A87";
const ORANGE = "#F5821F";
const BG = "#FFFFFF";

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <NavBar />

      <div className="flex-1 flex flex-col items-center text-center px-6 pt-24 md:pt-32 pb-16">
        <h1
          className="text-4xl md:text-6xl leading-tight max-w-2xl animate-fade-up"
          style={{ color: NAVY, fontFamily: "'Sora', sans-serif", fontWeight: 700, animationDelay: "0ms" }}
        >
          Not Sure What to Study? Let's Find Your Path.
        </h1>

        <p
          className="text-base md:text-lg mt-6 max-w-md animate-fade-up"
          style={{ color: NAVY_SOFT, animationDelay: "180ms" }}
        >
          Answer a few quick questions and discover the SLIIT programmes that fit you best.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 px-10 py-4 rounded-lg font-semibold text-white text-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95 animate-fade-up"
          style={{ backgroundColor: ORANGE, animationDelay: "340ms" }}
        >
          Let's Go!
        </button>
      </div>

      <Footer />
    </div>
  );
}
