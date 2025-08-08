const mongoose = require('mongoose');

/* const capituloSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  contenido: {
    type: String,
    required: true
  }
}, { _id: false }); // No queremos _id dentro de cada capítulo

*/

const librosSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    length:50,
    unique: true
  },
  autor: {
    type: String,
    length:50,
    required: true
  },
  descripcion: {
    type: String,
    length:300,
    required: true
  },
  genero: {
    type: String,
    length:200,
    required: true
  },
  idioma: {
    type: String,
    length:31,
    default: "Español"
  },
  anoPublicacion: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  portadaJSON: {
    type: String
  },
  archivoJSON: {
    type: String
  },
/*  capitulos: {
    type: [capituloSchema],
    default: []
  }*/
}, {
  timestamps: true
});

const librosModel = mongoose.model('libros',librosSchema)

module.exports = librosModel