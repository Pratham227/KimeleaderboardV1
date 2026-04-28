import './globals.css'

export const metadata = {
  title: 'Kime Careers · Counsellor Leaderboard',
  description: 'Premium gamified leaderboard for Kime Careers counsellors',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="bg-[#05050f] text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
