__author__ = 'Darryl Cousins <darryljcousins@gmail.com>'

import sys
import re
import argparse
import fileinput
import csv

regex = r'\b[A-Z]+[A-Z]{2,}\b'

def find_matches(test_str):
    matches = re.search(regex, test_str)

    if matches:
        return matches.group()
        sys.stdout.write('Match was found at {start}-{end}: {match}\n'.format(
            start = matches.start(),
            end = matches.end(),
            match = matches.group()))
    return None


def get_result(word):
    if set('aeiou').intersection(word.lower()):
        result = find_matches(word)
        if result:
            return result.title()
    return word


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='trial')
    parser.add_argument(
            'in',
            nargs='?',
            type=argparse.FileType('r'),
            default=sys.stdin,
            help='csv stream or object to parse'
            )
    parser.add_argument(
            'out',
            nargs='?',
            type=argparse.FileType('w'),
            default=sys.stdout,
            help='csv stream or object to output result'
            )
    args = parser.parse_args()

    for line in fileinput.input():
        sys.stdout.write(line + '\n')
    result = ''
    for word in mystring.split(' '):
        word = get_result(word)
        word = word.replace('MM', 'mm')
        word = word.replace('X', 'x')
        result += word + ' '
    sys.stdout.write(result + '\n')


    sys.stdout.write('===========================\n')
    sys.stdout.write('{}\n'.format(str(args)))
    sys.stdout.write('===========================\n')
