import type { Metadata } from "next";
import { Quicksand, Fredoka, Lora, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand-next",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka-next",
});

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-zen-maru-gothic",
});

export const viewport = {
  themeColor: "#FAF6EE",
};

export const metadata: Metadata = {
  title: "BéĐọc - Đọc truyện cho bé",
  description: "Kho tàng truyện tranh thiếu nhi hấp dẫn với hình ảnh sinh động và âm thanh lôi cuốn, giúp bé phát triển trí tưởng tượng và thói quen đọc sách mỗi ngày.",
  openGraph: {
    type: "website",
    url: "https://beread.vn/",
    title: "BéĐọc - Đọc truyện cho bé",
    description: "Kho tàng truyện tranh thiếu nhi hấp dẫn với hình ảnh sinh động và âm thanh lôi cuốn, giúp bé phát triển trí tưởng tượng và thói quen đọc sách mỗi ngày.",
    images: [{ url: "https://miniread.app/og-image.png" }],
    siteName: "BéĐọc",
  },
  twitter: {
    card: "summary_large_image",
    title: "BéĐọc - Đọc truyện cho bé",
    description: "Kho tàng truyện tranh thiếu nhi hấp dẫn với hình ảnh sinh động và âm thanh lôi cuốn, giúp bé phát triển trí tưởng tượng và thói quen đọc sách mỗi ngày.",
    images: ["https://miniread.app/og-image.png"],
    creator: "@beread",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${lora.variable} ${quicksand.variable} ${fredoka.variable} ${zenMaruGothic.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface-strong text-surface-base antialiased" suppressHydrationWarning>
        {/* Early inline script: remove known extension-injected attributes before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var re=/^(__processed_|bis_|bis_register|__bs__)/i; function clean(el){if(!el||!el.attributes)return; for(var i=el.attributes.length-1;i>=0;i--){var name=el.attributes[i].name; if(re.test(name)) el.removeAttribute(name);} } clean(document.documentElement); clean(document.body); var hidden = document.querySelectorAll('[hidden]'); hidden.forEach(clean); }catch(e){/* ignore */}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}

