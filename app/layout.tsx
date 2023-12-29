import { cn } from "@/lib/utils";
import { Inter as FontSans, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "./auth/Provider";
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from "@/components/NavBar";



const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <NavBar />
              {children}
              <Toaster richColors position="top-center" />
            </AuthProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
