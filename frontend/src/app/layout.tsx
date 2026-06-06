import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  themeColor: "#FAF6EE",
};

export const metadata: Metadata = {
  title: "MiniRead - Đọc truyện cho bé",
  description: "Kho tàng truyện tranh thiếu nhi hấp dẫn với hình ảnh sinh động và âm thanh lôi cuốn, giúp bé phát triển trí tưởng tượng và thói quen đọc sách mỗi ngày.",
  openGraph: {
    type: "website",
    url: "https://miniread.app/",
    title: "MiniRead - Đọc truyện cho bé",
    description: "Kho tàng truyện tranh thiếu nhi hấp dẫn với hình ảnh sinh động và âm thanh lôi cuốn, giúp bé phát triển trí tưởng tượng và thói quen đọc sách mỗi ngày.",
    images: [{ url: "https://miniread.app/og-image.png" }],
    siteName: "MiniRead",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiniRead - Đọc truyện cho bé",
    description: "Kho tàng truyện tranh thiếu nhi hấp dẫn với hình ảnh sinh động và âm thanh lôi cuốn, giúp bé phát triển trí tưởng tượng và thói quen đọc sách mỗi ngày.",
    images: ["https://miniread.app/og-image.png"],
    creator: "@miniread",
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
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=Barlow:wght@300;400;500;600&family=Quicksand:wght@300..700&family=Fredoka:wght@300..700&family=Zen+Maru+Gothic:wght@300..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface-strong text-surface-base antialiased" suppressHydrationWarning>
        {/* Strip extension-injected attributes that break React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=/^(__processed_|bis_|bis_register|__bs__)/i;function c(n){if(!n||!n.attributes)return;for(var i=n.attributes.length-1;i>=0;i--){var a=n.attributes[i].name;if(r.test(a))n.removeAttribute(a);}}c(document.documentElement);c(document.body);var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var t=m[i];if(t.type==='attributes'&&r.test(t.attributeName))t.target.removeAttribute(t.attributeName);}});o.observe(document.documentElement,{attributes:true,subtree:true});document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){c(document.documentElement);c(document.body);},0);});})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
