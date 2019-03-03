import React from 'react';
import { Link } from 'react-router';

import { saveDoodle, unsaveDoodle } from 'modules/doodles/manage-save';

import SaveButton from './components/SaveButton';

import styles from './Doodle.scss';

class Doodle extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.doodle !== this.props.doodle;
  }

  modalPathname(modalType) {
    const parentPathname = this.props.location.pathname.replace(/\/$/, '');

    return {
      ...this.props.location,
      pathname: `${parentPathname}/${modalType}/${this.props.doodle.id}`,
      state: { modal: true },
    };
  }

  toggleSave = async () => {
    try {
      if (this.props.doodle.isSaved) {
        await unsaveDoodle(this.props.doodle);
      } else {
        await saveDoodle(this.props.doodle);
      }
    } catch (err) {
      console.error(err);
      alert(`${this.props.doodle.isSaved ? 'UNSAVE' : 'SAVE'} FAILED`);

      return;
    }

    this.props.toggleSave(this.props.doodle);
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.heading}>
          <span>
            {this.props.doodle.title}
          </span>

          <div className={styles.actions}>
            <Link to={this.modalPathname('info')}>
              <span className="glyphicon glyphicon-info-sign" />
            </Link>

            <SaveButton isSaved={this.props.doodle.isSaved} onClick={this.toggleSave} />
          </div>
        </div>

        <Link to={this.modalPathname('expo')}>
          <img src={this.props.doodle.url} alt={this.props.doodle.title} />
        </Link>
      </div>
    );
  }
}

export default Doodle;
