# Name: Leony Brok
# Student number: 10767215
# Data source: https://opendata.cbs.nl/#/CBS/nl/dataset/82814NED/table?ts=1519084165675

import csv
import json

INPUT_CSV = 'donordata.csv'
OUTPUT_JSON = 'donordata.txt'

if __name__ == "__main__":

    # open csv input
    input = open(INPUT_CSV)
    reader = csv.reader(input)

    data = list(reader)

    # write the JSON to disk
    with open(OUTPUT_JSON, 'w') as f:
        f.write(json.dumps(data))
