import { MongoClient } from "mongodb";

// ponytail: cached client so serverless invocations reuse one connection pool.
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chaicode";
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const mongoClient = globalForMongo._mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = mongoClient;

export const db = mongoClient.db();
