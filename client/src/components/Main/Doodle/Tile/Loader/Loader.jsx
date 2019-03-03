// @flow

import React from 'react';

import styles from './Loader.css';

const r = 60;
const t = 1.4;

type Props = { begin: number };

function Circle(props: Props) {
  const { begin } = props;

  return (
    <circle cx={r} cy={r} r="1">
      <animate
        attributeName="r"
        begin={`${begin}s`}
        dur={`${t}s`}
        values={`1; ${r}`}
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.165, 0.84, 0.44, 1"
        repeatCount="indefinite"
      />

      <animate
        attributeName="stroke-opacity"
        begin={`${begin}s`}
        dur={`${t}s`}
        values="1; 0"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.3, 0.61, 0.355, 1"
        repeatCount="indefinite"
      />
    </circle>
  );
}

function Loader() {
  return (
    <svg
      className={styles.root}
      xmlns="http://www.w3.org/2000/svg"
      width={2 * r}
      height={2 * r}
      viewBox={`0 0 ${2 * r} ${2 * r}`}
    >
      <g fill="none" strokeWidth="3">
        <Circle begin={0} />

        <Circle begin={-0.3 * t} />
      </g>
    </svg>
  );
}

export default Loader;
