import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App com OpenAI API",
  description: "Treina-DEV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={` w-screen
          antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
