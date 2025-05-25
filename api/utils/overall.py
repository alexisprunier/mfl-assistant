

def calculate_team_overall(positions, players, modifiers):

    total = 0

    player_ids = [str(p["player"]) for p in positions]

    for player_id in player_ids:
        total += players[player_id][1]

    for modifier in modifiers:
        if modifier["target"]["type"] == "players" and "ids" in modifier["target"]:
            for m_id in modifier["target"]["ids"]:
                if str(m_id) in player_ids:
                    for value in modifier["values"]:
                        if value["field"] in ["ovr", "overall"]:
                            total += value["value"]

    return total