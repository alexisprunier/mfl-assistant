from bson import ObjectId
import logging
from collections import defaultdict
from utils.overall import calculate_team_overall

logger = logging.getLogger("compute_formation_meta")
logger.setLevel(logging.INFO)


async def main(db):
    logger.critical("Start compute_formation_meta")
    
    engines = await db.matches.distinct("engine")

    for engine in engines:
        matches = await db.matches.find({
            "engine": engine,
            "$or": [
                {"status": "ENDED"},
                {"status": {"$exists": False}}
            ]
        }).to_list(None)

        formation_stats = defaultdict(lambda: {"victories": 0, "draws": 0, "defeats": 0, "engine": engine})

        for match in matches:
            if 'homePositions' not in match or 'awayPositions' not in match:
                continue

            # Calculate the overall ratings for both teams
            home_total_overall = calculate_team_overall(match['homePositions'], match['players'], match['modifiers'])
            away_total_overall = calculate_team_overall(match['awayPositions'], match['players'], match['modifiers'])

            # Skip matches where the overall difference exceeds 10
            if abs(home_total_overall - away_total_overall) > 20:
                continue

            # Get the formations
            home_formation = match['homeFormation']
            away_formation = match['awayFormation']

            # Determine the result
            if match['homeScore'] > match['awayScore']:
                result = 'home'
            elif match['homeScore'] < match['awayScore']:
                result = 'away'
            else:
                result = 'draw'

            # Track the result in the statistics
            if result == 'home':
                formation_stats[(home_formation, away_formation)]['victories'] += 1
                formation_stats[(away_formation, home_formation)]['defeats'] += 1
            elif result == 'away':
                formation_stats[(home_formation, away_formation)]['defeats'] += 1
                formation_stats[(away_formation, home_formation)]['victories'] += 1
            else:
                formation_stats[(home_formation, away_formation)]['draws'] += 1
                formation_stats[(away_formation, home_formation)]['draws'] += 1

        result = [{
            "formation1": key[0], 
            "formation2": key[1], 
            "victories": value['victories'], 
            "draws": value['draws'],
            "defeats": value['defeats'], 
            "engine": value['engine']
        } for key, value in formation_stats.items()]

        await db.formation_metas.delete_many({"engine": engine})

        if result:
            await db.formation_metas.insert_many(result)

    return result
