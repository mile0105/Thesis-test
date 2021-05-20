export const readStations = () => {
  const data = readFile('http://127.0.0.1:8887/files/Stacje.geojson');
  return parseStations(data);
};

export const readPoints = () => {
  const data = readFile('http://127.0.0.1:8887/files/Tricity_eudem_xyz.bin');
  const points = parsePoints(data);
  return mapToPointsArray(points);
};

const parsePoints = (fileData) => {
  const pointsArray = fileData.split('\n');
  pointsArray.pop(); //last element is an empty string
  const points = [];

  for(let point of pointsArray) {
    let coordinates = point.split(' ');
    points.push({
      x: parseFloat(coordinates[0]),
      y: parseFloat(coordinates[1]),
      z: parseFloat(coordinates[2])
    })
  }

  return points;
};

const mapToPointsArray = (points) => {
  const pointsArray = [];

  let currentList = [];

  let prevX = Number.MAX_SAFE_INTEGER;
  for(let i = 0; i<points.length; i++) {
    let x = points[i].x;
    if(x < prevX) {
      pointsArray.push(currentList);
      currentList = [];
    }
    prevX = x;
    currentList.push(points[i]);
    if (i === points.length - 1) {
      pointsArray.push(currentList);
    }
  }

  pointsArray.shift();
  return pointsArray;
};

const parseStations = (fileData) => {
  const features = JSON.parse(fileData).features;
  const stations = [];

  for(let feature of features) {

    let properties = feature.properties;
    stations.push({
      x: properties.X,
      y: properties.Y,
      pm10Value: properties.PM10_avg,
    });
  }
  return stations;
};


const readFile = (fileUrl) => {
  let fileData;

  const xhrDoc = new XMLHttpRequest();
  xhrDoc.open('GET', fileUrl, false);

  xhrDoc.onreadystatechange = function() {
    if(this.readyState == 4) {

      if(this.status == 200) {
        fileData = this.response;
      }
    }
  };

  xhrDoc.send();

  return fileData;
};

