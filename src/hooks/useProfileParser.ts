/**
 * Custom hook for handling profile parsing
 */

import {useActionState, useOptimistic, useRef} from 'react';
import {parseProfileWithUrl} from '@/app/actions';
import {ApiResponse} from '@/types';

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
    const [optimisticState] = useOptimistic(
        state,
        (currentState: ApiResponse) => ({
            ...currentState,
            message: 'Обработка вашего запроса...',
        })
    );

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
        formAction,
        resetForm,
    };
};