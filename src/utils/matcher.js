import { GRADE_RANK } from "../data/grades";

const rank = (g) => GRADE_RANK[g] ?? -1;

function evaluateCondition(student, cond) {
  switch (cond.type) {
    case "alMinPasses": {
      const passCount = Object.values(student.alSubjects).filter(
        (g) => rank(g) >= rank(cond.minGrade)
      ).length;
      return {
        pass: passCount >= cond.count,
        reason: `Needs at least ${cond.count} A/L passes at ${cond.minGrade} or better (you have ${passCount})`,
      };
    }

    case "alStream": {
      if (cond.oneOf) {
        return {
          pass: cond.oneOf.includes(student.stream),
          reason: `Requires the ${cond.oneOf.join(" or ")} stream`,
        };
      }
      if (cond.notOneOf) {
        return {
          pass: !cond.notOneOf.includes(student.stream),
          reason: `Not available on this path for the ${cond.notOneOf.join(" or ")} stream`,
        };
      }
      return { pass: true };
    }

    case "olSubjectMinGrade": {
      const grade = student.ol[cond.subject];
      return {
        pass: rank(grade) >= rank(cond.minGrade),
        reason: `O/L ${cond.subject} needs at least ${cond.minGrade}`,
      };
    }

    case "alSubjectPresent": {
      return {
        pass: Boolean(student.alSubjects[cond.subject]),
        reason: `Requires ${cond.subject} as an A/L subject`,
      };
    }

    case "alSubjectMinGrade": {
      return {
        pass: rank(student.alSubjects[cond.subject]) >= rank(cond.minGrade),
        reason: `A/L ${cond.subject} needs at least ${cond.minGrade}`,
      };
    }

    case "alSubjectsAllOf": {
      const missing = cond.subjects.filter(
        (s) => rank(student.alSubjects[s]) < rank(cond.minGrade)
      );
      return {
        pass: missing.length === 0,
        reason: `Needs ${cond.subjects.join(" and ")} at ${cond.minGrade} or better`,
      };
    }

    case "alSubjectsOneOf": {
      const need = cond.count || 1;
      const have = cond.subjects.filter(
        (s) => rank(student.alSubjects[s]) >= rank(cond.minGrade)
      ).length;
      return {
        pass: have >= need,
        reason: `Needs at least ${need} of: ${cond.subjects.join(", ")} at ${cond.minGrade}+`,
      };
    }

    case "alGradeDistribution": {
      const grades = cond.subjects
        ? cond.subjects.map((s) => student.alSubjects[s]).filter(Boolean)
        : Object.values(student.alSubjects);
      const ranks = grades.map(rank).sort((a, b) => b - a);
      const thresholds = cond.distribution
        .flatMap((d) => Array(d.count).fill(rank(d.minGrade)))
        .sort((a, b) => b - a);
      const pass = thresholds.every((min, i) => (ranks[i] ?? -1) >= min);
      const desc = cond.distribution.map((d) => `${d.count}×${d.minGrade}`).join(" + ");
      return {
        pass,
        reason: `Needs a grade profile of ${desc}${
          cond.subjects ? ` across ${cond.subjects.join(", ")}` : ""
        }`,
      };
    }

    default:
      return { pass: true };
  }
}

function evaluatePath(student, path) {
  const results = path.conditions.map((c) => ({ ...evaluateCondition(student, c), cond: c }));
  const pass = results.every((r) => r.pass);
  const failReasons = results.filter((r) => !r.pass).map((r) => r.reason);

  let bridgingNeeded = null;
  if (pass && path.conditionalExtra) {
    const waived = path.conditionalExtra.waivedIf.every((c) => evaluateCondition(student, c).pass);
    bridgingNeeded = waived ? null : path.conditionalExtra.name;
  }

  return { pass, failReasons, bridgingNeeded, pathId: path.pathId };
}

// student shape (matches ResultsForm's onSubmit payload):
// { doneOL, olPassCategory, ol: {subject: grade}, doneAL, alPassCategory, stream, alSubjects: {subject: grade} }
export function matchDegrees(student, programmes) {
  return programmes.map((degree) => {
    if (!student.doneOL) {
      return { ...degree, status: "not-eligible", reasons: ["O/L results required"] };
    }
    if (!student.doneAL) {
      return { ...degree, status: "not-eligible", reasons: ["A/L results required"] };
    }
    if (!degree.entryPaths || degree.entryPaths.length === 0) {
      return {
        ...degree,
        status: "unknown",
        reasons: [degree.dataStatus || "Entry requirements not available for this programme yet."],
      };
    }

    const pathResults = degree.entryPaths.map((p) => evaluatePath(student, p));
    const matchedPath = pathResults.find((p) => p.pass);

    if (matchedPath) {
      return {
        ...degree,
        status: "eligible",
        matchedPathId: matchedPath.pathId,
        bridgingNeeded: matchedPath.bridgingNeeded,
        reasons: [],
      };
    }

    // Show the reasons from whichever path had the fewest unmet conditions
    const closest = [...pathResults].sort((a, b) => a.failReasons.length - b.failReasons.length)[0];
    return { ...degree, status: "not-eligible", reasons: closest.failReasons };
  });
}
