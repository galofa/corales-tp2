// src/types/swagger-jsdoc.d.ts
declare module 'swagger-jsdoc' {
  import { OpenAPIV3 } from 'openapi-types';

  interface SwaggerJSDocOptions {
    swaggerDefinition: Partial<OpenAPIV3.Document>; // <-- permite no tener paths todavía
    apis: string[];
  }

  function swaggerJSDoc(options: SwaggerJSDocOptions): OpenAPIV3.Document;
  export default swaggerJSDoc;
}
