function dateSelector(allDoodles, dateFrom, dateTo) {
  const matchingDoodles = [];

  const _from = Date.UTC(dateFrom.year, dateFrom.month, dateFrom.day);
  const _to = Date.UTC(dateTo.year, dateTo.month, dateTo.day);

  for (let i = 0; i < allDoodles.length; i += 1) {
    const doodle = allDoodles[i];

    const _date = Date.parse(doodle.date);

    if (_date >= _from && _date <= _to) {
      matchingDoodles.push(doodle);
    }
  }

  return matchingDoodles;
}

export default dateSelector;
