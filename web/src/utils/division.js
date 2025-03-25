export const divisions = [
  { number: 1, name: "Diamond", color: "rgb(59, 233, 248)" },
  { number: 2, name: "Platinum", color: "rgb(19, 211, 137)" },
  { number: 3, name: "Gold", color: "rgb(255, 210, 62)" },
  { number: 4, name: "Silver", color: "rgb(243, 243, 243)" },
  { number: 5, name: "Bronze", color: "rgb(253, 122, 0)" },
  { number: 6, name: "Iron", color: "rgb(134, 94, 63)" },
  { number: 7, name: "Stone", color: "rgb(183, 176, 156)" },
  { number: 8, name: "Ice", color: "rgb(176, 204, 225)" },
  { number: 9, name: "Spark", color: "rgb(255, 177, 54)" },
];

export const getDivisionColor = (division) => {
  return divisions.filter((d) => d.number === division).pop()?.color;
};

export const getDivisionName = (division) => {
  return divisions.filter((d) => d.number === division).pop()?.name;
};
