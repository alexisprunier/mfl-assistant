export const positions = [
  { name: "GK" },
  { name: "RB" },
  { name: "LB" },
  { name: "CB" },
  { name: "RWB" },
  { name: "LWB" },
  { name: "CDM" },
  { name: "RM" },
  { name: "LM" },
  { name: "CM" },
  { name: "CAM" },
  { name: "RW" },
  { name: "LW" },
  { name: "CF" },
  { name: "ST" },
];

export const scarcity = [
  { name: "Common", overallMin: 1, overallMax: 64, color: "#9f9f9f" },
  { name: "Uncommon", overallMin: 65, overallMax: 74, color: "#71ff30" },
  { name: "Rare", overallMin: 75, overallMax: 84, color: "#0047ff" },
  { name: "Legendary", overallMin: 85, overallMax: 99, color: "#fa53ff" },
];

export const positionAttributes = {
  "ST": { "passing": 0.10, "shooting": 0.46, "defense": 0.00, "dribbling": 0.29, "pace": 0.10, "physical": 0.05, "goalkeeping": 0.00 },
  "CF": { "passing": 0.24, "shooting": 0.23, "defense": 0.00, "dribbling": 0.40, "pace": 0.13, "physical": 0.00, "goalkeeping": 0.00 },
  "LW": { "passing": 0.24, "shooting": 0.23, "defense": 0.00, "dribbling": 0.40, "pace": 0.13, "physical": 0.00, "goalkeeping": 0.00 },
  "RW": { "passing": 0.24, "shooting": 0.23, "defense": 0.00, "dribbling": 0.40, "pace": 0.13, "physical": 0.00, "goalkeeping": 0.00 },
  "CAM": { "passing": 0.34, "shooting": 0.21, "defense": 0.00, "dribbling": 0.38, "pace": 0.07, "physical": 0.00, "goalkeeping": 0.00 },
  "CM": { "passing": 0.43, "shooting": 0.12, "defense": 0.10, "dribbling": 0.29, "pace": 0.00, "physical": 0.06, "goalkeeping": 0.00 },
  "LM": { "passing": 0.43, "shooting": 0.12, "defense": 0.10, "dribbling": 0.29, "pace": 0.00, "physical": 0.06, "goalkeeping": 0.00 },
  "RM": { "passing": 0.43, "shooting": 0.12, "defense": 0.10, "dribbling": 0.29, "pace": 0.00, "physical": 0.06, "goalkeeping": 0.00 },
  "CDM": { "passing": 0.28, "shooting": 0.00, "defense": 0.40, "dribbling": 0.17, "pace": 0.00, "physical": 0.15, "goalkeeping": 0.00 },
  "LWB": { "passing": 0.19, "shooting": 0.00, "defense": 0.44, "dribbling": 0.17, "pace": 0.10, "physical": 0.10, "goalkeeping": 0.00 },
  "RWB": { "passing": 0.19, "shooting": 0.00, "defense": 0.44, "dribbling": 0.17, "pace": 0.10, "physical": 0.10, "goalkeeping": 0.00 },
  "LB": { "passing": 0.19, "shooting": 0.00, "defense": 0.44, "dribbling": 0.17, "pace": 0.10, "physical": 0.10, "goalkeeping": 0.00 },
  "RB": { "passing": 0.19, "shooting": 0.00, "defense": 0.44, "dribbling": 0.17, "pace": 0.10, "physical": 0.10, "goalkeeping": 0.00 },
  "CB": { "passing": 0.05, "shooting": 0.00, "defense": 0.64, "dribbling": 0.09, "pace": 0.02, "physical": 0.20, "goalkeeping": 0.00 },
  "GK": { "passing": 0.00, "shooting": 0.00, "defense": 0.00, "dribbling": 0.00, "pace": 0.00, "physical": 0.00, "goalkeeping": 1.00 }
};

