#!/usr/bin/env python3
__author__ = 'Darryl Cousins <darryljcousins@gmail.com>'

#NB Only 400 lines or 9000bytes can be imported at a time.

import sys
import re
import argparse
import fileinput
import csv

DEBUG = True
#DEBUG = False

# Capture any words in all caps, also capture start and end parenthesis if they
# exist.
allcaps_regex = r'[(]?\b[A-Z][A-Z]+\b[)]?'

# Capture words that contain quantity abbreviations, like 90KG, 12MM etc.
quant_regex = r'\b[0-9\/]*[BXMKL][XMLG]?[0-9]*\b'

exceptions = {
        'X': 'x',
        'TE': 'TE',
        'SE': 'SE',
        'LTD': 'Ltd',
        'PER': 'per',
        }


def find_matches(regex, test_str):
    matches = re.search(regex, test_str)
    if matches:
        return matches.group()
    return None


def get_result(word):

    # exceptions
    if word in exceptions.keys():
        return exceptions[word]

    # split words that contain a /, e.g. BRACE/NOISE
    if '/' in word :
        return '/'.join([get_result(part) for part in word.split('/')])

    # ignore anything without a vowel, e.g. DTS
    if set('aeiou').intersection(word.lower()):
        result = find_matches(allcaps_regex, word)
        if result:
            return result.title()

    # then tackle any measurement with quantity abbreviations
    else:
        result = find_matches(quant_regex, word)
        if result:
            return word.lower()

    return word


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
            prog='trial',
            description="""
            Reads csv file stream from sys.stdin and tidies description and
            prints a csv file to stdout.
            """)

    fieldnames = [
            'Code',
            'Description',
            ]
    reader = csv.DictReader(fileinput.input(), delimiter=',')
    writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames, delimiter=',')
    for row in reader:
        result = ''
        for word in row['Description'].split(' '):
            word = get_result(word)
            result += word + ' '

        if not DEBUG:
            writer.writerow({
                'Code': row['Code'],
                'Description': result,
                })
        else:
            sys.stdout.write('{code:25} {old:65} {description}\n'.format(
                code=row['Code'],
                description=result,
                old=row['Description'],
                ))
