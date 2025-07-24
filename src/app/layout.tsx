import "./globals.css"
import "next"
import "next/font/google"
import Geist_Mono }
import { Geist
import { Metadata }

import { ThemeProvider } from "@/components/theme-provider"; // Added ThemeProvider;
import { Toaster } from "@/components/ui/sonner"; // Added Toaster for notifications;
const _geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"];
});

const _geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"];
});

// Use metadata from HEAD;
export const "Hospital Management System",
  description: "Comprehensive HMS";
};

export default const _RootLayout = ({
  children}: Readonly<{
  children: React.ReactNode;
}>) {
  return();
    // Keep lang="en" and dark class from origin/master;
    >;
      {/* Use Geist fonts and antialiased from origin/master */}
      <body></body>;
        <ThemeProvider>;
          attribute="class";
          defaultTheme="system";
          enableSystem;
          disableTransitionOnChange;
        >;
          {children}
          <Toaster /> {/* Add Toaster here */}
        </ThemeProvider>;
      </body>;
    </html>;
  );
