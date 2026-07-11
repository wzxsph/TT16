import { describe, expect, it } from "vitest";

import { QUESTIONS, type DimensionKey } from "../data/questions";
import { PROFILE_CODES, PROFILES, type TypeCode } from "../data/profiles";
import {
  DIMENSION_DEFINITIONS,
  scoreAssessment,
  type AssessmentAnswers,
} from "./scoring";

function filledAnswers(value: number): AssessmentAnswers {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, value]));
}

function letterForDimension(code: TypeCode, dimension: DimensionKey): string {
  const indexByDimension: Record<DimensionKey, number> = {
    RS: 0,
    HT: 1,
    DA: 2,
    PF: 3,
  };

  return code[indexByDimension[dimension]];
}

function answersForType(code: TypeCode): AssessmentAnswers {
  return Object.fromEntries(
    QUESTIONS.map((question) => {
      if (question.kind === "dimension") {
        const definition = DIMENSION_DEFINITIONS.find(
          (item) => item.key === question.dimension,
        );
        if (!definition) throw new Error(`Missing definition for ${question.dimension}`);

        const answer =
          letterForDimension(code, question.dimension) === definition.rightLetter ? 2 : -2;
        return [question.id, answer];
      }

      if (question.kind === "consistency") {
        const definition = DIMENSION_DEFINITIONS.find(
          (item) => item.key === question.comparisonDimension,
        );
        if (!definition) {
          throw new Error(`Missing definition for ${question.comparisonDimension}`);
        }

        const answer =
          letterForDimension(code, question.comparisonDimension) === definition.rightLetter
            ? 2
            : -2;
        return [question.id, answer];
      }

      return [question.id, 0];
    }),
  );
}

describe("TT16 assessment data", () => {
  it("contains exactly the expected 32 unique questions", () => {
    expect(QUESTIONS).toHaveLength(32);
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(32);
    expect(QUESTIONS.filter((question) => question.kind === "dimension")).toHaveLength(24);
    expect(QUESTIONS.filter((question) => question.kind === "risk")).toHaveLength(6);
    expect(QUESTIONS.filter((question) => question.kind === "consistency")).toHaveLength(2);
  });
});

describe("scoreAssessment type generation", () => {
  it("maps every answer to the left pole as RHDP", () => {
    const result = scoreAssessment(filledAnswers(-2));

    expect(result.typeCode).toBe("RHDP");
    expect(result.profile).toBe(PROFILES.RHDP);
    expect(result.dimensions.map((dimension) => dimension.chosenLetter).join("")).toBe(
      "RHDP",
    );
    expect(result.dimensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "RS", leftPercent: 100, rightPercent: 0 }),
        expect.objectContaining({ key: "HT", leftPercent: 100, rightPercent: 0 }),
        expect.objectContaining({ key: "DA", leftPercent: 100, rightPercent: 0 }),
        expect.objectContaining({ key: "PF", leftPercent: 100, rightPercent: 0 }),
      ]),
    );
    expect(result.stability).toBe("stable");
  });

  it("maps every answer to the right pole as STAF", () => {
    const result = scoreAssessment(filledAnswers(2));

    expect(result.typeCode).toBe("STAF");
    expect(result.profile).toBe(PROFILES.STAF);
    expect(result.dimensions.map((dimension) => dimension.chosenLetter).join("")).toBe(
      "STAF",
    );
    expect(result.dimensions.every((dimension) => dimension.rightPercent === 100)).toBe(true);
    expect(result.stability).toBe("stable");
  });

  it("constructs and resolves every one of the 16 profiles", () => {
    const resolvedCodes = PROFILE_CODES.map((code) => {
      const result = scoreAssessment(answersForType(code));
      expect(result.typeCode).toBe(code);
      expect(result.profile.code).toBe(code);
      expect(result.profile).toBe(PROFILES[code]);
      return result.typeCode;
    });

    expect(new Set(resolvedCodes)).toEqual(new Set(PROFILE_CODES));
  });

  it("uses the configured anchor on an exact 50/50 dimension", () => {
    const rightAnchor = filledAnswers(-2);
    Object.assign(rightAnchor, {
      Q01: -2,
      Q02: -2,
      Q03: -2,
      Q04: 2,
      Q05: 2,
      Q06: 2,
    });

    const rightAnchorResult = scoreAssessment(rightAnchor);
    const rightAnchorDimension = rightAnchorResult.dimensions.find(
      (dimension) => dimension.key === "RS",
    );

    expect(rightAnchorDimension).toEqual(
      expect.objectContaining({
        leftPercent: 50,
        rightPercent: 50,
        chosenLetter: "S",
        isBoundary: true,
      }),
    );
    expect(rightAnchorResult.typeCode).toBe("SHDP");
    expect(rightAnchorResult.stability).toBe("one_boundary");

    const neutralAnchor = filledAnswers(-2);
    Object.assign(neutralAnchor, {
      Q01: -2,
      Q02: -2,
      Q03: 2,
      Q04: 2,
      Q05: 0,
      Q06: 0,
    });

    const neutralAnchorDimension = scoreAssessment(neutralAnchor).dimensions.find(
      (dimension) => dimension.key === "RS",
    );
    expect(neutralAnchorDimension).toEqual(
      expect.objectContaining({
        leftPercent: 50,
        rightPercent: 50,
        chosenLetter: "R",
        isBoundary: true,
      }),
    );
  });
});

