import { createPasswordHashed } from '../create-password-hashed';
import { validatePassword } from '../validate-password'; // Replace 'your-file' with the actual file path

describe('validatePassword', () => {
  it('should return true for correct password', async () => {
    const password = 'password123';
    const hashedPassword = await createPasswordHashed(password); // Replace with your actual hashing function

    const result = await validatePassword(password, hashedPassword);

    expect(result).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const correctPassword = 'password123';
    const incorrectPassword = 'wrongpassword';
    const hashedPassword = await createPasswordHashed(correctPassword); // Replace with your actual hashing function

    const result = await validatePassword(incorrectPassword, hashedPassword);

    expect(result).toBe(false);
  });
});
