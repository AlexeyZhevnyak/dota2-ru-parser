/**
 * Custom hook for handling profile parsing
 */

import { useRef } from 'react';
import { useActionState, useOptimistic } from 'react';
import { parseProfileWithUrl } from '@/app/actions';
import { ApiResponse } from '@/types';

// Initial state for the form
const initialState: ApiResponse = {
  message: '',
};

/**
 * Hook for handling profile parsing form
 * @returns Form state and handlers
 */
export const useProfileParser = () => {
  // Form action state
  const [state, formAction, isPending] = useActionState(parseProfileWithUrl, initialState);
  
  // Form reference for resetting
  const formRef = useRef<HTMLFormElement>(null);
  


  // Optimistic state updates
  const [optimisticState, addOptimisticState] = useOptimistic(
    state,
    (currentState: ApiResponse) => ({
      ...currentState,
      message: 'Обработка вашего запроса...',
    })
  );

  // Combined loading state

  /**
   * Custom form action with optimistic updates
   * @param formData - Form data
   */
  const handleFormAction = async (formData: FormData): Promise<void> => {
    addOptimisticState('optimistic-update');

    try {
      await formAction(formData);
    } catch (error) {
      console.error('Form action failed:', error);
    }
  };

  /**
   * Reset form after submission
   */
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return {
    state,
    optimisticState,
    isLoading: isPending,
    formRef,
    handleFormAction,
    resetForm,
  };
};