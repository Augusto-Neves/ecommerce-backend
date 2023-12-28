import { compare } from 'bcrypt';

export async function validatePassword(
  password: string,
  passwordHashed: string,
): Promise<boolean> {
  return compare(password, passwordHashed);
}
