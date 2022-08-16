require("dotenv").config();
process.env.NODE_ENV = process.env.NODE_ENV || "dev";
process.env.HOST = process.env.HOST || "127.0.0.1";
process.env.PORT = 6001;

const oEnv = {};

oEnv.dev = {
    BASE_URL: "",
    BASE_API_PATH: "",
    DB_URL: process.env.DB_URL,
};

oEnv.stag = {
    BASE_URL: "",
    BASE_API_PATH: "",
    DB_URL: process.env.DB_URL,
};

oEnv.prod = {
    BASE_URL: "",
    BASE_API_PATH: "",
    DB_URL: process.env.DB_URL,
};
process.env.BASE_URL = oEnv[process.env.NODE_ENV].BASE_URL;
process.env.BASE_API_PATH = oEnv[process.env.NODE_ENV].BASE_API_PATH;
process.env.JWT_SECRET = "jwt-secret";
process.env.DB_URL = oEnv[process.env.NODE_ENV].DB_URL;

process.env.OTP_VALIDITY = 60 * 1000;
process.env.SUPPORT_EMAIL = "";
process.env.AWS_ACCESSKEYID = "";
process.env.AWS_SECRETKEY = "";

process.env.CLOUD_NAME = process.env.CLOUD_NAME;
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
process.env.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

process.env.ROUNDSMS_API_KEY = "";

process.env.AWS_REGION = "";
// console.log(process.env.NODE_ENV, process.env.HOST, 'configured');
