export interface ApiResponse<T> {
    success: boolean;
    data?: T;        // 'data' será del tipo especificado por T
    message?: string;
    error?: string;    // Puedes incluir detalles del error, si los hay
  }