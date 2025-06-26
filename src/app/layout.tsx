import type { Metadata } from "next";
import { ConfigProvider } from "antd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dota 2 Profile Parser",
  description: "Parse Dota 2 profiles and analyze player statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
