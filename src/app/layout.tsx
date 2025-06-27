import type {Metadata} from "next";
import {ConfigProvider} from "antd";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';

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
            <AntdRegistry>
                {children}
            </AntdRegistry>

            </ConfigProvider>

        </body>
        </html>
    );
}
