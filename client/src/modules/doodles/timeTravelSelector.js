function timeTravelSelector(allDoodles, distance) {
  if (distance < 0) {
    return [];
  }

  const idx = distance < allDoodles.length ? distance : allDoodles.length - 1;

  const matchingDoodles = allDoodles.slice(idx, idx + 1);

  console.log(distance, idx);

  return matchingDoodles;
}

export default timeTravelSelector;
