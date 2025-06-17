const config = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV || "development",
  API_PREFIX: process.env.API_PREFIX || "/api",
  ORIGINAL_PREFIX: process.env.ORIGINAL_PREFIX || "original",
  EDITED_PREFIX: process.env.EDITED_PREFIX || "edited",
  googleProjectId: process.env.PROJECT_ID,
  keyFileName: process.env.KEY_FILE_NAME,
  bucketName: process.env.BUCKET_NAME,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  emailQueue: process.env.EMAIL_QUEUE || "email_queue",
  analyzeQueue: process.env.ANALYZE_QUEUE || "analyze_queue",
};

export default config;
