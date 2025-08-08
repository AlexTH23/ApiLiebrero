const config = require('./configuracion');
const mongoose = require('mongoose');

module.exports = {
    connection: null,
    
    conect: async function () {
        if (this.connection) return this.connection;
        
        try {
            const conn = await mongoose.connect(config.BD, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            this.connection = conn;
            console.log('Conexión a MongoDB Atlas realizada correctamente');
            return conn;
        } catch (e) {
            console.error(`Error en la conexión a MongoDB Atlas: ${e.message}`);
        }
    }
};
