// Based on https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
module.exports = (format, ...args) => {
  return format.replace(/{(\d+)}/g, (match, index) => { 
    return typeof args[index] !== 'undefined'
      ? args[index] 
      : match
    ;
  });
};
