import { Html, Head, Main, NextScript } from "next/document";

// Runs before first paint: flags the page so [data-reveal] elements stay hidden
// until GSAP animates them in. Skipped when the visitor prefers reduced motion,
// in which case content is simply shown.
const MOTION_FLAG_SCRIPT = `if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion')}`;

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta name="theme-color" content="#efe9dd" />
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG_SCRIPT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
