const config = require('./configuracion');
const mongoose = require('mongoose');

module.exports = {
    connection: null,

    conect: async function () {
        if (this.connection) return this.connection;

        try {
            // Busca primero la variable de entorno MONGODB_URI
            const mongoURI = process.env.MONGODB_URI || config.BD;

            if (!mongoURI) {
                throw new Error('No se encontró la URI de MongoDB en MONGODB_URI ni en config.BD');
            }

            const conn = await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            this.connection = conn;
            console.log('✅ Conexión a MongoDB Atlas realizada correctamente');
            return conn;

        } catch (e) {
            console.error(`❌ Error en la conexión a MongoDB Atlas: ${e.message}`);
        }
    }
};
