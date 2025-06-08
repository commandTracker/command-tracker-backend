import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  node_env: process.env.NODE_ENV || "development",
  gcs_bucket: process.env.GCS_BUCKET || "test_bucket",
};

export default config;
