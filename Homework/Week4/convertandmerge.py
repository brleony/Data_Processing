# Name: Leony Brok
# Student number: 10767215

import csv
import json

INPUT_CSV_TOURISM = 'tourismdata.csv'
INPUT_CSV_GINI = 'ginidata.csv'
OUTPUT_JSON = 'tourismginidata.json'

if __name__ == "__main__":

    # open csv and json files, write data to json file
    with open(INPUT_CSV_TOURISM, 'r') as tourismCsv, open(INPUT_CSV_GINI, 'r') as giniCsv, open(OUTPUT_JSON, 'w') as mergedFile:

        # put tourism data in list
        tourismFieldnames = ("year", "country", "unit", "duration", "partner", "tourismValue")
        tourismReader = csv.DictReader(tourismCsv, tourismFieldnames)
        tourismData = list(tourismReader)

        # put gini coefficient data in list
        giniFieldnames = ("year", "country", "unit", "giniValue")
        giniReader = csv.DictReader(giniCsv, giniFieldnames)
        giniData = list(giniReader)

        # merge and write to json
        mergedData = giniData + tourismData
        json.dump(mergedData, mergedFile, indent = 4)
