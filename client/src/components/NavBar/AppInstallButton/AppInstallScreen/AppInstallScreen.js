// @flow

import classAsFunction from 'modules/class-as-function';

import styles from './AppInstallScreen.css';

class AppInstallScreen {
  component: HTMLDivElement;

  constructor() {
    this.component = document.createElement('div');
    this.component.className = styles.root;

    this.component.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div>
              <h3>Install DooEx</h3>

              <p>
                Tap

                <span class="fa fa-fw fa-ellipsis-v"></span>

                to bring up your browser menu and select 'Add to Home screen' to install the DooEx web app
              </p>

              <button id="got-it" class="btn btn-secondary btn-block">Got it</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // $FlowFixMe
    this.component.querySelector('#got-it').onclick = this.unmount;

    this.render();
  }

  unmount = () => {
    this.component.remove();
  };

  render() {
    // $FlowFixMe
    document.body.appendChild(this.component);
  }
}

export default classAsFunction(AppInstallScreen);
