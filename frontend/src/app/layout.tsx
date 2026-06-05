import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Quicksand:wght@300..700&family=Fredoka:wght@300..700&family=Zen+Maru+Gothic:wght@300..900&display=swap" rel="stylesheet" />
      </head>
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


