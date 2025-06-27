'use client'
/**
 * Profile parser form component
 */

import {ErrorBoundary} from 'react-error-boundary';
import {Button, Card, Input, Layout, Typography} from 'antd';

import {useProfileParser} from '@/hooks/useProfileParser';
import {SubmitButton} from '@/components/ui/SubmitButton';
import {ResultsDisplay} from '@/components/ui/ResultsDisplay';
import {ErrorFallback} from '@/components/ui/ErrorFallback';
import {UI_CONFIG} from '@/config';
import {
    contentStyles,
    formButtonsStyles,
    formErrorStyles,
    formLabelStyles,
    formStyles,
    fullWidthStyles,
    titleStyles
} from '@/styles/components';

const {Title, Text} = Typography;
const {Content} = Layout;

/**
 * Form for parsing Dota 2 profiles
 */
export const ProfileParserForm = () => {
    // Use the custom hook for form handling
    const {
        optimisticState,
        isLoading,
        formRef,
        formAction,
        resetForm,
    } = useProfileParser();

    return (
        <Content style={contentStyles}>
            <Title level={2} style={titleStyles}>
                Анализатор профилей Dota 2 ru
            </Title>

            <div style={fullWidthStyles}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    {/* Form card */}
                    <Card title={UI_CONFIG.CARD_TITLES.PROFILE_ANALYZER}>
                        <form
                            ref={formRef}
                            action={formAction}
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
                                <Text strong style={formLabelStyles}>
                                    {UI_CONFIG.FORM_LABELS.PROMPT_LABEL}
                                </Text>
                                <Input
                                    id="prompt"
                                    name="prompt"
                                    aria-label="URL профиля Dota 2"
                                    aria-required="true"
                                    tabIndex={1}
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
                                <SubmitButton isLoading={isLoading}/>
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
                    <ResultsDisplay result={optimisticState} loading={isLoading}/>
                </ErrorBoundary>
            </div>
        </Content>
    );
};
