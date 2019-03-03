// @flow

async function fetchJson(url: string) {
  const resp = await fetch(url);
  const json = await resp.json();

  return json;
}

export default fetchJson;
