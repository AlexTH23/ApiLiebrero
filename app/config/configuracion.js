require('dotenv').config();

module.exports = {
    PUERTO: process.env.PUERTO || 3000,
    BD: process.env.MONGO_URI
};
