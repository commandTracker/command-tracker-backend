import { GCS } from "../config/constants.js";
import env from "../config/env.js";

const generateSignedUrl = async (storage, fileName) => {
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + GCS.SIGNED_URL.EXPIRE,
  };

  const [url] = await storage
    .bucket(env.bucketName)
    .file(fileName)
    .getSignedUrl(options);

  return url;
};

export default generateSignedUrl;
