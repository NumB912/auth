export interface IRequest {
  body: unknown;
  token: string;
  params: Record<string, string | number | boolean>;
  queries: Record<string, string | number | boolean>;
}

export interface IResponse {
  status?: number;
  message?: string;
  data?: string;
}
