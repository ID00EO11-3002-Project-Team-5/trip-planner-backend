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
    { name: 'Lodging', description: 'Lodging management' },
    { name: 'Transport', description: 'Transport management' },
    { name: 'Messages', description: 'Trip chat messages' },
    { name: 'Invites', description: 'Trip invite management' },
    { name: 'Documents', description: 'Document vault (file upload & retrieval)' },
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
    // ─── Trips ────────────────────────────────────────────────────────────────
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
                required: ['title_trip', 'startdate_trip', 'enddate_trip'],
                properties: {
                  title_trip: { type: 'string', example: 'Summer Vacation 2026' },
                  description_trip: { type: 'string', example: 'Trip to Europe' },
                  startdate_trip: { type: 'string', format: 'date-time', example: '2026-06-01T00:00:00Z' },
                  enddate_trip: { type: 'string', format: 'date-time', example: '2026-06-15T00:00:00Z' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Trip created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/trips/{id}': {
      get: {
        summary: 'Get a specific trip by ID',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
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
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title_trip: { type: 'string' },
                  description_trip: { type: 'string' },
                  startdate_trip: { type: 'string', format: 'date-time' },
                  enddate_trip: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Trip updated successfully' },
          '403': { description: 'Forbidden – not the trip owner' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete a trip',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'Trip deleted successfully' },
          '404': { description: 'Trip not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Expenses ─────────────────────────────────────────────────────────────
    '/expenses': {
      get: {
        summary: 'Get all expenses for a trip',
        tags: ['Expenses'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'query', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
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
                required: ['id_trip', 'title_expe', 'amount_expe', 'currency_expe', 'shares'],
                properties: {
                  id_trip: { type: 'string', format: 'uuid' },
                  title_expe: { type: 'string', example: 'Hotel booking' },
                  amount_expe: { type: 'number', example: 250.50 },
                  currency_expe: { type: 'string', enum: ['USD', 'EUR', 'GBP'], example: 'USD' },
                  shares: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id_user', 'shareamount_exsh'],
                      properties: {
                        id_user: { type: 'string', format: 'uuid' },
                        shareamount_exsh: { type: 'number', example: 125.25 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Expense created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/expenses/{id}': {
      put: {
        summary: 'Update an expense',
        tags: ['Expenses'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Expense ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title_expe: { type: 'string' },
                  amount_expe: { type: 'number' },
                  currency_expe: { type: 'string', enum: ['USD', 'EUR', 'GBP'] },
                  shares: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Expense updated' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete an expense',
        tags: ['Expenses'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Expense ID' }],
        responses: {
          '200': { description: 'Expense deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Settlements ──────────────────────────────────────────────────────────
    '/settlements': {
      get: {
        summary: 'Get settlements for a trip',
        tags: ['Settlements'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'query', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'Settlements calculated and returned' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Itinerary ────────────────────────────────────────────────────────────
    '/itinerary': {
      post: {
        summary: 'Create an itinerary item',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_trip', 'title_itit', 'date_itit'],
                properties: {
                  id_trip: { type: 'string', format: 'uuid' },
                  title_itit: { type: 'string', example: 'Eiffel Tower visit' },
                  date_itit: { type: 'string', format: 'date', example: '2026-06-05' },
                  time_itit: { type: 'string', example: '14:00:00' },
                  location_itit: { type: 'string', nullable: true },
                  cost_itit: { type: 'number', nullable: true, example: 30 },
                  position_itit: { type: 'integer', default: 0 },
                  id_loca: { type: 'string', format: 'uuid', nullable: true },
                  notes_itit: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Itinerary item created' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itinerary/full': {
      post: {
        summary: 'Create a full itinerary item with optional lodging and transport',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_trip', 'title_itit', 'date_itit'],
                properties: {
                  id_trip: { type: 'string', format: 'uuid' },
                  title_itit: { type: 'string', example: 'Day 1 in Paris' },
                  date_itit: { type: 'string', format: 'date' },
                  lodging: {
                    type: 'object',
                    properties: {
                      name_lodg: { type: 'string' },
                      address_lodg: { type: 'string', nullable: true },
                      checkin_lodg: { type: 'string', nullable: true },
                      checkout_lodg: { type: 'string', nullable: true },
                      confirmation_lodg: { type: 'string', nullable: true },
                      link_lodg: { type: 'string', nullable: true },
                    },
                  },
                  transport: {
                    type: 'object',
                    properties: {
                      type_tran: { type: 'string', example: 'Flight' },
                      provider_tran: { type: 'string', nullable: true },
                      deploc_tran: { type: 'string', nullable: true },
                      arrloc_tran: { type: 'string', nullable: true },
                      deptime_tran: { type: 'string', nullable: true },
                      arrtime_tran: { type: 'string', nullable: true },
                      link_tran: { type: 'string', nullable: true },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Full itinerary item created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itinerary/trip/{tripId}': {
      get: {
        summary: 'Get all itinerary items for a trip',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'List of itinerary items ordered by date and time' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' },
        },
      },
    },
    '/itinerary/trip/{tripId}/costs': {
      get: {
        summary: 'Get total cost summary for a trip itinerary',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'Cost summary with totalCost, currency, and itemsCount' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itinerary/reorder': {
      patch: {
        summary: 'Reorder itinerary items',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tripId', 'updates'],
                properties: {
                  tripId: { type: 'string', format: 'uuid' },
                  updates: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id_itit', 'position_itit'],
                      properties: {
                        id_itit: { type: 'string', format: 'uuid' },
                        position_itit: { type: 'integer', minimum: 0 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Itinerary reordered successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itinerary/{id}': {
      patch: {
        summary: 'Update an itinerary item',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Itinerary item ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title_itit: { type: 'string' },
                  date_itit: { type: 'string', format: 'date' },
                  time_itit: { type: 'string' },
                  location_itit: { type: 'string', nullable: true },
                  cost_itit: { type: 'number', nullable: true },
                  notes_itit: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Itinerary item updated' },
          '404': { description: 'Item not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itinerary/{itemId}': {
      delete: {
        summary: 'Delete an itinerary item',
        tags: ['Itinerary'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'itemId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Itinerary item ID' }],
        responses: {
          '200': { description: 'Item deleted successfully' },
          '404': { description: 'Item not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Destination Stops ────────────────────────────────────────────────────
    '/stops': {
      post: {
        summary: 'Add a new destination stop to a trip',
        tags: ['Stops'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_trip', 'name_loca'],
                properties: {
                  id_trip: { type: 'string', format: 'uuid' },
                  name_loca: { type: 'string', example: 'Paris, France' },
                  coordinates: {
                    type: 'object',
                    properties: {
                      lat: { type: 'number', example: 48.8566 },
                      lng: { type: 'number', example: 2.3522 },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Stop created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/stops/trip/{tripId}': {
      get: {
        summary: 'Get all destination stops for a trip',
        tags: ['Stops'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'List of destination stops' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/stops/reorder': {
      patch: {
        summary: 'Reorder destination stops',
        tags: ['Stops'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['updates'],
                properties: {
                  updates: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id_loca', 'position_loca'],
                      properties: {
                        id_loca: { type: 'string', format: 'uuid' },
                        position_loca: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Stops reordered' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/stops/{stopId}': {
      delete: {
        summary: 'Delete a destination stop',
        tags: ['Stops'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'stopId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Stop ID' }],
        responses: {
          '200': { description: 'Stop deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Lodging ──────────────────────────────────────────────────────────────
    '/lodging': {
      post: {
        summary: 'Create a lodging entry for an itinerary item',
        tags: ['Lodging'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_itit', 'name_lodg'],
                properties: {
                  id_itit: { type: 'string', format: 'uuid' },
                  name_lodg: { type: 'string', example: 'Hotel de Paris' },
                  address_lodg: { type: 'string', nullable: true },
                  checkin_lodg: { type: 'string', example: '2026-06-05T14:00:00Z', nullable: true },
                  checkout_lodg: { type: 'string', example: '2026-06-07T11:00:00Z', nullable: true },
                  confirmation_lodg: { type: 'string', nullable: true },
                  link_lodg: { type: 'string', format: 'uri', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Lodging created' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/lodging/itinerary/{id_itit}': {
      get: {
        summary: 'Get lodging for an itinerary item',
        tags: ['Lodging'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_itit', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Itinerary item ID' }],
        responses: {
          '200': { description: 'Lodging details' },
          '404': { description: 'Not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/lodging/{id_lodg}': {
      get: {
        summary: 'Get a lodging entry by ID',
        tags: ['Lodging'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_lodg', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Lodging ID' }],
        responses: {
          '200': { description: 'Lodging details' },
          '404': { description: 'Not found' },
          '401': { description: 'Unauthorized' },
        },
      },
      patch: {
        summary: 'Update a lodging entry',
        tags: ['Lodging'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_lodg', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Lodging ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name_lodg: { type: 'string' },
                  address_lodg: { type: 'string', nullable: true },
                  checkin_lodg: { type: 'string', nullable: true },
                  checkout_lodg: { type: 'string', nullable: true },
                  confirmation_lodg: { type: 'string', nullable: true },
                  link_lodg: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Lodging updated' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete a lodging entry',
        tags: ['Lodging'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_lodg', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Lodging ID' }],
        responses: {
          '200': { description: 'Lodging deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Transport ────────────────────────────────────────────────────────────
    '/transport': {
      post: {
        summary: 'Create a transport entry for an itinerary item',
        tags: ['Transport'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_itit', 'type_tran'],
                properties: {
                  id_itit: { type: 'string', format: 'uuid' },
                  type_tran: { type: 'string', example: 'Flight' },
                  provider_tran: { type: 'string', nullable: true, example: 'Air France' },
                  deploc_tran: { type: 'string', nullable: true, example: 'London Heathrow' },
                  arrloc_tran: { type: 'string', nullable: true, example: 'Paris CDG' },
                  deptime_tran: { type: 'string', nullable: true, example: '2026-06-05T08:00:00Z' },
                  arrtime_tran: { type: 'string', nullable: true, example: '2026-06-05T10:30:00Z' },
                  link_tran: { type: 'string', format: 'uri', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Transport created' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/transport/itinerary/{id_itit}': {
      get: {
        summary: 'Get transport for an itinerary item',
        tags: ['Transport'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_itit', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Itinerary item ID' }],
        responses: {
          '200': { description: 'Transport details' },
          '404': { description: 'Not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/transport/{id_tran}': {
      get: {
        summary: 'Get a transport entry by ID',
        tags: ['Transport'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_tran', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Transport ID' }],
        responses: {
          '200': { description: 'Transport details' },
          '404': { description: 'Not found' },
          '401': { description: 'Unauthorized' },
        },
      },
      patch: {
        summary: 'Update a transport entry',
        tags: ['Transport'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_tran', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Transport ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type_tran: { type: 'string' },
                  provider_tran: { type: 'string', nullable: true },
                  deploc_tran: { type: 'string', nullable: true },
                  arrloc_tran: { type: 'string', nullable: true },
                  deptime_tran: { type: 'string', nullable: true },
                  arrtime_tran: { type: 'string', nullable: true },
                  link_tran: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Transport updated' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete a transport entry',
        tags: ['Transport'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_tran', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Transport ID' }],
        responses: {
          '200': { description: 'Transport deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Messages ─────────────────────────────────────────────────────────────
    '/messages/trips/{tripId}': {
      get: {
        summary: 'Get all messages for a trip',
        tags: ['Messages'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'List of messages' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Send a message to a trip chat',
        tags: ['Messages'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content_mess'],
                properties: {
                  content_mess: { type: 'string', example: 'Hey everyone, excited for this trip!' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Message sent' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Invites ──────────────────────────────────────────────────────────────
    '/invite/trips/{tripId}/invite': {
      post: {
        summary: 'Send an invite to a user for a trip',
        tags: ['Invites'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'tripId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['invitedUserId'],
                properties: {
                  invitedUserId: { type: 'string', format: 'uuid', description: 'User ID to invite' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Invite sent successfully' },
          '400': { description: 'Validation error or invite already sent' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/invite/{inviteId}/accept': {
      patch: {
        summary: 'Accept a trip invite',
        tags: ['Invites'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'inviteId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Invite ID' }],
        responses: {
          '200': { description: 'Invite accepted' },
          '400': { description: 'Already actioned' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/invite/{inviteId}/reject': {
      patch: {
        summary: 'Reject a trip invite',
        tags: ['Invites'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'inviteId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Invite ID' }],
        responses: {
          '200': { description: 'Invite rejected' },
          '400': { description: 'Already actioned' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ─── Documents ────────────────────────────────────────────────────────────
    '/documents': {
      post: {
        summary: 'Upload a document for a trip',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file', 'id_trip'],
                properties: {
                  file: { type: 'string', format: 'binary', description: 'File to upload (max 5 MB)' },
                  id_trip: { type: 'string', format: 'uuid', description: 'Trip the document belongs to' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Document uploaded successfully' },
          '400': { description: 'Validation error or no file provided' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Upload failed' },
        },
      },
    },
    '/documents/trip/{id_trip}': {
      get: {
        summary: 'Get all documents for a trip',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_trip', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Trip ID' }],
        responses: {
          '200': { description: 'List of documents' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Access denied' },
        },
      },
    },
    '/documents/{docId}/view': {
      get: {
        summary: 'Get a signed URL to view/download a document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'docId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Document ID' }],
        responses: {
          '200': { description: 'Signed URL returned', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' } } } } } },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Access denied' },
        },
      },
    },
    '/documents/{docId}': {
      delete: {
        summary: 'Delete a document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'docId', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Document ID' }],
        responses: {
          '200': { description: 'Document deleted successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Permission denied' },
        },
      },
    },
  },
};
