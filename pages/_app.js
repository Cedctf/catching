import "@/styles/globals.css";
import Layout from "@/components/Layout";
import Chatbot from "@/components/Chatbot";
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Chatbot />
    </Layout>
  );
} 