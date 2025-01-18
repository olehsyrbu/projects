export function getMultiProgramTotalTypes(locations, remoteTypes) {
  const totalLocations = locations?.reduce((sum, item) => {
    return (
      sum +
      Object.values(item.types).reduce((innerSum, current) => {
        return innerSum + current;
      }, 0)
    );
  }, 0);
  let totalRemote = Object.values(remoteTypes).reduce((sum, current) => {
    return sum + current;
  }, 0);
  return totalLocations + totalRemote;
}
