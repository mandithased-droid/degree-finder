import { useState } from "react";
import Landing from "./components/Landing";
import ResultsForm from "./components/ResultsForm";
import ResultsView from "./components/ResultsView";
import { matchDegrees } from "./utils/matcher";
import computingData from "./data/degrees-computing.json";
import engineeringData from "./data/degrees-engineering.json";
import businessData from "./data/degrees-business.json";
import businessAiData from "./data/degrees-business-ai.json";
import humanitiesSciencesData from "./data/degrees-humanities-sciences.json";

const allProgrammes = [
  ...computingData.programmes,
  ...engineeringData.programmes,
  ...businessData.programmes,
  ...businessAiData.programmes,
  ...humanitiesSciencesData.programmes,
];

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
    const results = matchDegrees(student, allProgrammes);
    return <ResultsView results={results} onBack={() => setView("form")} />;
  }

  return <ResultsForm onSubmit={handleSubmit} />;
}

export default App;
