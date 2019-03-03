function selectDoodles(allDoodles, filters) {
  return allDoodles.filter((doodle) => {
    if (filters.length === 0) {
      return true;
    }

    for (let i = 0; i < filters.length; i += 1) {
      const filter = filters[i];

      switch (filter.type) {
        case 'country':
          if (doodle.countries.includes(filter.value)) {
            return true;
          }
          break;

        case 'type':
          if (doodle.type === filter.value) {
            return true;
          }
          break;

        default:
          throw Error();
      }
    }

    return false;
  });
}

export default selectDoodles;
