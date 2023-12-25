import React from "react";

import styles from "../../styles/Note.module.css";

interface Props {
  children: React.ReactElement[];
}

export default function Note(props: Props) {
  return <aside className={styles.note}>{props.children}</aside>;
}
