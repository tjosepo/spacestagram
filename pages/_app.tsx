import App, { AppContext } from "next/app";
import type { AppProps } from "next/app";
import Head from "next/head";

import { NasaApiProvider } from "../contexts/NasaApiContext";
import "../styles/globals.css";
import { useEffect } from "react";
import { Header } from "../components";
import { SpacestagramProvider } from "../contexts/SpacestagramContext";
import { SnackbarProvider } from "../contexts/SnackbarContext";

interface Props extends AppProps {
  apiKey: string;
}

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
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
    </>
  );
}

export default MyApp;
