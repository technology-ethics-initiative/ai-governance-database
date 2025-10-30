import database from "./database.json";

let data = {
    all: [],
    news: [],
    laws: [],
    lawsuits: [],
    regulations: [],
    // technical solutions
}

const types = {
    news: "news",
    laws: "law",
    lawsuits: "lawsuit",
    regulations: "selfGovernance",
    solutions: "tbd",
}

for (const key in database) {
    database[key].uniqueID = key;
    if(database[key].region) {
        database[key].region = JSON.parse(JSON.stringify(database[key].region).toLowerCase());
    }
    data.all.push(database[key]);

    if(database[key].type) {
        let type = database[key].type;
        if(type == types.news) { data.news.push(database[key]); }
        else if(type == types.laws) { data.laws.push(database[key]); }
        else if(type == types.lawsuits) { data.lawsuits.push(database[key]); }
        else if(type == types.regulations) { data.regulations.push(database[key]); }
        else { /* technical solutions */ }
    }
}

export default data;