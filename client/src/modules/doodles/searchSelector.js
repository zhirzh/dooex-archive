function searchSelector(allDoodles, searchKeyword) {
  if (searchKeyword.length === 0) {
    return [];
  }

  const matchingDoodles = [];
  const searchFilter = new RegExp(`\\b${searchKeyword}\\b`, 'i');

  for (let i = 0; i < allDoodles.length; i += 1) {
    const doodle = allDoodles[i];

    if (searchFilter.test(doodle.title)) {
      matchingDoodles.push(doodle);
    }
  }

  return matchingDoodles;
}

export default searchSelector;
