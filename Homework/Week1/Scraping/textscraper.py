#!/usr/bin/env python
# Name: Leony Brok
# Student number: 10767215
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extracts a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry contains the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    number_of_series = 50

    # Make empty matrix to hold series' data.
    series = [[] for column in range(number_of_series)]

    # Find series' titles.
    for i, title in enumerate(dom.find_all("h3", class_="lister-item-header", limit=number_of_series)):
        series[i].append(title.a.get_text(strip=True))

    # Find series' ratings.
    for i, rating in enumerate(dom.find_all("div", class_="inline-block ratings-imdb-rating", limit=number_of_series)):
        series[i].append(rating.strong.get_text(strip=True))

    # Find series' genre.
    for i, genre in enumerate(dom.find_all("span", class_="genre", limit=number_of_series)):
        series[i].append(genre.get_text(strip=True))

    # Find series' actors.
    for i, div in enumerate(dom.find_all("div", class_="lister-item-content", limit=number_of_series)):
        for paragraph in div.find_all("p"):
            # Get the p with an empty string as class.
            if paragraph.attrs["class"] == [""]:
                actors = []
                # Get all actors and actresses.
                for anchor in paragraph.find_all("a"):
                    actors.append(anchor.get_text(strip=True))
                series[i].append(", ".join(actors))

    # Find series' runtime.
    for i, runtime in enumerate(dom.find_all("span", class_="runtime", limit=number_of_series)):
        # Get only the runtime digits.
        runtime_digits = "".join([i for i in runtime.get_text(strip=True) if i.isdigit()])
        series[i].append(runtime_digits)

    return series


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # Write tvseries to csv file.
    writer.writerows(tvseries)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
