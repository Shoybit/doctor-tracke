import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Doctor Tracker",
  description: "Doctor Tracker Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}