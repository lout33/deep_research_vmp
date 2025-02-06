import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { DeepResearchProvider } from '@/lib/deep-research-context';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DeepResearchProvider>
            <Toaster position="top-center" />
            {children}
          </DeepResearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
