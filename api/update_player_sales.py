import csv
from datetime import datetime

def update_sales_data(db):
    file_path = "player_sales_snapshot_2025-01-05.csv"
    sales_collection = db['sales']

    with open(file_path, mode='r', encoding='utf-8-sig') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Extract relevant fields
            sale_id = int(row['id'])
            overall = int(row['Overall'])
            age = int(row['Age'])
            positions = row['Postions'].split(",")

            # Update the document in the MongoDB collection
            sales_collection.update_one(
                {"_id": sale_id},
                {"$set": {"overall": overall, "age": age, "positions": positions}}
            )
            print(f"Updated sale ID {sale_id} with Overall: {overall} and Age: {age} and Positions: {positions}")
