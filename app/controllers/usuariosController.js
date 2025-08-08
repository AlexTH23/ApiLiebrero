const usuarioModel = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');

function buscarTodo(req,res){
    usuarioModel.find({})
    .then(usuario => {
        if(usuario.length){
            return res.status(200).send({usuario})
        }
        return res.status(204).send({mensaje: 'NO HAY LIEBRERO QUE MOSTRAR'})
    })
    .catch(e => {return res.status(404).send({mensaje: `ERROR AL CONSULTAR LIEBREROS ${e}`})})
}


function agregarUsuario(req, res){
    new usuarioModel(req.body).save()
    .then(usuario => {
        return res.status(200)
        mensaje: "LIEBRERO GUARDADO CORRECTAMENTE",
        usuario// Variable que almacena resultado de la promesa
    })
    .catch(e =>{return  res.status(404).send({mensaje: `ERROR AL GUARDAR LIEBRERO ${e}`})})
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
    if (req.body.e) return res.status(404).send({mesaje: `ERROR AL MOSTRAR LIEBRERO`, e: req.body.e})
    if (!req.body.usuario) return res.status(204).send({mensaje: `NO HAY LIEBRERO QUE MOSTRAR`})
        let usuario = req.body.usuario
    return res.status(200).send({usuario})
}


function eliminarUsuario(req,res){
    var usuario = {}
    usuario = req.body.usuario
    usuarioModel.deleteOne(usuario[0])
    .then(usuario =>{
        return res.status(200).send({mensaje:`LIEBRRO ELIMINADO : )`})
    })
    .catch(e =>{
        return res.status(404).send({mensaje: `ERROR AL ELIMINAR LIEBRERO`,e})
    })
}

function usuarioActualizar(req,res){
    var usuario = req.body.usuario // se crea una variable que almacena el valor de la joya con los datos de la funcion de buscarJoya

    if(!usuario != !usuario.length){// aqui se valida que la joya exista y que tenga un valor, pero si los valotes son falsos, entonces no se actualiza
        return res.status(404).send({mensaje: "No hay nada que actualizar"})
    }
    usuarioModel.updateOne(usuario[0],req.body)// se actualiza la joya con los datos que se tienen en el body joyas[0], se toma en cero para que lea apartir de la primer posicion
    .then(usuario =>{
        return res.status(200).send({mensaje: "LIEBRERO ACTUALIZADO : )"})
        })
    .catch(e =>{
        return res.status(404).send({mensaje: "LIEBRERO NO ACTUALIZADO :(", e})
    })
}


module.exports = {
    buscarTodo,
    agregarUsuario,
    buscarUsuario,
    mostrarUsuario,
    eliminarUsuario,
    usuarioActualizar
}