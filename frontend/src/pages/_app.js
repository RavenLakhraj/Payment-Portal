import '../styles/globals.css';  // <-- Import Tailwind + global CSS

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;