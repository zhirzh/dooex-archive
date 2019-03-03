// @flow

import React from 'react';
import Link from 'react-router-dom/Link';

import Alert from 'components/Alert';

type Props = Object;

function handleClick(e: MouseEvent) {
  if (navigator.onLine === false) {
    e.preventDefault();

    Alert('You are offline', 'danger');
  }
}

function OnlineLink(props: Props) {
  if (props.force) {
    return <Link {...props} />;
  }

  return <Link {...props} onClick={handleClick} />;
}

export default OnlineLink;
