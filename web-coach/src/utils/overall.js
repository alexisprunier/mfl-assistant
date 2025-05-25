export function calculateTeamOverall(positions, players, modifiers) {
  let total = 0;

  // Get player IDs from positions array
  const playerIds = positions.map((p) => String(p.player));

  // Sum base player values (assuming players is an object with playerId keys and [something, value] as value)
  playerIds.forEach((playerId) => {
    if (players[playerId]) {
      total += players[playerId][1];
    }
  });

  // Add modifiers if they target players in this lineup
  modifiers.forEach((modifier) => {
    const target = modifier.target;
    if (target.type === "players" && Array.isArray(target.ids)) {
      target.ids.forEach((modId) => {
        if (playerIds.includes(String(modId))) {
          modifier.values.forEach((value) => {
            if (value.field === "ovr" || value.field === "overall") {
              total += value.value;
            }
          });
        }
      });
    }
  });

  return total;
}
