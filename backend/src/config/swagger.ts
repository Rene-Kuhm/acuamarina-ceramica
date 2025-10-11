import { config } from './environment';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Aguamarina Mosaicos',
      version: '1.0.0',
      description: 'API profesional para la gestión de tienda de cerámicos con PostgreSQL',
      contact: {
        name: 'Aguamarina Mosaicos',
        email: 'soporte@aguamarina.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Servidor de desarrollo',
      },
      {
        url: `https://api.aguamarina.com/api/${config.apiVersion}`,
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT en el formato: Bearer <token>',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            stack: {
              type: 'string',
              description: 'Stack trace (solo en desarrollo)',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['admin', 'empleado', 'cliente'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            sku: {
              type: 'string',
            },
            price: {
              type: 'number',
              format: 'decimal',
            },
            stock: {
              type: 'integer',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                  },
                  isPrimary: {
                    type: 'boolean',
                  },
                },
              },
            },
            isActive: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            isActive: {
              type: 'boolean',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            orderNumber: {
              type: 'string',
            },
            customerId: {
              type: 'string',
              format: 'uuid',
            },
            status: {
              type: 'string',
              enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
            },
            total: {
              type: 'number',
              format: 'decimal',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'string',
                    format: 'uuid',
                  },
                  quantity: {
                    type: 'integer',
                  },
                  price: {
                    type: 'number',
                    format: 'decimal',
                  },
                  subtotal: {
                    type: 'number',
                    format: 'decimal',
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@aguamarina.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT access token',
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token no proporcionado o inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Token inválido o expirado',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Acceso prohibido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'No autorizado para esta acción',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Recurso no encontrado',
              },
            },
          },
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Errores de validación: email: Invalid email',
              },
            },
          },
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Error interno del servidor',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y autorización',
      },
      {
        name: 'Products',
        description: 'Gestión de productos',
      },
      {
        name: 'Categories',
        description: 'Gestión de categorías',
      },
      {
        name: 'Orders',
        description: 'Gestión de pedidos',
      },
      {
        name: 'Customers',
        description: 'Gestión de clientes',
      },
      {
        name: 'Stats',
        description: 'Estadísticas y métricas',
      },
      {
        name: 'Upload',
        description: 'Carga de archivos',
      },
      {
        name: 'Export',
        description: 'Exportación de datos',
      },
      {
        name: 'Health',
        description: 'Health checks y monitoreo',
      },
    ],
  },
  apis: ['./src/application/routes/*.ts', './src/server.ts'],
};
