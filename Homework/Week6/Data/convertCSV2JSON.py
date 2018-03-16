# Name: Leony Brok
# Student number: 10767215

import csv
import json

INPUT_CSV = 'religion.csv'
OUTPUT_JSON = 'religion.json'

if __name__ == "__main__":

    # open csv and json files, write data to json file
    with open(INPUT_CSV, 'r') as csvFile, open(OUTPUT_JSON, 'w') as jsonFile:

        # load data from csv file
        reader = csv.DictReader(csvFile, delimiter = ";")

        out = {}

        data = list(reader)
        for datum in data:
            regio = datum["Regio"]
            del datum["Regio"]

            for key in datum:
                datum[key] = int(datum[key])

            if regio not in out:
                out[regio] = []

            out[regio].append(datum)

        # write data to json file
        json.dump(out, jsonFile, indent = 4)
