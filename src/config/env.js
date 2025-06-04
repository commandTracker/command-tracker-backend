import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  node_env: process.env.NODE_ENV || "development",
  API_PREFIX: process.env.API_PREFIX || "/api",
  fastapiUrl: process.env.FASTAPI_URL || "http://localhost:8000",
  googleProjectId: process.env.PROJECT_ID,
  keyFileName: process.env.KEY_FILE_NAME,
  bucketName: process.env.BUCKET_NAME,
};

export default config;
