import "@/styles/globals.css";
import Chatbot from '../components/Chatbot';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Chatbot />
    </>
  );
}

export default MyApp;