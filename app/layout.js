export const metadata = {
  title: 'FIND TEE TIMES — Golf Course Booking',
  description: 'Find and book tee times at golf courses near you. Premium brutalist design meets functional golf booking.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tee Times'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2C5530'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          body {
            background-color: #F5F1E8;
            color: #1A1A1A;
            min-height: 100vh;
            line-height: 1.5;
          }

          /* Utility classes for the design system */
          .font-mono {
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
          }

          /* Remove default focus outlines and add custom */
          :focus {
            outline: none;
          }

          :focus-visible {
            outline: 3px solid #2C5530;
            outline-offset: 2px;
          }

          /* Custom scrollbar for webkit browsers */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #F5F1E8;
          }

          ::-webkit-scrollbar-thumb {
            background: #1A1A1A;
            border: 2px solid #F5F1E8;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #2C5530;
          }

          /* Selection styling */
          ::selection {
            background-color: #2C5530;
            color: #F5F1E8;
          }

          /* Smooth transitions */
          button, a, input, select {
            transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          }

          /* Active states */
          button:active, a:active {
            transform: translateY(1px);
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
