// src/app/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}