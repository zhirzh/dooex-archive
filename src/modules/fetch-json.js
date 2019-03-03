async function fetchJson(url) {
  const resp = await fetch(url);
  const json = await resp.json();

  return json;
}

export default fetchJson;
