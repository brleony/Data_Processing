# Name: Leony Brok
# Student number: 10767215
# Data source: https://opendata.cbs.nl/#/CBS/nl/dataset/82814NED/table?ts=1519084165675

import csv
import json

INPUT_CSV = 'sundata.csv'
OUTPUT_JSON = 'sundata.json'

if __name__ == "__main__":

    # open csv and json files, write data to json file
    with open(INPUT_CSV, 'r') as csvFile, open(OUTPUT_JSON, 'w') as jsonFile:

        # load data from csv file
        fieldnames = ("date", "sunshineHours")
        reader = csv.DictReader(csvFile, fieldnames)

        data = list(reader)
        for datum in data:
            datum["sunshineHours"] = int(datum["sunshineHours"]) / 10

        # write data to json file
        json.dump(data, jsonFile, indent = 4)
