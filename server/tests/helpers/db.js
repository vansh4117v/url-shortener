import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;

  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
};

export const disconnectTestDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