export const familiarity = {
  "GK": { "GK": 1, "CB": 4, "RB": 4, "LB": 4, "RWB": 4, "LWB": 4, "CDM": 4, "CM": 4, "CAM": 4, "RM": 4, "LM": 4, "RW": 4, "LW": 4, "CF": 4, "ST": 4 },
  "CB": { "GK": 4, "CB": 1, "RB": 3, "LB": 3, "RWB": 4, "LWB": 4, "CDM": 3, "CM": 4, "CAM": 4, "RM": 4, "LM": 4, "RW": 4, "LW": 4, "CF": 4, "ST": 4 },
  "RB": { "GK": 4, "CB": 3, "RB": 1, "LB": 3, "RWB": 2, "LWB": 4, "CDM": 4, "CM": 4, "CAM": 4, "RM": 3, "LM": 4, "RW": 4, "LW": 4, "CF": 4, "ST": 4 },
  "LB": { "GK": 4, "CB": 3, "RB": 3, "LB": 1, "RWB": 4, "LWB": 2, "CDM": 4, "CM": 4, "CAM": 4, "RM": 4, "LM": 3, "RW": 4, "LW": 4, "CF": 4, "ST": 4 },
  "RWB": { "GK": 4, "CB": 4, "RB": 2, "LB": 4, "RWB": 1, "LWB": 3, "CDM": 4, "CM": 4, "CAM": 4, "RM": 3, "LM": 4, "RW": 3, "LW": 4, "CF": 4, "ST": 4 },
  "LWB": { "GK": 4, "CB": 4, "RB": 4, "LB": 2, "RWB": 3, "LWB": 1, "CDM": 4, "CM": 4, "CAM": 4, "RM": 4, "LM": 3, "RW": 4, "LW": 3, "CF": 4, "ST": 4 },
  "CDM": { "GK": 4, "CB": 3, "RB": 4, "LB": 4, "RWB": 4, "LWB": 4, "CDM": 1, "CM": 2, "CAM": 3, "RM": 4, "LM": 4, "RW": 4, "LW": 4, "CF": 4, "ST": 4 },
  "CM": { "GK": 4, "CB": 4, "RB": 4, "LB": 4, "RWB": 4, "LWB": 4, "CDM": 2, "CM": 1, "CAM": 2, "RM": 3, "LM": 3, "RW": 4, "LW": 4, "CF": 4, "ST": 4 },
  "CAM": { "GK": 4, "CB": 4, "RB": 4, "LB": 4, "RWB": 4, "LWB": 4, "CDM": 3, "CM": 2, "CAM": 1, "RM": 4, "LM": 4, "RW": 4, "LW": 4, "CF": 2, "ST": 4 },
  "RM": { "GK": 4, "CB": 4, "RB": 3, "LB": 4, "RWB": 3, "LWB": 4, "CDM": 4, "CM": 3, "CAM": 4, "RM": 1, "LM": 3, "RW": 2, "LW": 4, "CF": 4, "ST": 4 },
  "LM": { "GK": 4, "CB": 4, "RB": 4, "LB": 3, "RWB": 4, "LWB": 3, "CDM": 4, "CM": 3, "CAM": 4, "RM": 3, "LM": 1, "RW": 4, "LW": 2, "CF": 4, "ST": 4 },
  "RW": { "GK": 4, "CB": 4, "RB": 4, "LB": 4, "RWB": 3, "LWB": 4, "CDM": 4, "CM": 4, "CAM": 4, "RM": 2, "LM": 4, "RW": 1, "LW": 3, "CF": 4, "ST": 4 },
  "LW": { "GK": 4, "CB": 4, "RB": 4, "LB": 4, "RWB": 4, "LWB": 3, "CDM": 4, "CM": 4, "CAM": 4, "RM": 4, "LM": 2, "RW": 3, "LW": 1, "CF": 4, "ST": 4 },
  "CF": { "GK": 4, "CB": 4, "RB": 4, "LB": 4, "RWB": 4, "LWB": 4, "CDM": 4, "CM": 4, "CAM": 2, "RM": 4, "LM": 4, "RW": 4, "LW": 4, "CF": 1, "ST": 2 },
  "ST": { "GK": 4, "CB": 4, "RB": 4, "LB": 4, "RWB": 4, "LWB": 4, "CDM": 4, "CM": 4, "CAM": 4, "RM": 4, "LM": 4, "RW": 4, "LW": 4, "CF": 2, "ST": 1 }
}

export const getOverallColor = (overall) => {
  for (let i = 0; i < scarcity.length; i++) {
    if (overall <= scarcity[i].overallMax) {
      return scarcity[i].color;
    }
  }

  return "black";
}

export const getCalculatedOverall = (player, position) => {
  let overall = 0;

  Object.keys(positionAttributes[position]).map((a) => {
    overall += positionAttributes[position][a] * player[a];
  });

  overall = Math.round(overall);

  if (player.positions.indexOf(position) !== 0) {
    if (player.positions.indexOf(position) > 0) {
      overall += -1;
    } else {
      let f = familiarity[player.positions[0]][position];

      if (f === 2) {
        overall += -5;
      } else if (f === 3) {
        overall += -8;
      } else {
        overall += -20;
      }
    }
  }

  return overall;
}