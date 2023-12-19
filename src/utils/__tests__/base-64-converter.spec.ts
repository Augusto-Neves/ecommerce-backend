import { authorizationToLoginPayload } from '../base-64-converter';

describe('authorizationToLoginPayload', () => {
  it('should return LoginPayloadDto for valid authorization token', () => {
    const validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const result = authorizationToLoginPayload(`Bearer ${validToken}`);

    expect(result).toBeDefined();
  });

  it('should return undefined for invalid authorization token', () => {
    const invalidToken = 'invalidToken';

    const result = authorizationToLoginPayload(`Bearer ${invalidToken}`);

    expect(result).toBeUndefined();
  });

  it('should return undefined for missing or malformed authorization token', () => {
    const result1 = authorizationToLoginPayload('Bearer ');
    const result2 = authorizationToLoginPayload('InvalidScheme token');

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});
