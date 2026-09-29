import { useState } from "react";
import ResultsForm from "./components/ResultsForm";
import ResultsView from "./Components/ResultsView";
import { matchDegrees } from "./utils/matcher";
import degreeData from "./data/degrees-computing.json";

function App() {
  const [student, setStudent] = useState(null);

  if (student) {
    const results = matchDegrees(student, degreeData.programmes);
    return <ResultsView results={results} onBack={() => setStudent(null)} />;
  }

  return <ResultsForm onSubmit={setStudent} />;
}

export default App;
