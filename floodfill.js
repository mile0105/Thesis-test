const traversed = new Set();
const fillStack = [];

//optimize later
export const floodFill = (points, station, i, j) => {

  const decreasingFactor = 0.05;
  const heightAllowanceFactor = 15;

  const stationHeight = points[i][j].z;

  console.log('Flood fill started');

  fillStack.push([i, j, station.pm10Value]);

  let timesToWriteFillStack = 15;

  while (fillStack.length > 0) {

    const [i, j, pm10] = fillStack.pop();

    if (i < 0 || j < 0 || i > points.length - 1 || j > points[0].length - 1) {
      continue; //we reached a wall
    }

    if (traversed.has(`[${i}][${j}]`)) {
      continue;
    }

    const x = points[i][j].x;
    const y = points[i][j].y;
    const z = points[i][j].z;

    const pm10Value =  stationHeight + heightAllowanceFactor >= z && pm10 > 0 ? pm10: 0;

    points[i][j] = {
      x: x,
      y: y,
      z: z,
      pm10: pm10Value,
    };

    traversed.add(`[${i}][${j}]`);

    if (timesToWriteFillStack-- > 0) {

      // console.log(i);
      // console.log(j);
      console.log(`Z: ${z} - Station height: ${stationHeight} \n Pm10: ${pm10} AmortizedPm10: ${pm10Value}`);
      console.log(stationHeight);
      console.log(pm10);
      // console.log(fillStack);
      // console.log(traversed);
    }

    fillStack.push([i+1, j, pm10Value - decreasingFactor]);
    fillStack.push([i-1, j, pm10Value - decreasingFactor]);
    fillStack.push([i, j+1, pm10Value - decreasingFactor]);
    fillStack.push([i, j-1, pm10Value - decreasingFactor]);

  }

  console.log('Floodfill finished');

};


