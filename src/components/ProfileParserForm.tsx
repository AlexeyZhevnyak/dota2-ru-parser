"use client";

import { useRef, useEffect } from "react";
import { useActionState, useOptimistic } from "react";
import { parseProfileWithUrl } from "@/app/actions";
import { ApiResponse } from "@/types";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { useFormStatus } from "react-dom";
import { 
  Button, 
  Card, 
  Input,
  Alert,
  Spin, 
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { Typography, Layout } from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;

// Initial state for the form
const initialState: ApiResponse = {
  message: "",
};

// Form submit button with loading state
const SubmitButton = ({ isLoading }: { isLoading: boolean }) => {
  const { pending } = useFormStatus();
  const isDisabled = pending || isLoading;

  return (
    <Button
      type="primary"
      htmlType="submit"
      loading={pending}
      disabled={isDisabled}
      aria-label="Parse profile"
      tabIndex={0}
    >
      {pending ? "Parsing..." : "Parse Profile"}
    </Button>
  );
};

// Results display component
const ResultsDisplay = ({ result, loading }: { result: ApiResponse, loading: boolean }) => {
  if (!result.message && !result.data && !result.error && !loading) return null;

  return (
    <Card 
      title="Results" 
      style={{ marginTop: 24, width: '100%', position: 'relative' }}
    >
      {loading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          borderRadius: "8px",
        }}>
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} 
            tip="Processing request..."
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
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                AI Analysis:
              </Text>
              <div style={{ 
                background: '#e6f7ff', 
                border: '1px solid #91d5ff', 
                borderRadius: 4, 
                padding: 16, 
                overflowY: 'auto', 
                maxHeight: 384 
              }}>
                <Text style={{ whiteSpace: 'pre-wrap' }}>{result.analysis}</Text>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <Card 
      title="Something went wrong" 
      style={{ marginBottom: 16, background: '#fff1f0', borderColor: '#ffa39e' }}
    >
      <Alert
        message={error.message}
        type="error"
        style={{ marginBottom: 16 }}
      />
      <Button 
        danger 
        onClick={resetErrorBoundary}
        tabIndex={0}
      >
        Try again
      </Button>
    </Card>
  );
};

export const ProfileParserForm = () => {
  const [state, formAction] = useActionState(parseProfileWithUrl, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useOptimistic(false);
  const [loadingStartTime, setLoadingStartTime] = useOptimistic<number | null>(null);
  const [optimisticState, addOptimisticState] = useOptimistic(
    state,
    (currentState: ApiResponse) => ({
      ...currentState,
      message: "Processing your request...",
    })
  );

  // Ensure minimum loading time for better UX
  const MIN_LOADING_TIME = 800; // milliseconds

  useEffect(() => {
    if (isLoading && loadingStartTime === null) {
      // Set the loading start time when loading begins
      setLoadingStartTime(Date.now());
    } else if (!isLoading && loadingStartTime !== null) {
      // Calculate how long the loader has been displayed
      const elapsedTime = Date.now() - loadingStartTime;

      // If less than minimum time, wait before hiding
      if (elapsedTime < MIN_LOADING_TIME) {
        const remainingTime = MIN_LOADING_TIME - elapsedTime;
        const timeoutId = setTimeout(() => {
          setLoadingStartTime(null);
        }, remainingTime);

        // Clean up timeout if component unmounts
        return () => clearTimeout(timeoutId);
      } else {
        // Reset loading start time
        setLoadingStartTime(null);
      }
    }
  }, [isLoading, loadingStartTime]);

  // Custom form action with optimistic updates
  const handleFormAction = (formData: FormData) => {
    setIsLoading(true);
    addOptimisticState("optimistic-update");

    // Use Promise to handle the completion of the form action
    const actionPromise = formAction(formData);

    // When the action completes, set loading to false
    actionPromise.then(() => {
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    return actionPromise;
  };

  // Reset form after submission
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // Determine if we're in a loading state
  const isLoadingState = isLoading || loadingStartTime !== null;

  return (
      <Content style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <Title level={2} style={{ marginBottom: 24 }}>Dota 2 Profile Parser</Title>
        <div style={{ width: '100%',}}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Card title="Parse Dota 2 Profile">
              <form
                  ref={formRef}
                  action={handleFormAction}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Profile URL
                  </Text>
                  <Input
                      id="url"
                      name="url"
                      placeholder="Enter Dota 2 profile URL"
                      aria-label="Dota 2 profile URL"
                      aria-required="true"
                      tabIndex={0}
                      required
                      disabled={isLoadingState}
                  />
                  {state.error && (
                      <Text type="danger" style={{ display: 'block', marginTop: 8 }} role="alert">
                        {state.error}
                      </Text>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <SubmitButton isLoading={isLoadingState} />
                  <Button
                      onClick={resetForm}
                      tabIndex={0}
                      disabled={isLoadingState}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            <Suspense fallback={
              <Card style={{ marginTop: 24, width: '100%', height: 160 }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              </Card>
            }>
              <ResultsDisplay result={optimisticState} loading={isLoadingState} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </Content>

  );
};
