import { useState } from "react";
import Landing from "./components/Landing";
import ResultsForm from "./components/ResultsForm";
import ResultsView from "./components/ResultsView";
import { matchDegrees } from "./utils/matcher";
import degreeData from "./data/degrees-computing.json";

function App() {
  const [view, setView] = useState("landing"); // "landing" | "form" | "results"
  const [student, setStudent] = useState(null);

  const handleSubmit = (data) => {
    setStudent(data);
    setView("results");
  };

  if (view === "landing") {
    return <Landing onStart={() => setView("form")} />;
  }

  if (view === "results" && student) {
    const results = matchDegrees(student, degreeData.programmes);
    return <ResultsView results={results} onBack={() => setView("form")} />;
  }

  return <ResultsForm onSubmit={handleSubmit} />;
}

export default App;
