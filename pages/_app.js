import "@/styles/globals.css";
import { TutorialProvider } from '../components/TutorialProvider';
import Layout from "@/components/Layout";
import Chatbot from "@/components/Chatbot";
import "@/lib/i18n"; // Initialize i18n

export default function App({ Component, pageProps }) {
  return (
    <TutorialProvider>
      <Layout>
        <Component {...pageProps} />
        <Chatbot />
      </Layout>
    </TutorialProvider>
  );
} 