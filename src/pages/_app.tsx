import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactNode, useEffect } from "react";
import { onMessage, messaging } from "@/utils/firebase";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({ Component, pageProps }: AppProps & { Component: NextPageWithLayout }) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
   useEffect(() => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("Foreground FCM 수신:", payload);
      alert(payload.notification?.title + "\n" + payload.notification?.body);
    });
  }, []);
  return <div>{getLayout(<Component {...pageProps} />)}</div>;
}