describe("scoreAssessment input handling and quality", () => {
  it("ignores null and illegal answers without mutating the input", () => {
    const answers: AssessmentAnswers = {
      Q01: null,
      Q02: 3,
      Q03: 1.5,
      Q04: Number.NaN,
      Q05: Number.POSITIVE_INFINITY,
    };
    const snapshot = { ...answers };

    const result = scoreAssessment(answers);

    expect(answers).toEqual(snapshot);
    expect(result.typeCode).toBe("RHDP");
    expect(result.quality.level).toBe("insufficient");
    expect(result.quality.answeredCount).toBe(0);
    expect(result.quality.unansweredQuestionIds).toContain("Q01");
    expect(result.quality.invalidAnswerIds).toEqual(
      expect.arrayContaining(["Q02", "Q03", "Q04", "Q05"]),
    );
    expect(scoreAssessment({ Q01: null }).dimensions).toEqual(
      scoreAssessment({}).dimensions,
    );
  });

  it("reports high quality for complete and internally consistent answers", () => {
    const quality = scoreAssessment(filledAnswers(-2)).quality;

    expect(quality).toEqual(
      expect.objectContaining({
        level: "high",
        answeredCount: 32,
        coveragePercent: 100,
        coreAnsweredCount: 24,
        coreCoveragePercent: 100,
        consistencyPercent: 100,
        meetsMinimum: true,
      }),
    );
  });

  it("reports medium quality when valid coverage is below 100%", () => {
    const answers = filledAnswers(-2);
    answers.Q25 = null;

    const quality = scoreAssessment(answers).quality;
    expect(quality.level).toBe("medium");
    expect(quality.answeredCount).toBe(31);
    expect(quality.meetsMinimum).toBe(true);
  });

  it("reports low quality at the 26-answer minimum", () => {
    const answers = filledAnswers(-2);
    for (const id of ["Q25", "Q26", "Q27", "Q28", "Q29", "Q30"]) {
      answers[id] = null;
    }

    const quality = scoreAssessment(answers).quality;
    expect(quality.level).toBe("low");
    expect(quality.answeredCount).toBe(26);
    expect(quality.coveragePercent).toBe(81);
    expect(quality.meetsMinimum).toBe(true);
  });

  it("reports insufficient quality below 26 answers or four answers per dimension", () => {
    const belowTotal = filledAnswers(-2);
    for (const id of ["Q25", "Q26", "Q27", "Q28", "Q29", "Q30", "Q31"]) {
      belowTotal[id] = null;
    }
    expect(scoreAssessment(belowTotal).quality).toEqual(
      expect.objectContaining({
        level: "insufficient",
        answeredCount: 25,
        meetsMinimum: false,
      }),
    );

    const belowDimension = filledAnswers(-2);
    belowDimension.Q01 = null;
    belowDimension.Q02 = null;
    belowDimension.Q03 = null;
    const dimensionQuality = scoreAssessment(belowDimension).quality;
    expect(dimensionQuality.level).toBe("insufficient");
    expect(dimensionQuality.answeredCount).toBe(29);
    expect(dimensionQuality.dimensionAnsweredCounts.RS).toBe(3);
    expect(dimensionQuality.meetsMinimum).toBe(false);
  });
});

describe("risk badges", () => {
  it("keeps all badge scores bounded and produces deterministic output", () => {
    const answers = Object.freeze(
      Object.fromEntries(
        QUESTIONS.map((question, index) => [question.id, (index % 5) - 2]),
      ) as AssessmentAnswers,
    );

    const first = scoreAssessment(answers);
    const second = scoreAssessment(answers);

    expect(first.badges).toHaveLength(6);
    expect(first.badges).toEqual(second.badges);
    expect(new Set(first.badges.map((badge) => badge.key)).size).toBe(6);

    for (const badge of first.badges) {
      expect(badge.score).toBeGreaterThanOrEqual(0);
      expect(badge.score).toBeLessThanOrEqual(100);
      expect(["low", "medium", "high"]).toContain(badge.level);
      expect(badge.name.length).toBeGreaterThan(0);
      expect(badge.levelLabel.length).toBeGreaterThan(0);
      expect(badge.advice.length).toBeGreaterThan(0);
    }
  });
});
