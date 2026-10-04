const NAVY = "#0A1F44";
const ORANGE = "#F5821F";

/*
  Shared across every page (Landing, Form, Results) so branding stays consistent.
  Update the logo src/size and the two link hrefs here once, and it updates everywhere.
*/

export default function NavBar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
      <a href="/">
  <img src="/logo.png" alt="SLIIT" className="h-12" />
</a>

      <div className="flex items-center gap-3">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.sliit.lk/"
          className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{ borderColor: NAVY, color: NAVY }}
        >
          Visit SLIIT
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://apply.sliit.lk/"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ORANGE }}
        >
          Apply now
        </a>
      </div>
    </nav>
  );
}
