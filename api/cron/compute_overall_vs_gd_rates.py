from collections import defaultdict
import logging
import math

logger = logging.getLogger("compute_overall_vs_gd_rates")
logger.setLevel(logging.INFO)

def bucket_overall_diff(diff):
    return max(5, int(math.ceil(diff / 5.0)) * 5)

async def main(db):
    logger.critical("compute_overall_vs_gd_rates - Start")

    engine_filter = "10.1.1/6.0.2"
    collection_name = "overall_vs_gd_rates"
    match_stats = defaultdict(lambda: defaultdict(int))

    cursor = db.matches.find({"engine": engine_filter})

    while await cursor.fetch_next:
        match = cursor.next_object()

        home_overall = match.get("homeOverall")
        away_overall = match.get("awayOverall")
        if home_overall is None or away_overall is None:
            continue

        home_score = match.get("homeScore", 0)
        away_score = match.get("awayScore", 0)

        diff = abs(home_overall - away_overall)
        overall_diff = bucket_overall_diff(diff)

        # Determine the better team and the performance
        if home_overall > away_overall:
            goal_diff = home_score - away_score
        elif away_overall > home_overall:
            goal_diff = away_score - home_score
        else:
            goal_diff = home_score - away_score  # Normal diff when same overall

        match_stats[overall_diff][goal_diff] += 1

    # Prepare final result
    output = []
    for overall_diff, goal_diffs in match_stats.items():
        total = sum(goal_diffs.values())
        for goal_diff, count in goal_diffs.items():
            output.append({
                "engine": engine_filter,
                "overall_difference": overall_diff,
                "goal_difference": goal_diff,
                "rate": round((count / total) * 100, 2)
            })

    await db[collection_name].delete_many({"engine": engine_filter})
    if output:
        await db[collection_name].insert_many(output)

    logger.critical("compute_overall_vs_gd_rates - Finished")
    return output