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

export const generateId = (length = 10) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 1;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const paginationData = (data: any, page: number, limit: number) => {
  const { count: totalItems, rows: articles } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { articles, totalItems, currentPage, totalPages };
};
