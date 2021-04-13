import {matrixDistance} from "./helper";

const traversed = new Set();
const fillStack = [];
const decreasingFactor = 0.1;
const heightAllowanceFactor = 5;

//optimize later
export const floodFill = (points, station, stationI, stationJ) => {

  const stationHeight = points[stationI][stationJ].z;

  const stationPm10Value = station.pm10Value;

  fillStack.push([stationI, stationJ]);

  while (fillStack.length > 0) {

    const [i, j] = fillStack.pop();

    if (i < 0 || j < 0 || i > points.length - 1 || j > points[0].length - 1) {
      continue; //we reached a wall
    }

    if (traversed.has(`[${i}][${j}]`)) {
      continue;
    }

    const x = points[i][j].x;
    const y = points[i][j].y;
    const z = points[i][j].z;

    const pm10Value = getPm10Value(i, j, z, stationI, stationJ, stationHeight, stationPm10Value);

    points[i][j] = {
      x: x,
      y: y,
      z: z,
      pm10: pm10Value,
    };

    traversed.add(`[${i}][${j}]`);

    fillStack.push([i+1, j]);
    fillStack.push([i-1, j]);
    fillStack.push([i, j+1]);
    fillStack.push([i, j-1]);

  }

};

const getPm10Value = (pointI, pointJ, pointHeight, stationI, stationJ, stationHeight, stationPm10) => {
  if (stationHeight + heightAllowanceFactor < pointHeight) {
    return 0;
  }

  const distance = matrixDistance(pointI, stationI, pointJ, stationJ);

  const value = stationPm10 - (distance * decreasingFactor);
  return value > 0? value : 0;
};


