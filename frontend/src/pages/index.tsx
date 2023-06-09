import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import NAV from "../../components/Nav";
import INTRO from "../../components/Intro";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Pudgy Treasures</title>
        <meta name="description" content="Generated by Billyjitsu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NAV />
        <INTRO />
      </main>
    </>
  );
}
