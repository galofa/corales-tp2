// src/swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Reels',
    version: '1.0.0',
    description: 'Documentación automática con Swagger y OpenAPI',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Ajusta el path según tu estructura
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
