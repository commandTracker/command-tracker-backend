import { Storage } from "@google-cloud/storage";

import env from "./env.js";

const storage = new Storage({
  projectId: env.googleProjectId,
  keyFilename: env.keyFileName,
});

const bucket = storage.bucket(env.bucketName);

export { storage, bucket };
