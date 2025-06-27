/**
 * Error fallback component
 */

import { Alert, Button, Card } from 'antd';
import { UI_CONFIG } from '@/config';
import { errorCardStyles, errorAlertStyles } from '@/styles/components';

interface ErrorFallbackProps {
  /** The error that occurred */
  error: Error;
  /** Function to reset the error boundary */
  resetErrorBoundary: () => void;
}

/**
 * Component to display when an error occurs
 */
export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <Card
      title={UI_CONFIG.CARD_TITLES.ERROR}
      style={errorCardStyles}
    >
      <Alert
        message={error.message}
        type="error"
        style={errorAlertStyles}
      />
      <Button
        danger
        onClick={resetErrorBoundary}
        tabIndex={0}
      >
        {UI_CONFIG.BUTTON_TEXT.TRY_AGAIN}
      </Button>
    </Card>
  );
};
