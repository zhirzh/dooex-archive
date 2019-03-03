function filterSelector(allDoodles, allFilters) {
  if (allFilters.length === 0) {
    return allDoodles;
  }

  const matchingDoodles = [];

  for (let i = 0; i < allDoodles.length; i += 1) {
    const doodle = allDoodles[i];

    let shouldInclude = false;

    for (let j = 0; j < allFilters.length; j += 1) {
      const filter = allFilters[j];

      switch (filter.type) {
        case 'country':
          if (doodle.countries.includes(filter.value)) {
            shouldInclude = true;
          }
          break;

        case 'type':
          if (doodle.type === filter.value) {
            shouldInclude = true;
          }
          break;

        default:
          throw Error();
      }

      if (shouldInclude) {
        break;
      }
    }

    if (shouldInclude) {
      matchingDoodles.push(doodle);
    }
  }

  return matchingDoodles;
}

export default filterSelector;
