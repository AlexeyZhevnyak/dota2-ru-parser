/**
 * Results display component
 */

import {Alert, Card, Spin, Typography} from 'antd';
import {ApiResponse} from '@/types';
import {UI_CONFIG} from '@/config';
import {
    analysisContainerStyles,
    analysisContentStyles,
    formLabelStyles,
    loadingOverlayStyles,
    resultsCardStyles
} from '@/styles/components';
import {LoadingOutlined} from "@ant-design/icons";
import {markdownToHtml} from '@/utils/markdownToHtml';

const {Text} = Typography;

interface ResultsDisplayProps {
    /** API response data */
    result: ApiResponse;
    /** Whether the component is in a loading state */
    loading: boolean;
}

/**
 * Component to display the results of the profile parsing
 */
export const ResultsDisplay = ({result, loading}: ResultsDisplayProps) => {
    // Don't render anything if there's no data and we're not loading
    if (!result.message && !result.data && !result.error && !loading) return null;

    return (
        <Card
            title={UI_CONFIG.CARD_TITLES.RESULTS}
            style={resultsCardStyles}
        >
            {/* Loading overlay */}
            {loading && (
                <div style={loadingOverlayStyles}>
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
                    />
                </div>
            )}
            {result.error ? (
                <Alert
                    message={result.error}
                    type="error"
                    showIcon
                />
            ) : (
                <>
                    {result.analysis && (
                        <div style={analysisContainerStyles}>
                            <Text strong style={formLabelStyles}>
                                {UI_CONFIG.FORM_LABELS.AI_ANALYSIS}
                            </Text>
                            <div 
                                style={analysisContentStyles}
                                dangerouslySetInnerHTML={{ 
                                    __html: markdownToHtml(result.analysis || '') 
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </Card>
    );
};
