export interface ApiResponse<T = unknown> {
  success: boolean;
  path: string;
  timestamp: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors: unknown[];
  errorCode?: string;
  timestamp: string;
  path: string;
}
