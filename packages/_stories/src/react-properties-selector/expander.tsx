import React from "react";
import { csjs } from "csjs";
import { insertCss } from "insert-css";
import * as Values from "./values";

const styles = csjs`
  .expander {
      border: 1px solid #ccc;
  }
  
  .expanderHeader {
    background-color: ${Values.primaryColor05};
    border-bottom: 1px solid #ccc;
    line-height: 2.5em;
    padding-left: 0.5em;
    cursor: pointer;
  }
  
  .expanderHeader:hover {
    background-color: ${Values.primaryColor20};
  }
`;

insertCss(csjs.getCss(styles));

interface Props {
  readonly header: string;
  readonly closed: boolean;
  readonly closedChanged: (closed: boolean) => void;
  readonly children?: ReadonlyArray<React.ReactElement<{}>>;
}

export function Expander({
  header,
  closed,
  closedChanged,
  children
}: Props): React.ReactElement<Props> {
  return (
    <div className={styles.expander}>
      <div
        className={styles.expanderHeader}
        onClick={() => closedChanged(!closed)}
      >
        <i className={closed ? "fa fa-chevron-right" : "fa fa-chevron-down"} />
        {" " + header}
      </div>
      {closed ? "" : children}
    </div>
  );
}
