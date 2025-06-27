/**
 * Component styles
 */

/**
 * Content layout styles
 */
export const contentStyles = {
    padding: 32,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
};

/**
 * Title styles
 */
export const titleStyles = {
    marginBottom: 24,
};

/**
 * Full width container styles
 */
export const fullWidthStyles = {
    width: '100%',
};

/**
 * Form styles
 */
export const formStyles = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 16,
};

/**
 * Form label styles
 */
export const formLabelStyles = {
    display: 'block' as const,
    marginBottom: 8,
};

/**
 * Form error styles
 */
export const formErrorStyles = {
    display: 'block' as const,
    marginTop: 8,
};

/**
 * Form buttons container styles
 */
export const formButtonsStyles = {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
};

/**
 * Loading overlay styles
 */
export const loadingOverlayStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 1,
    borderRadius: '8px',
};

/**
 * Results card styles
 */
export const resultsCardStyles = {
    marginTop: 24,
    width: '100%',
    position: 'relative' as const,
};

/**
 * Analysis container styles
 */
export const analysisContainerStyles = {
    marginTop: 16,
};

/**
 * Analysis content styles
 */
export const analysisContentStyles = {
    background: '#e6f7ff',
    border: '1px solid #91d5ff',
    borderRadius: 4,
    padding: 16,
    overflowY: 'auto' as const,
    maxHeight: 384,
};

/**
 * Analysis text styles
 */
export const analysisTextStyles = {
    whiteSpace: 'pre-wrap' as const,
};

/**
 * Error card styles
 */
export const errorCardStyles = {
    marginBottom: 16,
    background: '#fff1f0',
    borderColor: '#ffa39e',
};

/**
 * Error alert styles
 */
export const errorAlertStyles = {
    marginBottom: 16,
};

/**
 * Loading fallback card styles
 */
export const loadingFallbackCardStyles = {
    marginTop: 24,
    width: '100%',
    height: 160,
};