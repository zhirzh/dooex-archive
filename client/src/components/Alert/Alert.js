// @flow

import classAsFunction from 'modules/class-as-function';

import styles from './Alert.css';

type AlertType =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

class Alert {
  div: HTMLDivElement;
  message: string;
  removeTimeoutId: number;
  type: string;

  static queue = [];
  static container: HTMLDivElement;

  static renderContainer() {
    Alert.container = document.createElement('div');
    Alert.container.className = styles.container;

    // $FlowFixMe
    document.body.appendChild(Alert.container);
  }

  constructor(message: string, type: AlertType = 'primary') {
    if (Alert.container === undefined) {
      Alert.renderContainer();
    }

    this.type = type;
    this.message = message;

    this.div = this.createDiv();

    this.render();
  }

  createDiv() {
    const div = document.createElement('div');
    div.innerText = this.message;
    div.className = this.withType(styles.alert);
    div.onclick = () => {
      clearTimeout(this.removeTimeoutId);

      this.remove();
    };

    return div;
  }

  withType = (className: string) => `${className} alert-${this.type}`;

  render() {
    const { div, withType } = this;

    if (Alert.queue.length === 0) {
      // $FlowFixMe
      Alert.container.appendChild(div);
    } else {
      // $FlowFixMe
      Alert.container.insertBefore(div, Alert.queue[0]);
    }
    Alert.queue.unshift(div);

    setTimeout(() => {
      div.className = withType(styles.show);

      this.removeTimeoutId = setTimeout(this.remove, 2000);
    }, 100);
  }

  remove = () => {
    const { div, withType } = this;

    div.className = withType(styles.hide);

    setTimeout(() => {
      Alert.queue.pop();
      div.remove();
    }, 400);
  };
}

export default classAsFunction(Alert);
