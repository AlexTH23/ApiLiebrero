const librosModel = require('../models/librosModel');

// Obtener todos los libros
function obtenerLibros(req, res) {
    librosModel.find({})
        .then(libros => {
            if (libros.length) {
                return res.status(200).send({ libros });
            }
            return res.status(204).send({ mensaje: "No se ha encontrado nada" });
        })
        .catch(e => {
            return res.status(404).send({ mensaje: `Error al consultar la información: ${e}` });
        });
}

// Crear nuevo libro
function crearLibro(req, res) {
    new librosModel(req.body).save()
        .then(info => {
            return res.status(200).send({
                mensaje: "El libro ha sido añadido con éxito", info });
        })
        .catch(e => {
            return res.status(404).send({ mensaje: `Error al guardar el libro: ${e}` });
        });
}

// Middleware para buscar libros
async function buscarLibro(req, res, next) {
  if (!req.body) req.body = {};
  const consulta = {};
  consulta[req.params.key] = new RegExp(`^${req.params.value}$`, 'i');

  try {
    const libros = await librosModel.find(consulta);
    if (!libros.length) return next(); // Si no encuentra, sigue sin error
    req.body.libros = libros;
    next();
  } catch (e) {
    req.body.e = e;
    next();
  }
}

// Mostrar libros encontrados
function mostrarLibro(req, res) {
  if (req.body.e) return res.status(404).send({ mensaje: "Error al buscar el libro" });
  if (!req.body.libros) return res.status(204).send({ mensaje: "Libro no encontrado" });
  return res.status(200).send({ libros: req.body.libros });
}


function actualizarLibro(req, res) {
  const libro = req.body.libros?.[0];
  const update = req.body;

  if (!libro || !libro.titulo) {
    return res.status(404).send({ mensaje: "No se encontró libro para actualizar" });
  }

  librosModel.updateOne({ titulo: new RegExp(`^${libro.titulo}$`, 'i') }, { $set: update })
    .then(info => {
      if (info.matchedCount === 0) {
        return res.status(404).send({ mensaje: "Libro no encontrado para actualizar" });
      }
      return res.status(200).send({ mensaje: "Libro actualizado", info });
    })
    .catch(e => res.status(404).send({ mensaje: "Error al actualizar", e }));
}


function eliminarLibro(req, res) {
  const libro = req.body.libros?.[0];

  if (!libro || !libro.titulo) {
    return res.status(404).send({ mensaje: "No se encontró libro para eliminar" });
  }

  librosModel.deleteOne({ titulo: new RegExp(`^${libro.titulo}$`, 'i') })
    .then(info => {
      if (info.deletedCount === 0) {
        return res.status(404).send({ mensaje: "Libro no encontrado para eliminar" });
      }
      return res.status(200).send({ mensaje: "Libro eliminado correctamente", info });
    })
    .catch(e => res.status(404).send({ mensaje: "Error al eliminar", e }));
}


/*
function leerCapituloPorTitulo(req, res) {
    const titulo = req.params.titulo;
    const capituloNum = parseInt(req.params.capitulo);

    librosModel.findOne({ titulo: new RegExp(`^${titulo}$`, 'i') })
        .then(libro => {
            if (!libro) {
                return res.status(404).send({ mensaje: "Libro no encontrado" });
            }
            const capitulo = libro.capitulos.find(c => c.numero === capituloNum);
            if (!capitulo) {
                return res.status(404).send({ mensaje: "Capítulo no encontrado" });
            }
            return res.status(200).send({ capitulo });
        })
        .catch(e => {
            return res.status(404).send({ mensaje: `Error al leer el capítulo: ${e}` });
        });
} */

module.exports = {
    obtenerLibros,
    crearLibro,
    buscarLibro,
  mostrarLibro,
  actualizarLibro,
  eliminarLibro
};
