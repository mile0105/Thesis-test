export const euclidianDistance = (pointA, pointB) => {

  const a = pointA.x - pointB.x;
  const b = pointA.y - pointB.y;

  return Math.sqrt(a*a + b*b);
};

export const matrixDistance = (i1, i2, j1, j2) => {
  return Math.abs(i1 - i2) + Math.abs(j1 - j2);

};
