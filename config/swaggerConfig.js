// config/swaggerConfig.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "FAQ API",
      version: "1.0.0",
      description: "API to manage FAQs with multi-language support",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default swaggerSetup;

