import path from 'path';

// Manual Swagger specification for serverless compatibility
export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Trip Planner API',
    version: '1.0.0',
    description: 'API documentation for the Collaborative Trip Planner backend',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000',
      description: process.env.VERCEL_URL ? 'Production server' : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token from login',
      },
    },
  },
  tags: [
    { name: 'System', description: 'System health and status' },
    { name: 'Authentication', description: 'User authentication endpoints' },
    { name: 'Trips', description: 'Trip management' },
    { name: 'Expenses', description: 'Expense tracking' },
    { name: 'Settlements', description: 'Settlement calculations' },
    { name: 'Itinerary', description: 'Itinerary management' },
    { name: 'Stops', description: 'Destination stops' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Backend is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'Backend is running',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/signup': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'username'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', format: 'password', example: 'SecurePass123!' },
                  username: { type: 'string', example: 'john_doe' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Invalid input or user already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', format: 'password', example: 'SecurePass123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { type: 'object' },
                    session: { type: 'object' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid credentials' },
        },
      },
    },
    '/trips': {
      get: {
        summary: 'Get all trips for the authenticated user',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of trips' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create a new trip',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Summer Vacation 2026' },
                  description: { type: 'string', example: 'Trip to Europe' },
                  start_date: { type: 'string', format: 'date', example: '2026-06-01' },
                  end_date: { type: 'string', format: 'date', example: '2026-06-15' },
                  destination: { type: 'string', example: 'Paris, France' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Trip created successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/trips/{id}': {
      get: {
        summary: 'Get a specific trip by ID',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Trip ID',
          },
        ],
        responses: {
          '200': { description: 'Trip details' },
          '404': { description: 'Trip not found' },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        summary: 'Update a trip',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Trip ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  start_date: { type: 'string', format: 'date' },
                  end_date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Trip updated successfully' },
          '404': { description: 'Trip not found' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete a trip',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Trip ID',
          },
        ],
        responses: {
          '200': { description: 'Trip deleted successfully' },
          '404': { description: 'Trip not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/expenses': {
      get: {
        summary: 'Get all expenses',
        tags: ['Expenses'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of expenses' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create a new expense',
        tags: ['Expenses'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  trip_id: { type: 'string' },
                  description: { type: 'string', example: 'Hotel booking' },
                  amount: { type: 'number', example: 250.50 },
                  currency: { type: 'string', example: 'USD' },
                  paid_by: { type: 'string' },
                  split_between: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Expense created successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/settlements': {
      post: {
        summary: 'Calculate settlements for a trip',
        tags: ['Settlements'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  trip_id: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Settlements calculated' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itinerary': {
      get: {
        summary: 'Get itinerary items',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of itinerary items' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create itinerary item',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Itinerary item created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/stops': {
      get: {
        summary: 'Get destination stops',
        tags: ['Stops'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of destination stops' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create destination stop',
        tags: ['Stops'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Stop created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};
