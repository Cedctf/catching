import "@/styles/globals.css";
import Layout from "@/components/Layout";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Catching - Digital Payment Platform</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>C</text></svg>" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
} 