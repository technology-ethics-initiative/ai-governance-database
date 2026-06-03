#!/usr/bin/env python

import getopt
import json
import os
import subprocess
import sys

"""
    Combines the data in the .json file at dataPath with the data in the .json file at inPath.
    Priority is given to the data in inPath when there are duplicate articles.

    Args:
    - dataPath: [str] the name of the .json file which holds the new data to be added to the database
    - inPath: [str] the name of the .json file which holds the current data in the database

    Returns:
        A dictionary of id-item pairs where the id is the unique id of an article and the
        item is a dictionary containing descriptive information about the article
"""
def combine(dataPath, inPath):
    data_db = open(dataPath, 'r', encoding='utf-8')
    data = json.load(data_db)
    data_db.close()

    in_db = open(inPath, 'r', encoding='utf-8')
    database = json.load(in_db)
    in_db.close()

    for ID, item in data.items():
        if ID not in database:      # checks for duplicates using ID
            database[ID] = item
    
    return database
    
"""
    Generates a new .json file with the contents in database.

    Args:
    - database: [dict] dictionary of id-item pairs
    - newPath: [str] path (directory/file_name) to place the generated .json file in
"""
def generateNewDatabaseFiles(database, newPath):
    db = open(newPath, 'w')
    db.write(json.dumps(database, indent=2))
    db.flush()
    db.close()


def parseOptions():
    commandLineArgs = sys.argv[1:]
    flag = 0
    longOptions = ("out=", "in=", "path=", "help")
    options = {"out": None, "in": None, "path": None}
    shortOptions = "o:i:p:h"
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
        elif currArg in ("-i", "--in"):
            options["in"] = currVal
            if currVal == "":
                print("No current database path provided.")
                printHelp()
            elif not os.path.exists(currVal):
                print(f"Path {currVal} does not exist.")
                flag = 1
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
    if options["in"] == None:
        print("Current database path required.")
        flag = 1
    if options["out"] == None:
        print("Output path required.")
        flag = 1
    if flag == 1:
        printHelp()
    return options

def printHelp():
    print("Usage:\n\tpython transform.py --path /path/to/data --in /path/to/current/data --out /path/to/store/data\n\nOptions:\n\t-p,--path\tUse the specified path to specify the dataset CSV file containing the new data.\n\t-i,--in  \tUse the specified path to specify the current JSON database file.\n\t-o,--out\tUse the specified path to name the new output JSON database file.\n\t-h,--help\tDisplay this message.")
    exit(0)


if __name__ == "__main__":
    options = parseOptions()
    data_path = options["path"]
    in_path = options["in"]
    new_path = options["out"]

    if not new_path.endswith(".json"):
        print("The output file name must be a .json file.")
        print(f"Converting {new_path} file name to JSON...", end="")
        new_path = new_path[: new_path.rfind(".")] + ".json"
        print(f"converted file name: {new_path}!", end="\n\n")

    if in_path.endswith(".csv") or in_path.endswith(".xlsx"):
        print("The input file must be a .json file.")
        new_in_path = in_path[: in_path.rfind(".")] + "_converted.json"
        subprocess.run(["python", "transform.py", "--path", in_path, "--out", new_in_path])
        
        if not os.path.exists(new_in_path):
            print(f"Failed to convert {in_path} to JSON.")
            exit(0)
        in_path = new_in_path
        print()
    
    if in_path.endswith(".json"):
        converted_data_path = data_path[: data_path.rfind(".")] + "_converted.json"
        subprocess.run(["python", "transform.py", "--path", data_path, "--out", converted_data_path])
        
        if not os.path.exists(converted_data_path):
            print(f"Failed to convert {data_path} to JSON.")
            exit(0)
        data_path = converted_data_path
        print()

        print(f"Generating {new_path} by combining {data_path} and {in_path}...", end="")
        generateNewDatabaseFiles(combine(data_path, in_path), new_path)
        print("completed!")
    else:
        print(f"Current database file {in_path} is not recognized as a JSON file.")
