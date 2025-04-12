import useSWR from 'swr';
import { CustomError } from '@/types';

import { LOCAL_IP } from '../../../local.config';

const BASE_URL = `http://${LOCAL_IP}:8008`;

export const customFetch = async <T>(...args: Parameters<typeof fetch>) => {
  const [route, rest] = args;

  const config = {
    ...(rest ?? {}),
    headers: { 'Content-Type': 'application/json' },
  };
  const response = await fetch(`${BASE_URL}${route}`, config);

  if (!response.ok) {
    const error: CustomError = new Error(
      'An error occured while fetching data',
    );
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
};

const useCustomSWR = <T>(route: string) => useSWR<T>(route, customFetch);

export default useCustomSWR;
