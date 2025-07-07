import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Tailwind CSS Browser v4 */}
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

      </Head>
      <Component {...pageProps} />
    </>
  );
}
