import getopt
import json
import os
import sys
import tkinter as tk
from tkinter import messagebox

"""
    Removes key-value pairs in item which have a value of 0.
    Finds the greatest value among the key-value pairs.

    Args:
    - item: [dict] tag-occurence pairs
    
    Returns: a filtered dictionary, greatest value
"""
def processMetadata(item):
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
    Generates a new .json file with the contents in database.

    Args:
    - database: [dict] dictionary of id-item pairs
    - newPath: [str] path (directory/file_name) to place the generated .json file in
"""
def generateNewDatabaseFile(newDatabase, newPath):
    db = open(newPath, 'w')
    db.write(json.dumps(newDatabase, indent=2))
    db.flush()
    db.close()

"""
    Verifies the format of user input values and, if appropriate,
    returns a dictionary item containing descriptive information about the article.

    Args
    - database: [dict] dictionary of id-item pairs
"""
def processInput(database):
    # Get user input from the entry fields
    id = id_entry.get()
    title = title_entry.get()
    author = author_entry.get()
    date = date_entry.get()
    publication = publication_entry.get()
    state = state_entry.get()
    url = url_entry.get()
    proquest = proquest_entry.get()
    summary = summary_entry.get()
    organization = organization_entry.get()
    region = region_entry.get()
    laws = law_entry.get()
    solutions = solution_entry.get()
    boards = board_entry.get()
    company = company_entry.get()
    concept = concept_entry.get()
    
    # Verify user input     (necessary fields & valid JSON format)
    isError = False
    errorString = ""
    if not (id and title):      # requires id and title
        isError = True
        errorString += "'Unique ID' and 'Title' fields are required!\n"
    if id in database.keys():   # rejects duplicates
        isError = True
        errorString = "An article with this ID currently exists in the database. Please recheck the ID.\n"
    try:    # region dictionary
        region = json.loads(region)
    except Exception as e:
        isError = True
        print(f"Error: {e}")
        errorString += "Please recheck the formatting for the 'Region' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"
    if state:
        try:    # state dictionary
            state = json.loads(state)
        except Exception as e:
            isError = True
            print(f"Error: {e}")
            errorString += "Please recheck the formatting for the 'U.S. State' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"    
    try:    # metadata_law dictionary
        laws = json.loads(laws)
    except Exception as e:
        isError = True
        print(f"Error: {e}")
        errorString += "Please recheck the formatting for the 'Law Metadata' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"
    try:    # metadata_solution dictionary
        solutions = json.loads(solutions)
    except Exception as e:
        isError = True
        print(f"Error: {e}")
        errorString += "Please recheck the formatting for the 'Solution Metadata' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"
    try:    # metadata_board dictionary
        boards = json.loads(boards)
    except Exception as e:
        isError = True
        print(f"Error: {e}")
        errorString += "Please recheck the formatting for the 'Board Metadata' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"
    try:    # metadata_company dictionary
        company = json.loads(company)
    except Exception as e:
        isError = True
        print(f"Error: {e}")
        errorString += "Please recheck the formatting for the 'Company Metadata' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"
    try:    # metadata_concept dictionary
        concept = json.loads(concept)
    except Exception as e:
        isError = True
        print(f"Error: {e}")
        errorString += "Please recheck the formatting for the 'Concept Metadata' dictionary! It should be in JSON format (i.e. {\"key\": value, \"key\":value, ...}).\n"

    if isError:
        messagebox.showerror("Error", errorString)
        return None
        
    else:
        messagebox.showinfo("Success", f"Registration successful for {id}: {title}!\n")
        new_item = {}
        new_item["id"] = id
        new_item["title"] = title
        new_item["author"] = author
        new_item["date"] = date
        new_item["publication"] = publication
        new_item["usState"] = state
        new_item["url"] = url
        new_item["proquest"] = proquest
        new_item["summary"] = summary
        new_item["organization"] = organization
        new_item["region"] = processMetadata(region)
        new_item["laws"] = processMetadata(laws)
        new_item["solutions"] = processMetadata(solutions)
        new_item["boards"] = processMetadata(boards)
        new_item["company"] = processMetadata(company)
        new_item["concept"] = processMetadata(concept)
        return new_item
        

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
    print("Usage:\n\tpython add_article.py --path /path/to/data --out /path/to/store/data\n\nOptions:\n\t-p,--path\tUse the specified path to find the database JSON file.\n\t-o,--out\tUse the specified path to output a new JSON database file.\n\t-h,--help\tDisplay this message.")
    exit(0)

"""
    Adds the new article to the database and
    generates a new .json file with the contents.
