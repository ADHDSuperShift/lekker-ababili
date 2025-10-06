import { useState, useCallback } from 'react';
import { ApiResponse } from '../lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        const errorMessage = response.error || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (
    apiCall: (params: P) => Promise<ApiResponse<T>>,
    params: P,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall(params);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        const errorMessage = response.error || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, []);

  return {
    ...state,
    mutate,
  };
}