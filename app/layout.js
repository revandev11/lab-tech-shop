import "./globals.css";
import Navbar from "./components/Navbar";
import AdBanner from "./components/AdBanner";

export const metadata = {
  title: "TechCart: gadgets & ads",
  description: "The best tech gadgets on the internet. Also the most ads.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <AdBanner />
        {children}
      </body>
    </html>
  );
}