"""
def addArticle(data_path, new_path):
    database = None

    if data_path.endswith(".json"):
        try:
            with open(data_path, 'r') as file:
                database = json.load(file)
        except FileNotFoundError:
            print(f"Error: The file '{data_path}' was not found.")
        except json.JSONDecodeError:
            print("Error: Failed to decode JSON from the file (invalid JSON format).")
        except Exception as e:
            print(f"Error: {e}")
        
        new_item = processInput(database)
        if new_item:
            ID = new_item.pop("id")
            database[ID] = generateTypes(new_item, ["laws", "solutions", "boards"])
            generateNewDatabaseFile(database, new_path)
            print(f"Generated {new_path} with article {ID}: {new_item["title"]} from {data_path}!")
            exit(0)
    else:
        print(f"Database file {data_path} is not recognized as a JSON file.")
        exit(0)

# -- Interface --
if __name__ == "__main__":
    options = parseOptions()
    data_path = options["path"]
    new_path = options["out"]

    root = tk.Tk()  # main window
    root.title("Article Addition Form")
    root.geometry('500x600') # Sets the size of the window

    # Inputs: Labels and Entry Fields (grid layout)
    tk.Label(root, text="Unique ID: ").grid(row=0, column=0, padx=10, pady=5)    # unique id
    id_entry = tk.Entry(root)
    id_entry.grid(row=0, column=1, padx=10, pady=5)

    tk.Label(root, text="Title: ").grid(row=1, column=0, padx=10, pady=5)        # title
    title_entry = tk.Entry(root)
    title_entry.grid(row=1, column=1, padx=10, pady=5)

    tk.Label(root, text="Author: ").grid(row=2, column=0, padx=10, pady=5)        # author
    author_entry = tk.Entry(root)
    author_entry.grid(row=2, column=1, padx=10, pady=5)

    tk.Label(root, text="Date: ").grid(row=3, column=0, padx=10, pady=5)        # date
    date_entry = tk.Entry(root)
    date_entry.grid(row=3, column=1, padx=10, pady=5)

    tk.Label(root, text="Publication: ").grid(row=4, column=0, padx=10, pady=5)        # publication
    publication_entry = tk.Entry(root)
    publication_entry.grid(row=4, column=1, padx=10, pady=5)

    tk.Label(root, text="U.S. State: ").grid(row=5, column=0, padx=10, pady=5)        # u.s. state
    state_entry = tk.Entry(root)
    state_entry.grid(row=5, column=1, padx=10, pady=5)

    tk.Label(root, text="Original Link: ").grid(row=6, column=0, padx=10, pady=5)        # original link
    url_entry = tk.Entry(root)
    url_entry.grid(row=6, column=1, padx=10, pady=5)

    tk.Label(root, text="Proquest Link: ").grid(row=7, column=0, padx=10, pady=5)        # proquest link
    proquest_entry = tk.Entry(root)
    proquest_entry.grid(row=7, column=1, padx=10, pady=5)

    tk.Label(root, text="Summary: ").grid(row=8, column=0, padx=10, pady=5)        # summary
    summary_entry = tk.Entry(root)
    summary_entry.grid(row=8, column=1, padx=10, pady=5)

    tk.Label(root, text="Company / Organization: ").grid(row=9, column=0, padx=10, pady=5)        # company/organization
    organization_entry = tk.Entry(root)
    organization_entry.grid(row=9, column=1, padx=10, pady=5)

    tk.Label(root, text="Region: ").grid(row=10, column=0, padx=10, pady=5)        # region [dict]
    region_entry = tk.Entry(root)
    region_entry.grid(row=10, column=1, padx=10, pady=5)

    tk.Label(root, text="Law Metadata: ").grid(row=11, column=0, padx=10, pady=5)        # metadata_law [dict]
    law_entry = tk.Entry(root)
    law_entry.grid(row=11, column=1, padx=10, pady=5)

    tk.Label(root, text="Solution Metadata: ").grid(row=12, column=0, padx=10, pady=5)        # metadata_solution [dict]
    solution_entry = tk.Entry(root)
    solution_entry.grid(row=12, column=1, padx=10, pady=5)

    tk.Label(root, text="Board Metadata: ").grid(row=13, column=0, padx=10, pady=5)        # metadata_board [dict]
    board_entry = tk.Entry(root)
    board_entry.grid(row=13, column=1, padx=10, pady=5)

    tk.Label(root, text="Company Metadata: ").grid(row=14, column=0, padx=10, pady=5)        # metadata_company [dict]
    company_entry = tk.Entry(root)
    company_entry.grid(row=14, column=1, padx=10, pady=5)

    tk.Label(root, text="Concept Metadata: ").grid(row=15, column=0, padx=10, pady=5)        # metadata_concept [dict]
    concept_entry = tk.Entry(root)
    concept_entry.grid(row=15, column=1, padx=10, pady=5)

    # Create a Submit Button
    add_button = tk.Button(root, text="Add Article", command=lambda: addArticle(data_path, new_path))
    add_button.grid(row=16, column=1, pady=10)

    # Run the application loop
    root.mainloop()
