import "./globals.css";

export const metadata = {
  title: "Nómada",
  description: "E-commerce de mochilas minimalistas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
