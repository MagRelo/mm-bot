export function getParams(location) {
  if (!location.search) {
    return '';
  }

  return getJsonFromUrl(location.search);
}

function getJsonFromUrl(search) {
  var query = search.substr(1);
  var result = {};
  query.split('&').forEach(function (part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
