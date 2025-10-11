import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../shared/errors/AppError';

describe('AppError', () => {
  describe('AppError base class', () => {
    it('should create an error with message and status code', () => {
      const error = new AppError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should have default status code 500', () => {
      const error = new AppError('Test error');

      expect(error.statusCode).toBe(500);
    });

    it('should be an instance of Error', () => {
      const error = new AppError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should capture stack trace', () => {
      const error = new AppError('Test error');

      expect(error.stack).toBeDefined();
    });
  });

  describe('NotFoundError', () => {
    it('should create error with 404 status code', () => {
      const error = new NotFoundError('Resource not found');

      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should have default message', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Recurso no encontrado');
    });
  });

  describe('ValidationError', () => {
    it('should create error with 400 status code', () => {
      const error = new ValidationError('Invalid input');

      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
    });

    it('should have default message', () => {
      const error = new ValidationError();

      expect(error.message).toBe('Error de validación');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create error with 401 status code', () => {
      const error = new UnauthorizedError('Not authenticated');

      expect(error.message).toBe('Not authenticated');
      expect(error.statusCode).toBe(401);
    });

    it('should have default message', () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe('No autorizado');
    });
  });

  describe('ForbiddenError', () => {
    it('should create error with 403 status code', () => {
      const error = new ForbiddenError('Access denied');

      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
    });

    it('should have default message', () => {
      const error = new ForbiddenError();

      expect(error.message).toBe('Acceso prohibido');
    });
  });

  describe('ConflictError', () => {
    it('should create error with 409 status code', () => {
      const error = new ConflictError('Resource conflict');

      expect(error.message).toBe('Resource conflict');
      expect(error.statusCode).toBe(409);
    });

    it('should have default message', () => {
      const error = new ConflictError();

      expect(error.message).toBe('Conflicto de recursos');
    });
  });
});
