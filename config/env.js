import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  node_env: process.env.NODE_ENV || "development",
  fastapiUrl: process.env.FASTAPI_URL || "http://localhost:8000",
};

export default config;
