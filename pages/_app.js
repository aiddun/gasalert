import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <title>GasAlert</title>
        <meta name="title" content="GasAlert" />
        <meta
          name="description"
          content="Get text alerts when ethereum gas prices fall below a limit"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gasalert.app/" />
        <meta property="og:title" content="GasAlert" />
        <meta
          property="og:description"
          content="Get text alerts when ethereum gas prices fall below a limit"
        />
        <meta property="og:image" content="" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://gasalert.app/" />
        <meta property="twitter:title" content="GasAlert" />
        <meta
          property="twitter:description"
          content="Get text alerts when ethereum gas prices fall below a limit"
        />
        <meta property="twitter:image" content="/previewimg.jpg"></meta>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
