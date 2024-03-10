import * as bcrypt from 'bcrypt';
export async function generateHash(
  password: string,
  saltRounds = 10,
): Promise<string> {
  const hash = bcrypt.hash(password, saltRounds);
  return hash;
}

export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  const match = bcrypt.compare(password, hash);
  return match;
}
