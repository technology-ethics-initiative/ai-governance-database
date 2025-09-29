import database from './database.json';

let news = [];
    for (const key in database) {
    database[key].uniqueID = key;
    if(database[key].region) {
        database[key].region = JSON.parse(JSON.stringify(database[key].region).toLowerCase());
    }
    news.push(database[key]);
}

export default news;