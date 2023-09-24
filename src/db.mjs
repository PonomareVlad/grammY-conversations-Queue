import {MongoFetchClient} from "mongo-fetch";

export const {
    DB_NAME: name,
    DATA_API_URL: url,
    DATA_API_KEY: apiKey,
    DATA_SOURCE_NAME: source,
} = process.env;

export const db = new MongoFetchClient(source, {url, apiKey}).db(name);

export const users = db.collection("users");
