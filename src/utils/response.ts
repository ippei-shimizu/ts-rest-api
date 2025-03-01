import http from "http";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function sendSuccessResponse<T>(
  res: http.ServerResponse,
  data: T,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(response));
}

export function sendErrorResponse(
  res: http.ServerResponse,
  message: string,
  statusCode: number = 400
): void {
  const response: ApiResponse<null> = {
    success: false,
    error: message,
  };

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(response));
}
