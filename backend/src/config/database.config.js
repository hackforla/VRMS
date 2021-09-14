exports.PORT = process.env.BACKEND_PORT;

const DbHost = process.env.DATABASE_HOST;
const DbUrl = DbHost ? `mongodb://${DbHost}:27017` 
                     : process.env.DATABASE_URL;

exports.DATABASE_URL = DbUrl;
