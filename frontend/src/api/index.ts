import useSWR from 'swr';

interface CustomError extends Error {
  info?: any;
  status?: number;
}

const BASE_URL = 'http://localhost:8008';

export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const [route, ...rest] = args;

  const config = { ...rest, headers: { 'Content-Type': 'application/json' } };
  const response = await fetch(`${BASE_URL}${route}`, config);

  if (!response.ok) {
    const error: CustomError = new Error(
      'An error occured while fetching data'
    );
    error.info = response.json();
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

const customSWR = <T>(route: string) => useSWR<T>(route, fetcher);

export default customSWR;
