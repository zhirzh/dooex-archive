function savedSelector(allDoodles) {
  const matchingDoodles = [];

  for (let i = 0; i < allDoodles.length; i += 1) {
    const doodle = allDoodles[i];

    if (doodle.isSaved) {
      matchingDoodles.push(doodle);
    }
  }

  return matchingDoodles;
}

export default savedSelector;
