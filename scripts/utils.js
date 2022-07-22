const fc = {
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

module.exports.style = {
  bold: (text) => `${fc.bold}${text}${fc.reset}`,
};
