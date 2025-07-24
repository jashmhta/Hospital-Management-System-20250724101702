import { NextResponse } from 'next/server';


import { logger } from '@/lib/logger';
// src/utils/api-response.ts
\1
}
  };
}

\1
}
    };

    return NextResponse.json(response);
  }

  static error(
    error: string,
    statusCode: number = 400;
    details?: unknown): NextResponse {
    const response: ApiResponse = {
      success: false;
      error,
      meta: 
        timestamp: new Date().toISOString()
    };

    logger.error('API Error Response', { error, statusCode, details });

    return NextResponse.json(response, { status: statusCode });
  }

  static notFound(resource: string = 'Resource'): NextResponse {
    return this.error(`${resource} not found`, 404);
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse {
    return this.error(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): NextResponse {
    return this.error(message, 403);
  }

  static validationError(message: string, details?: unknown): NextResponse {
    return this.error(`Validation error: ${message}`, 422, details);
  }

  static internalError(message: string = 'Internal server error'): NextResponse {
    return this.error(message, 500);
  }
}

// Pagination utilities
\1
}
}

\1
}
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = options;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100); // Max 100 items per page

    const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' };

    return { skip, take, orderBy };
  }

  static buildMeta(total: number, page: number, limit: number) {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      \1,\2 page > 1
    };
  }
}
