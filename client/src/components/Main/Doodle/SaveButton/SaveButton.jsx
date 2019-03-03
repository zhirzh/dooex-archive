// @flow

import type { Doodle } from 'modules/types';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Alert from 'components/Alert';

import { savedDoodlesCacheName as CACHE_NAME } from 'modules/names';
import { updateDoodle } from 'reducers/doodles';

import styles from './SaveButton.css';

/**
 * Filter out null links in doodle.
 */
function getValidLinks(doodle: Doodle) {
  const linkTypes = ['url', 'high_res_url'];

  return linkTypes.map(linkType => doodle[linkType]).filter(link => link !== null);
}

/**
 * Add doodle resources to cache.
 */
async function cacheDoodle(doodle: Doodle) {
  const cache = await caches.open(CACHE_NAME);

  const cachePromises = getValidLinks(doodle).map(async (link) => {
    const resp = await fetch(link, { mode: 'no-cors' });

    return cache.put(link, resp);
  });

  return Promise.all(cachePromises);
}

/**
 * Remove doodle resources from cache.
 */
async function uncacheDoodle(doodle: Doodle) {
  const cache = await caches.open(CACHE_NAME);

  const cachePromises = getValidLinks(doodle).map(async link => cache.delete(link));

  return Promise.all(cachePromises);
}

type Props = {
  doodle: Doodle,
  updateDoodle: Function,
};

class SaveButton extends Component<Props> {
  refSpan: HTMLSpanElement;

  toggleSave = async () => {
    this.refSpan.className = styles.isSaving;

    const { doodle } = this.props;

    try {
      if (doodle.isSaved) {
        await uncacheDoodle(doodle);
      } else {
        await cacheDoodle(doodle);
      }

      Alert(`${doodle.isSaved ? 'Unsaved' : 'Saved'} "${doodle.title}"`, 'success');

      this.props.updateDoodle({
        ...doodle,

        isSaved: !doodle.isSaved,
      });
    } catch (err) {
      Alert(`${doodle.isSaved ? 'Unsave' : 'Save'} "${doodle.title}" failed`, 'danger');

      this.refSpan.className = this.props.doodle.isSaved ? styles.saved : styles.notSaved;
    }
  };

  render() {
    return (
      <button className={styles.root} onClick={this.toggleSave}>
        <span
          className={this.props.doodle.isSaved ? styles.saved : styles.notSaved}
          ref={span => (this.refSpan = span)}
        />
      </button>
    );
  }
}

const mapDispatchToProps = {
  updateDoodle,
};

export default connect(null, mapDispatchToProps)(SaveButton);
