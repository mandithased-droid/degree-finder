const NAVY = "#0A1F44";
const ORANGE = "#F5821F";

/*
  Shared across every page (Landing, Form, Results) so branding stays consistent.
  Update the logo src/size and the two link hrefs here once, and it updates everywhere.
*/

export default function NavBar({ onLogoClick }) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
      {onLogoClick ? (
        <button type="button" onClick={onLogoClick} aria-label="Back to home">
          <img src="/logo.png" alt="SLIIT" className="h-8 md:h-12" />
        </button>
      ) : (
        <img src="/logo.png" alt="SLIIT" className="h-8 md:h-12" />
      )}

      <div className="flex items-center gap-2 md:gap-3">
        <a
          href="https://www.sliit.lk"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-lg font-medium border transition-colors"
          style={{ borderColor: NAVY, color: NAVY }}
        >
          Visit SLIIT
        </a>
        <a
          href="https://apply.sliit.lk/"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-lg font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ORANGE }}
        >
          Apply now
        </a>
      </div>
    </nav>
  );
}
