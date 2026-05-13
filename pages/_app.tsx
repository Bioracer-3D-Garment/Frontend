import type { AppProps } from 'next/app';
import '../styles/index.css';

export default function BioracerApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}