"use client";

import {Suspense, useActionState, useOptimistic, useRef} from "react";
import {parseProfileWithUrl} from "@/app/actions";
import {ApiResponse} from "@/types";
import {ErrorBoundary} from "react-error-boundary";
import {useFormStatus} from "react-dom";
import {Alert, Button, Card, Input, Layout, Spin, Typography,} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

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
      {pending ? "Обработка..." : "Анализировать профиль"}
    </Button>
  );
};

// Results display component
const ResultsDisplay = ({ result, loading }: { result: ApiResponse, loading: boolean }) => {
  if (!result.message && !result.data && !result.error && !loading) return null;

  return (
    <Card
      title="Результаты"
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
            tip="Обработка запроса..."
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
                AI Анализ:
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
      title="Что-то пошло не так"
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
        Попробовать снова
      </Button>
    </Card>
  );
};

export const ProfileParserForm = () => {
  const [state, formAction, isPending] = useActionState(parseProfileWithUrl, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useOptimistic(false);
  const [optimisticState, addOptimisticState] = useOptimistic(
      state,
      (currentState: ApiResponse) => ({
        ...currentState,
        message: "Обработка вашего запроса...",
      })
  );

  // Combine both loading states
  const isActuallyLoading = isPending || isLoading;

  // Custom form action with optimistic updates
  const handleFormAction = async (formData: FormData): Promise<void> => {
    setIsLoading(true);
    addOptimisticState("optimistic-update");

    try {
      await formAction(formData);
    } catch (error) {
      console.error('Form action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form after submission
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
      <Content style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <Title level={2} style={{ marginBottom: 24 }}>Анализатор профилей Dota 2</Title>
        <div style={{ width: '100%' }}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Card title="Анализ профиля Dota 2">
              <form
                  ref={formRef}
                  action={handleFormAction}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    URL профиля
                  </Text>
                  <Input
                      id="url"
                      name="url"
                      placeholder="Введите URL профиля Dota 2 (https://dota2.ru/forum/members/ten228.785716/)"
                      aria-label="URL профиля Dota 2"
                      aria-required="true"
                      tabIndex={0}
                      required
                      disabled={isActuallyLoading}
                  />
                  {state.error && (
                      <Text type="danger" style={{ display: 'block', marginTop: 8 }} role="alert">
                        {state.error}
                      </Text>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <SubmitButton isLoading={isActuallyLoading} />
                  <Button
                      onClick={resetForm}
                      tabIndex={0}
                      disabled={isActuallyLoading}
                  >
                    Сбросить
                  </Button>
                </div>
              </form>
            </Card>

            <Suspense fallback={
              <Card style={{ marginTop: 24, width: '100%', height: 160 }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              </Card>
            }>
              <ResultsDisplay result={optimisticState} loading={isActuallyLoading} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </Content>
  );
};
