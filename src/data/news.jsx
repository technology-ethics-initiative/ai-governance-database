import database from "./database.json";
import news from "./csvjson.json";

/* Process database and news to generate:
   - a data dictionary for the general categories
   - a dictionary for each category's dropdown pages
*/

const categories = { // general categories: string representation in database (listed under 'type')
    news: "news",
    laws: "law",
    lawsuits: "lawsuit",
    regulations: "selfGovernance",
    solutions: "solution",
};

// list of dropdown pages
//const lawPages = ["United States", "China", "United Kingdom", "European Union", "India", "Russian Federation", "France", "Israel", "Germany", "Japan", "Australia", "Canada"];
//const lawsuitPages = ["OpenAI", "NVidia", "Google", "TikTok", "New York Times Co.", "Facebook", "DeepSeek", "Microsoft", "Bytedance", "Twitter", "X Corp", "DeepMind", "X.AI", "YouTube", "Apple"];

const dropCategories = { // categories with dropdowns: name of column with data for dropdown categories
    laws: "region",
    lawsuits: "company",
};


let data = { // data dictionary (keys except "all" must match that of 'categories' variable)
    all: [],
    news: [],
    laws: [],
    lawsuits: [],
    regulations: [],
    solutions: [],
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
        "NVidia": [],
        "Google": [],
        "TikTok": [],
        //"New York Times Co.": [],
        "Facebook": [],
        //"DeepSeek": [],
        "Microsoft": [],
        "Bytedance": [],
        "Twitter": [],
        //"X Corp": [],
        "DeepMind": [],
        //"X.AI": [],
        "YouTube": [],
        "Apple": [],
    },
}

function getItem(key) { // to parse news and get appropriate item (json)
    for(let i = 0; i < news.length; i++) {
        if(news[i].uniqueID == key) {
            return news[i];
        }
    }
    return [];
}

function parseDict(value) { // dictionary processing
    value = value.replaceAll("{'", '{"');
    value = value.replaceAll(", '", ', "');
    value = value.replaceAll("':", '":');
    return JSON.parse(value);
}

for (const key in database) { // temporary processing : combine data in database and news
    database[key].uniqueID = key;

    let item = getItem(key);
    if(!database[key].url && item && item.originalLink && item.originalLink != "") {
        database[key].url = item.originalLink;
    }
    /*
    if(item && item.concept_metadata) {
        try {
            database[key].concepts = JSON.parse(JSON.stringify(parseDict(item.concept_metadata)).toLowerCase());
            temp = {}
            for (const term in database[key].concepts) {
                if(database[key].concepts[term] > 0) {
                    temp[term] = database[key].concepts[term];
                }
            }
            database[key].concepts = temp;
        } catch {
        }
        
    }
    if(item && item.company_metadata) {
        try {
            database[key].companies = JSON.parse(JSON.stringify(parseDict(item.company_metadata)).toLowerCase());
        } catch {
        }
    }*/

    // populate data dictionary
    data.all.push(database[key]);
    if(database[key].type) {
        let type = database[key].type;
        for (const category in categories) {
            if(type == categories[category]) {
                //data.news.push(data[category].push(database[key]));
                data[category].push(database[key])
            }
        }
    }

    // populate pagesData dictionary
    for (const category in pagesData) {    // for each general category with dropdowns
        let category_keys = database[key][dropCategories[category]]
        if(category_keys) {
            for(const dropCategory in pagesData[category]) {    // for each dropdown category
                if(dropCategory in category_keys) {
                    pagesData[category][dropCategory].push(database[key])
                }
            }
        }
        
    }
}
console.log(data);

export {
    data,
    pagesData
};