# Name: Leony Brok
# Student number: 10767215
# Data source: https://opendata.cbs.nl/#/CBS/nl/dataset/82814NED/table?ts=1519084165675

import csv
import json

INPUT_CSV = 'sundata.txt'
OUTPUT_JSON = 'sundatajson.txt'

if __name__ == "__main__":

    # open files
    csvfile = open(INPUT_CSV, 'r')
    jsonfile = open(OUTPUT_JSON, 'w')

    # save data from csv file
    fieldnames = ("Weatherstation","Date","Sunshine")
    reader = csv.DictReader(csvfile, fieldnames)

    # write JSON to disk
    for row in reader:
        json.dump(row, jsonfile, indent = 4)
