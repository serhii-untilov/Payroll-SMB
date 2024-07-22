import { ApiError } from '@/api';

export function errorMessage(error: unknown): string {
    const e = error as ApiError;
    return e.message || e.error || e.statusCode || 'Unknown error';
}
