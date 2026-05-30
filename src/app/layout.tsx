import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIICC — AI 创新项目辅导平台',
  description: '引导学员从创意到交付，完成 ICC 大赛参赛项目',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
