#!/usr/bin/env python

import ast
import csv
import getopt
import json
import os
import pandas as pd
import sys

"""
    Removes key-value pairs in item which have a value of 0.
    Finds the greatest value among the key-value pairs.

    Args:
    - data: [dict] tag-occurence pairs  (expected; other data formats may cause errors)
    
    Returns: a filtered dictionary, greatest value
"""
def processMetadata(data):
    try:
        item = ast.literal_eval(data)
    except (ValueError, SyntaxError):
        return {}
    
    filtered = {}
    for key, value in item.items():
        if value > 0:
            filtered[key] = value
    
    return filtered

"""
    Returns the greatest value among the key-value pairs for the dictionary.

    Args:
    - item: [dict] object
"""
def getMaxValue(item):
    max = 0
    for value in item.values():
        if value > max:
            max = value

    return max

"""
    Returns the subsection with the greatest occurence value.

    Args:
    - item: [dict] object containing article descriptors
    - sections: [list(str)] list of key names for the subsections to compare
"""
def getMaxSection(item, sections):
    max_section = sections[0]
    max_value = getMaxValue(item[max_section])

    for section in sections:
        max = getMaxValue(item[section])
        if max > max_value:
            max_section = section
            max_value = max

    if max_value == 0:
        max_section = None

    return max_section

"""
    Generates the primary type and secondary type among the given subsections.
    The types are chosen based on which subsection has the greatest occurence value.

    Args:
    - item: [dict] object containing article descriptors
    - sections: [list(str)] list of key names for the subsections to compare

    Returns: a dictionary with the primary type and secondary type key-value pairs added.
"""
def generateTypes(item, sections):
    primary_type = getMaxSection(item, sections)
    item["primaryType"] = primary_type

    if primary_type:
        sections.remove(primary_type)   # remove primary type section
        secondary_type = getMaxSection(item, sections)
        item["secondaryType"] = secondary_type
    else:
        item["secondaryType"] = None

    return item

"""
    Transforms the .csv file at databasePath to a .json formatted data structure

    Args:
    - databasePath : [str] the name of the .csv file which holds the data for the database

    Returns:
        A dictionary of id-item pairs where the id is the unique id of an article and the
        item is a dictionary containing descriptive information about the article
"""
def transform(databasePath):
    db = open(databasePath, 'r', encoding='utf-8')
    database = list(csv.DictReader(db))
    db.close()

    newDatabase = {}
    if databasePath.endswith(".csv"):
        for item in database:
            new_item = {}

            ID = item["Unique ID"]     # get unique ID

            new_item["title"] = item["Title"]               # transfer 'Title'
            new_item["author"] = item["Author"]             # transfer 'Author'
            new_item["publication"] = item["Publication"]   # transfer 'Publication'
            new_item["url"] = item["Original Link"]         # transfer 'Original Link'
            new_item["proquest"] = item["Proquest Link"]    # transfer 'Proquest Link'
            new_item["summary"] = item["Summary"]           # transfer 'Summary'

            # process & transfer 'Date', add 'Year'
            date = item["Date"]
            fields = date.split("-")
            if date and (len(fields) != 3 or len(fields[0]) != 4 or len(fields[1]) != 2 or len(fields[2]) != 2):
                print(f"\n\tArticle with ID {ID} has an unsupported date format: {date}. Please ensure all dates are in the format YYYY-MM-DD.")
                exit(0)
            
            new_item["date"] = date
            new_item["year"] = fields[0] if date else None

            # process & transfer 'Company / Organization'
            organization = item["Company / Organization"].split(", ")[0]
            new_item["organization"] = organization

            # process & transfer 'Region'
            new_item["region"] = processMetadata(item["Region"])

            # process & transfer 'U.S. State'
            new_item["usState"] = processMetadata(item["U.S. State"])
            

            # process & transfer 'Metadata_law'
            new_item["laws"] = processMetadata(item["Metadata_law"])
            
            # process & transfer 'Metadata_solution'
            new_item["solutions"] = processMetadata(item["Metadata_solution"])
                
            # process & transfer 'Metadata_board'
            new_item["boards"] = processMetadata(item["Metadata_board"])
            

            # process & transfer 'Metadata_company'
            new_item["company"] = processMetadata(item["Metadata_company"])
            
            # process & transfer 'Metadata_concept'
            new_item["concept"] = processMetadata(item["Metadata_concept"])

            # process & transfer 'Metadata_lawsuit'
            new_item["lawsuits"] = processMetadata(item["Metadata_lawsuit"])

            newDatabase[ID] = generateTypes(new_item, ["laws", "solutions", "boards", "lawsuits"])
        database = newDatabase

    else:
        print(f"Database file {databasePath} is not recognized as a .csv file!")
        exit(0)
    
    return database

"""
    Generates a new .json file with the contents in database.

    Args:
    - database: [dict] dictionary of id-item pairs
    - newPath: [str] path (directory/file_name) to place the generated .json file in
"""
def generateNewDatabaseFile(database, newPath):
    db = open(newPath, 'w')
    db.write(json.dumps(database, indent=2))
    db.flush()
    db.close()


def parseOptions():
    commandLineArgs = sys.argv[1:]
    flag = 0
    longOptions = ("out=", "path=", "help")
    options = {"out": None, "path": None}
    shortOptions = "o:p:h"
    try:
        args, vals = getopt.getopt(commandLineArgs, shortOptions, longOptions)
    except getopt.GetoptError as err:
        print(err)
        exit(0)
    for currArg, currVal in args:
        if currArg in ("-o", "--out"):
            if currVal == "":
                print("No output path provided.")
                printHelp()
            options["out"] = currVal
        elif currArg in ("-p", "--path"):
            options["path"] = currVal
            if currVal == "":
                print("No database path provided.")
                printHelp()
            elif not os.path.exists(currVal):
                print(f"Path {currVal} does not exist.")
                flag = 1
        elif currArg in ("-h", "--help"):
            printHelp()
    if options["path"] == None:
        print("Database path required.")
        flag = 1
    if options["out"] == None:
        print("Output path required.")
        flag = 1
    if flag == 1:
        printHelp()
    return options

def printHelp():
    print("Usage:\n\tpython transform.py --path /path/to/data --out /path/to/store/data\n\nOptions:\n\t-p,--path\tUse the specified path to find the dataset CSV or XLSX file.\n\t-o,--out\tUse the specified path to name the new output JSON database file.\n\t-h,--help\tDisplay this message.")
    exit(0)


if __name__ == "__main__":
    options = parseOptions()
    data_path = options["path"]
    new_path = options["out"]
    
    if not new_path.endswith(".json"):
        print("The output file name must be a .json file.")
        print(f"Converting {new_path} file name to JSON...", end="")
        new_path = new_path[: new_path.rfind(".")] + ".json"
        print(f"converted file name: {new_path}!")

    if data_path.endswith(".xlsx"):
        print(f"Converting {data_path} file to a CSV...", end="")
        data = pd.read_excel(data_path)
        data_path = data_path[:-5] + ".csv"
        data.to_csv(data_path, index=False, encoding='utf-8')
        print(f"converted file: {data_path}!")

    if data_path.endswith(".csv"):
        print(f"Generating {new_path} from {data_path}...", end="")
        generateNewDatabaseFile(transform(data_path), new_path)
        print("completed!")
    else:
        print(f"Database file {data_path} is not recognized as either a XLSX or CSV file.")
