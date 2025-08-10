const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Libros - LIEBRERO',
      version: '1.0.0',
      description: 'API CRUD para la gestión de libros',
    },
    servers: [
      {
        url: 'https://liebrero-st86n.ondigitalocean.app',
        description: 'Servidor de producción',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./app/routes/*.js', './swagger/*.js'], // Archivos con anotaciones Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
