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
  // 서비스워커 등록
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registration successful with scope:", registration.scope);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  }

  // FCM onMessage(포그라운드 알림)
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("Foreground FCM 수신:", payload);
    alert(payload.notification?.title + "\n" + payload.notification?.body);
  });
}, []);

  return <div>{getLayout(<Component {...pageProps} />)}</div>;
}
