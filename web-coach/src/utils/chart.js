import { dateToMonthString } from "utils/date.js";

export const sortDataset = (dataset) => {
  return Object.keys(dataset)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = dataset[key];
      return accumulator;
    }, {});
}

export const fillMonthlyDataset = (dataset) => {
  const minMonth = Object.keys(dataset).sort((a, b) => b.localeCompare(a)).pop();
  const maxMonth = Object.keys(dataset).sort((a, b) => a.localeCompare(b)).pop();

  if (minMonth && maxMonth) {
    const minDate = new Date(minMonth);
    const maxDate = new Date(maxMonth);

    let date = minDate;

    while (date < maxDate) {
      let month = dateToMonthString(date);

      if (!dataset[month]) {
        dataset[month] = 0;
      }

      date.setMonth(date.getMonth() + 1);
    }
  }

  return dataset;
};

export const computeLinearRegression = (dataset) => {
    const xValues = dataset.map((p) => p.x);
    const yValues = dataset.map((p) => p.y);

    const n = xValues.length;

    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        denominator += Math.pow(xValues[i] - xMean, 2);
    }

    const m = numerator / denominator;
    const b = yMean - m * xMean;

    return { m, b };
}