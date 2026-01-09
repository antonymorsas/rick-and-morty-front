import { successResult, errorResult } from '../result';

describe('result utilities', () => {
  describe('successResult', () => {
    it('should create a success result with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = successResult(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });
  });

  describe('errorResult', () => {
    it('should create an error result with Error object', () => {
      const error = new Error('Test error');
      const result = errorResult(error);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Test error');
      }
    });

    it('should create an error result with string', () => {
      const errorMessage = 'Test error message';
      const result = errorResult(errorMessage);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });
});
