import type {Metadata} from "next";
import {ConfigProvider} from "antd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Парсер профилей D2ru",
  description: "Анализ профилей Dota 2 ru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1677ff",
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
