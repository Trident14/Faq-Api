// src/config/swaggerConfig.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Define the Swagger configuration
const options = {
  definition: {
    openapi: "1.0.0", 
    info: {
      title: "FAQ API",
      version: "1.0.0",
      description: "API for managing FAQs with multilingual support",
    },
    servers: [
      {
        url: "http://localhost:5000", 
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Point to your route files for documentation
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
