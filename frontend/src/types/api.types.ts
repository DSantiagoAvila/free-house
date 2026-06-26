export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
