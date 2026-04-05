/**
 * Custom Document Component
 *
 * This component customizes the HTML document structure for all pages.
 * It allows for modifying:
 * - HTML and body tags
 * - Meta tags in the document head
 * - Global scripts and styles
 *
 * This is where you would add global font loading, analytics scripts, etc.
 */

import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
