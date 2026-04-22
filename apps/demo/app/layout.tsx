import "@/core/styles.css";
import "@workspace/ui/globals.css";
import "./styles.css";
import { Almarai } from "next/font/google";

const fontSans = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={fontSans.variable}>
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN}
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
