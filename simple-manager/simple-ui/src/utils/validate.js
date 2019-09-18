function validateIpAndPort(input) {
  const parts = input.split(":");
  if (parts.length !== 2) {
    return false;
  }
  const ip = parts[0].split(".");
  const port = parts[1];
  return validateNum(port, 1, 65535) &&
    ip.length === 4 &&
    ip.every(function (segment) {
      return validateNum(segment, 0, 255);
    });
}

function validateNum(input, min, max) {
  var num = +input;
  return num >= min && num <= max && input === num.toString();
}

export default {
  validateIpAndPort,
};