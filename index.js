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

function init() {
  readPoints().then(points => {

    readStations().then(stations => {

      //todo make a loop on all stations
      const nearestPointPositions = getNearestPointPosition(points, stations[0]);

      const i = nearestPointPositions[0];
      const j = nearestPointPositions[1];

      floodFill(points, stations[0], i, j);
      //floodfill...

    }).then(() => {
      //todo interpolate similar to down
    })
  });
  fetch('http://localhost:8080')
    .then(response => response.json())
    .then(data => {

      const centerPoint = data.length-1;

      let features = [];
      for(let point of data) {

        const color = point.color;

        const feature = new Feature({
          geometry: new Point(
            fromLonLat([point.x, point.y])
          ),
          color: color,
        });

        features.push(feature);
      }

      const layerStyle = {
        symbol: {
          symbolType: 'square',
          size: [
            'interpolate',
            ['exponential', 4],
            ['zoom'],
            2, 1,
            15, 60
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
            255,
            "#ffffff"
          ],
          rotateWithView: false,
          offset: [0, 0],
          opacity: 1
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
          center: fromLonLat([data[centerPoint].x, data[centerPoint].y]),
          zoom: 10,
          maxZoom: 13,
        })
      });
      map.render();

    });
}

init();

const getNearestPointPosition = (points, station) => {
  let nearestI = 0;
  let nearestJ = 0;

  for (let i = 0; i<points.length; i++) {
    for (let j = 0; j<points[i].length; j++) {
      if(euclidianDistance(points[i][j], station) < euclidianDistance(points[nearestI][nearestJ], station)) {
        nearestI = i;
        nearestJ = j;
      }
    }
  }

  return [nearestI, nearestJ];
};

const euclidianDistance = (pointA, pointB) => {
  const a = pointA.x - pointB.x;
  const b = pointA.y - pointB.y;

  return Math.sqrt(a*a + b*b);
};
