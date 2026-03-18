import database from "./database.json";

function getLowered(item) {
    const lowered = {};
    for (const key in item) {
        const loweredKey = key.toLowerCase();
        lowered[loweredKey] = item[key];
    }
    return lowered;
}

let data = { // data dictionary (keys except "all" must match that of 'categories' variable)
    all: [],
    laws: [],
    lawsuits: [],
    boards: [],
    solutions: [],
};

const dropSections = { // categories with dropdowns: name of column with data for dropdown categories
    laws: "region",
    lawsuits: "company",
};

let pagesData = { // dropdown pages dictionary (keys must match that of 'dropCategories' variable)
    laws: {
        "United States": [],
        "China": [],
        "United Kingdom": [],
        "European Union": [],
        "India": [],
        "Russian Federation": [],
        "France": [],
        "Israel": [],
        "Germany": [],
        "Japan": [],
        "Australia": [],
        "Canada": [],
    },
    lawsuits: {
        "OpenAI": [],
        "Nvidia": [],
        "Google": [],
        "TikTok": [],
        "New York Times Co.": [],
        "Facebook": [],
        "DeepSeek": [],
        "Microsoft": [],
        "Bytedance": [],
        "Twitter": [],
        "X Corp": [],
        "DeepMind": [],
        "X.AI": [],
        "YouTube": [],
        "Apple": [],
    },
}



for (const [key, item] of Object.entries(database)) {
    item.uniqueID = key     // add unique ID to item dictionary

    // populate data dictionary
    data.all.push(item);

    if (item.primaryType) {
        data[item.primaryType].push(item);

        if (Object.keys(dropSections).includes(item.primaryType)) {
            for (const tag of Object.keys(item[dropSections[item.primaryType]])) {
                if (pagesData[item.primaryType][tag]) {
                    pagesData[item.primaryType][tag].push(item)
                }
            }
        }

        if (item.secondaryType) {
            data[item.secondaryType].push(item);

            if (Object.keys(dropSections).includes(item.secondaryType)) {
            for (const tag of Object.keys(item[dropSections[item.secondaryType]])) {
                if (pagesData[item.secondaryType][tag]) {
                    pagesData[item.secondaryType][tag].push(item)
                }
            }
        }
        }
    }

    database[key].region = getLowered(database[key].region);
    database[key].company = getLowered(database[key].company);
    database[key].concept = getLowered(database[key].concept);
}



export {
    data,
    pagesData
};
