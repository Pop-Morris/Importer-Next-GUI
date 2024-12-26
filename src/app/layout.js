import "./globals.css";

export const metadata = {
  title: 'Subscriber Importer',
  description: 'Import subscribers to BigCommerce',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
