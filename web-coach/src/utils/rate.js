const bucketOverallDiff = (diff) => Math.max(5, Math.ceil(diff / 5) * 5);

export const computeMatchRate = (match, overallVsGdRates, home = true) => {
  if (!overallVsGdRates || !Array.isArray(overallVsGdRates)) return null;

  const { homeOverall, awayOverall, homeScore = 0, awayScore = 0 } = match;

  if (homeOverall == null || awayOverall == null) return null;

  const diff = Math.abs(homeOverall - awayOverall);
  const overallDiff = bucketOverallDiff(diff);

  const teamIsHome = home;
  const resultGoalDiff = teamIsHome
    ? homeScore - awayScore
    : awayScore - homeScore;

  // Filter worst-case results
  const relevantRates = overallVsGdRates.filter(
    (entry) =>
      entry.overallDifference === overallDiff &&
      ((home && entry.goalDifference < 0) ||
        (!home && entry.goalDifference > 0))
  );

  const worstRateSum = relevantRates.reduce(
    (sum, entry) => sum + entry.rate,
    0
  );

  // Add half of the exact result's rate (if it exists)
  const exactMatch = overallVsGdRates.find(
    (entry) =>
      entry.overallDifference === overallDiff &&
      entry.goalDifference === resultGoalDiff
  );

  const halfExactRate = exactMatch ? exactMatch.rate / 2 : 0;

  const totalRate = worstRateSum + halfExactRate;

  // Divide by 10 and round to 1 decimal place
  return Math.round((totalRate / 10) * 10) / 10;
};
