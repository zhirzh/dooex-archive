import React from 'react';
import PropTypes from 'prop-types';

import styles from './SaveButton.css';

function SaveButton(props) {
  const classNameParts = [styles.root];

  if (props.isSaved) {
    if (props.isTarget) {
      classNameParts.push('btn-danger');
    } else {
      classNameParts.push('btn-primary');
    }
  } else {
    classNameParts.push('btn-default');
  }

  return (
    <button
      className={classNameParts.join(' ')}

      onClick={props.onClick}

      onFocus={props.onFocus}
      onBlur={props.onBlur}

      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}

      role="checkbox"
      aria-label="save doodle"
      // eslint-disable-next-line jsx-a11y/aria-proptypes
      aria-checked={`${props.isSaved}`}
    >
      {props.isSaved
        ? <span className="glyphicon glyphicon-floppy-saved" />
        : <span className="glyphicon glyphicon-floppy-disk" />
      }
    </button>
  );
}

SaveButton.propTypes = {
  isSaved: PropTypes.bool.isRequired,
  isTarget: PropTypes.bool.isRequired,

  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

export default SaveButton;
