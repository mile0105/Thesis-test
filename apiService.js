export const readStations = () => {

  fetch('http://localhost:8080/stations').then(res => res.json()).then(data => console.log(data));
};



export const readPoints = () => {
  fetch('http://localhost:8080').then(res => res.json()).then(data => console.log(data));
};
