import { hash } from 'bcrypt';

export async function createPasswordHashed(password: string): Promise<string> {
  const saltsOfRounds = 12;

  return hash(password, saltsOfRounds);
}
