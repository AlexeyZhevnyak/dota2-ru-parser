'use client'
/**
 * Profile parser form component
 */

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Card, Input, Layout, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { useProfileParser } from '@/hooks/useProfileParser';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { ResultsDisplay } from '@/components/ui/ResultsDisplay';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { UI_CONFIG } from '@/config';
import {
  contentStyles,
  titleStyles,
  fullWidthStyles,
  formStyles,
  formLabelStyles,
  formErrorStyles,
  formButtonsStyles,
  loadingFallbackCardStyles
} from '@/styles/components';

const { Title, Text } = Typography;
const { Content } = Layout;

/**
 * Form for parsing Dota 2 profiles
 */
export const ProfileParserForm = () => {
  // Use the custom hook for form handling
  const {
    optimisticState,
    isLoading,
    formRef,
    handleFormAction,
    resetForm,
  } = useProfileParser();

  return (
    <Content style={contentStyles}>
      <Title level={2} style={titleStyles}>
        Анализатор профилей Dota 2
      </Title>

      <div style={fullWidthStyles}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Form card */}
          <Card title={UI_CONFIG.CARD_TITLES.PROFILE_ANALYZER}>
            <form
              ref={formRef}
              action={handleFormAction}
              style={formStyles}
            >
              {/* URL input */}
              <div>
                <Text strong style={formLabelStyles}>
                  {UI_CONFIG.FORM_LABELS.PROFILE_URL}
                </Text>
                <Input
                  id="url"
                  name="url"
                  placeholder={UI_CONFIG.PLACEHOLDERS.PROFILE_URL}
                  aria-label="URL профиля Dota 2"
                  aria-required="true"
                  tabIndex={0}
                  required
                  disabled={isLoading}
                />
                {optimisticState.error && (
                  <Text type="danger" style={formErrorStyles} role="alert">
                    {optimisticState.error}
                  </Text>
                )}
              </div>

              {/* Form buttons */}
              <div style={formButtonsStyles}>
                <SubmitButton isLoading={isLoading} />
                <Button
                  onClick={resetForm}
                  tabIndex={0}
                  disabled={isLoading}
                >
                  {UI_CONFIG.BUTTON_TEXT.RESET}
                </Button>
              </div>
            </form>
          </Card>

          {/* Results display with suspense */}
          <Suspense fallback={
            <Card style={loadingFallbackCardStyles}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </Card>
          }>
            <ResultsDisplay result={optimisticState} loading={isLoading} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Content>
  );
};
