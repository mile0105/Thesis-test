import 'ol/ol.css';
import {Map, View, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import {fromLonLat} from "ol/proj";
import {Vector} from "ol/source";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import {readPoints, readStations} from "./apiService";
import {floodFill} from "./floodfill";
import {euclidianDistance} from "./helper";

var max = 0;

function init() {
  readPoints().then(points => {

    readStations().then(stations => {

      //todo make a loop on all stations
      const nearestPointPositions = getNearestPointPosition(points, stations[0]);

      const i = nearestPointPositions[0];
      const j = nearestPointPositions[1];

      floodFill(points, stations[0], i, j);
      max = getMaxPollutionFromStations(stations);


      const pm10Values = points.flat().filter(point => point.pm10 > 0).map(point => point.pm10).sort();

      console.log(pm10Values)

    }).then(() => {

      let features = [];
      const N = points.length;
      const M = points[0].length;

      const centerPoint = points[N-1][M-1];

      for(let i = 0; i<N; i++) {
          for(let j = 0; j<M; j++) {
              const point = points[i][j];

              const pm10 = point.pm10;

              const feature = new Feature({
                geometry: new Point(
                  fromLonLat([point.x, point.y])
                ),
                color: pm10,
              });
              features.push(feature);

          }
      }


      const layerStyle = {
        symbol: {
          symbolType: 'square',
          size: [
            'interpolate',
            ['exponential', 4],
            ['zoom'],
            2, 1,
            10, 10
          ],
          color: [ 'interpolate',
            [
              'exponential',
              0.5
            ],
            [
              'get',
              'color'
            ],
            0,
            "#000000",
            max,
            "#cccccc"
          ],
          rotateWithView: false,
          offset: [0, 0],
          opacity: 80
        }
      };

      const vector = new Vector({features: []});

      vector.addFeatures(features);

      const vectorLayer = new WebGLPointsLayer({
        source: vector,
        style: layerStyle,
      });

      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([centerPoint.x, centerPoint.y]),
          zoom: 10,
          maxZoom: 13,
        })
      });
      map.render();

    })
  });
}

init();

const getNearestPointPosition = (points, station) => {
  let nearestI = 0;
  let nearestJ = 0;

  for (let i = 0; i<points.length; i++) {
    for (let j = 0; j<points[i].length; j++) {
      if (euclidianDistance(points[i][j], station) < euclidianDistance(points[nearestI][nearestJ], station)) {
        nearestI = i;
        nearestJ = j;
      }
    }
  }

  return [nearestI, nearestJ];
};


const getMaxPollutionFromStations = (stations) => {
  //todo change to proper
  return stations[0].pm10Value;
};
