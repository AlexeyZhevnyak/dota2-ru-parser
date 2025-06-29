'use client'
/**
 * Submit button component with loading state
 */

import {Button} from 'antd';
import {useFormStatus} from 'react-dom';
import {UI_CONFIG} from '@/config';

interface SubmitButtonProps {
    /** Whether the form is in a loading state */
    isLoading: boolean;
}

/**
 * Submit button component with loading state
 */
export const SubmitButton = ({isLoading}: SubmitButtonProps) => {
    const {pending} = useFormStatus();
    const isButtonLoading = pending || isLoading;

    return (
        <Button
            type="primary"
            htmlType="submit"
            loading={isButtonLoading}
            disabled={isButtonLoading}
            aria-label="Parse profile"
            tabIndex={0}
        >
            {isButtonLoading ? UI_CONFIG.LOADING_TEXT.FORM_PROCESSING : UI_CONFIG.BUTTON_TEXT.ANALYZE}
        </Button>
    );
};
