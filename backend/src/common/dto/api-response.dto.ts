export interface ApiResponse<T> {
  payload?: string;
  success?: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export function createEncryptedResponse<T>(payload: T): ApiResponse<T> {
  const { encryptPayload } = require("../crypto.helper");
  return { payload: encryptPayload(payload) };
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function createErrorResponse(error: string, statusCode: number): ApiResponse<null> {
  return { success: false, error, statusCode };
}
