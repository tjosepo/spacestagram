import App, { AppContext } from "next/app";
import type { AppProps } from "next/app";
import Head from "next/head";

import { NasaApiProvider } from "../contexts/NasaApiContext";
import "../styles/globals.css";
import { useEffect } from "react";
import { Header } from "../components";

interface Props extends AppProps {
  apiKey: string;
}

function MyApp({ Component, pageProps, apiKey }: Props) {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <NasaApiProvider apiKey={apiKey}>
      <Head>
        <title>Spacestagram</title>
        <meta
          name="description"
          content="Image-sharing from the final frontier"
        />
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </NasaApiProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const apiKey = process.env.API_KEY;

  return { ...appProps, apiKey };
};

export default MyApp;
