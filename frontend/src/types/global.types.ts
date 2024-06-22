export interface CustomError extends Error {
  info?: any;
  status?: number;
}
