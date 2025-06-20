const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configure Swagger documentation
 */
const setupSwagger = (app) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'BandMate Rehearsal Scheduler API',
        version: '1.0.0',
        description: 'API documentation for BandMate Rehearsal Scheduler',
        contact: {
          name: 'API Support',
          email: 'support@bandmate.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
    },
    apis: ['./src/routes/*.js', './src/models/*.js']
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;