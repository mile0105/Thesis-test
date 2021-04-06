export const readStations = async () => {

  const res = await fetch('http://localhost:8080/stations').then(res => res.json());

  return res;
};


export const readPoints = async () => {
  const res = await fetch('http://localhost:8080').then(res => res.json());

  return res;
};
