import 'ol/ol.css';
import {Map, View, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import {fromLonLat} from "ol/proj";
import {Vector} from "ol/source";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import {readPoints, readStations} from "./readService";
import {floodFill} from "./floodfill";
import {getMaxPollutionFromStations, getNearestPointPosition} from "./helper";


const init = () => {
  const points = readPoints();
  const stations = readStations();
  let interpolatedPoints = [];

  let max = getMaxPollutionFromStations(stations);

  for (let station of stations) {
    const nearestPointPositions = getNearestPointPosition(points, station);

    const i = nearestPointPositions[0];
    const j = nearestPointPositions[1];

    floodFill(points, station, i, j, max);
  }

  for (let point of points.flat()) {
    interpolatedPoints.push({
      x: point.x,
      y: point.y,
      pm10: point.pm10 * 255 / max,
    })
  }

  let features = [];
  const N = interpolatedPoints.length;

  const centerPoint = interpolatedPoints[N - 1];

  for (let point of interpolatedPoints) {
    const pm10 = point.pm10;

    const feature = new Feature({
      geometry: new Point(
        fromLonLat([point.x, point.y])
      ),
      color: pm10,
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
      color: ['interpolate',
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

};

init();

