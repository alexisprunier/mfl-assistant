from bson import ObjectId
import logging
from collections import defaultdict
from utils.overall import calculate_team_overall

logger = logging.getLogger("compute_formation_meta")
logger.setLevel(logging.INFO)


def make_hashable(obj):
    if isinstance(obj, dict):
        # Sort dict items so that order doesn't affect the hash
        return tuple((k, make_hashable(v)) for k, v in sorted(obj.items()))
    elif isinstance(obj, list):
        return tuple(make_hashable(i) for i in obj)
    else:
        return obj  # assume already hashable


async def main(db):
    logger.critical("Start compute_formation_meta")
    
    engines = await db.matches.distinct("engine")

    for engine in engines:
        if engine is None:
            continue

        logger.critical("compute_formation_meta for engine: " + engine)
        formation_stats = defaultdict(lambda: {"victories": 0, "draws": 0, "defeats": 0, "engine": engine})

        cursor = db.matches.find({
            "engine": engine,
            "$or": [
                {"status": "ENDED"},
                {"status": {"$exists": False}}
            ]
        }).batch_size(50)

        async for match in cursor:
            if 'homePositions' not in match or 'awayPositions' not in match:
                continue

            home_total_overall = calculate_team_overall(match['homePositions'], match['players'], match.get('modifiers'))
            away_total_overall = calculate_team_overall(match['awayPositions'], match['players'], match.get('modifiers'))

            if abs(home_total_overall - away_total_overall) > 20:
                continue

            home_formation = match.get('homeFormation')
            away_formation = match.get('awayFormation')

            if home_formation is None or away_formation is None:
                continue

            if match.get('homeScore', 0) > match.get('awayScore', 0):
                result = 'home'
            elif match.get('homeScore', 0) < match.get('awayScore', 0):
                result = 'away'
            else:
                result = 'draw'

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