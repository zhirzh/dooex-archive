class SavedHandler {
  constructor(sw) {
    this.cache = sw.strategies.cacheFirst({
      cacheName: 'saved',
    });
  }

  /**
   * @param {Object} props
   * @param {FetchEvent} props.event
   * @param {Object} props.params
   * @param {URL} props.url
   */
  handle(props) {
    const url = new URL(props.url.search.replace(/^\?/, ''));
    props.url = url;

    const request = new Request(url, props.event.request);
    props.event = new FetchEvent('fetch', { request });

    return this.cache.handle(props);
  }
}

export default SavedHandler;
