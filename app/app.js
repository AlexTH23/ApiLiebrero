const express = require('express');
const app = express();
//viene de router
const router = require('./routes/librosRoute')


//PARTE DE JOVANA
const usuarioRoutes = require('./routes/usuarioRoute');

/*Aqui vamos a decirle que apartir de app vamos a "usar" a un express.url en code y entre parentesis y llaves vamos a
darle un formato extendido que sea falso (Cuando esta en falso no muestra los datos) */
app.use(express.urlencoded({extended:false}))

//Nos muestra la informacion en formato JSON
app.use(express.json())

//Cuando nosotros solicitemos "raiz" ahora si va a llamar a router
//ACTUALIZACION SE LE IMPLEMENTA "libros"
app.use('/libros',router)



//PARTE DE JOVANA

app.use('/usuarios', usuarioRoutes); 

module.exports = app