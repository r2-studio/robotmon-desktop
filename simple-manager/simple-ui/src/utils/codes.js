const defaultCodes = [
  `console.log('Hello World!!!');\n`, // 0
  `var img = getScreenshot();
var color = getImageColor(img, 100, 100);
console.log(JSON.stringify(color));
releaseImage(img);`, // 1
  "", // 2
  "", // 3
  "", // 4
  "", // 5
  "", // 6
  "", // 7
  "", // 8
  "", // 9
];

export default {
  defaultCodes: defaultCodes,
};