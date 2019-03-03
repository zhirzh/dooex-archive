// @flow

import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history = process.env.SERVER ? createMemoryHistory() : createBrowserHistory();

export default history;
