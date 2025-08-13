const usuarioModel = require('../models/usuarioModel');

function buscarTodo(req,res){
    usuarioModel.find({})
    .then(usuario => {
        if(usuario.length){
            return res.status(200).send({usuario})
        }
        return res.status(204).send({mensaje: 'No hay nada que mostrar'})
    })
    .catch(e => {return res.status(404).send({mensaje: `error al consultar la informacion ${e}`})})
}


async function buscarUsuario(req,res,next){ // sirve para en la misma sintaxis ejecutar dos funciones al mismo tiempo.
   if (!req.body)  req.body={}// si el id existe
    var consulta = {}
    consulta[req.params.key] = req.params.value
    usuarioModel.find(consulta)
    .then(usuario =>{
        if(!usuario.length) return next();
        req.body.usuario = usuario
        return next()
    })
    .catch(e =>{
        req.body.e = e
        return next()
    })
}


function mostrarUsuario(req,res){
    if (req.body.e) return res.status(404).send({mesaje: `error al buscar informacion`})
    if (!req.body.usuario) return res.status(204).send({mensaje: `Nohay nada que mostrar`})
        let usuario = req.body.usuario
    return res.status(200).send({usuario})
}


function eliminarUsuario(req,res){
    var usuario = {}
    usuario = req.body.usuario
    usuarioModel.deleteOne(usuario[0])
    .then(usuario =>{
        return res.status(200).send({mensaje:`se elimino la informacion`})
    })
    .catch(e =>{
        return res.status(404).send({mensaje: `error al eliminar la informacion`,e})
    })
}




function usuarioActualizar(req,res){
    var usuario = req.body.usuario 

    if(!usuario != !usuario.length){
        return res.status(404).send({mensaje: "No hay nada que actualizar"})
    }
    usuarioModel.updateOne(usuario[0],req.body)
    .then(usuario =>{
        return res.status(200).send({mensaje: "YA JALO"})
        })
    .catch(e =>{
        return res.status(404).send({mensaje: "NO JALO :(", e})
    })
}



module.exports = {
    buscarTodo,
    buscarUsuario,
    mostrarUsuario,
    eliminarUsuario,
    usuarioActualizar
}