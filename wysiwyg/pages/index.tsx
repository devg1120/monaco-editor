import React, { ReactElement } from "react";
import Head from "next/head";
import Editor from "@monaco-editor/react";

import convert from "../src/unified";

import styles from "../styles/Home.module.css";

const initial = "# Write your own story";

export default function Home() {
  const [text, setText] = React.useState(initial);

  function handleChange(text: string | undefined) {
    if (text === undefined) {
      return;
    }
    setText(text);
  }

  return (
    <div>
      <Head>
        <title>WYSIWYG editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Editor
          height="100vh"
          width="50%"
          defaultLanguage="markdown"
          defaultValue={initial}
          onChange={handleChange}
        />
        <div className={styles.preview}>{convert(text)}</div>
      </main>
    </div>
  );
}
