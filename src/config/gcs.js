import { Storage } from "@google-cloud/storage";

import env from "./env.js";

const storage = new Storage({
  projectId: env.googleProjectId,
  credentials: JSON.parse(env.keyData),
});

const bucket = storage.bucket(env.bucketName);

export { storage, bucket };
