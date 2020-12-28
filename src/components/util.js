import { useState, useEffect } from 'react';

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

var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

function abbreviateNumber(number) {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(number) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return number;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled + suffix;
}

export function formatNumber(input) {
  if (typeof input == 'undefined' || input == null) {
    return '';
  }

  // type checks
  let inputNum = 0;
  if (typeof input === 'string') {
    inputNum = parseInt(input, 10);
  } else {
    inputNum = input;
  }

  return inputNum.toFixed(2);
}

export function formatCurrency(input, isShorthand) {
  if (typeof input == 'undefined') {
    return '';
  }
  // type checks
  let inputNum = 0;
  if (typeof input === 'string') {
    inputNum = parseInt(input, 10);
  } else {
    inputNum = input;
  }

  // output style
  if (isShorthand) {
    return '💸 ' + abbreviateNumber(inputNum);
  } else {
    return '💸 ' + inputNum.toString();

    // USD ($)
    // return inputNum.toLocaleString('en-US', {
    //   style: 'currency',
    //   currency: 'USD',
    //   minimumFractionDigits: 0,
    // });
  }
}

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value, delay]
  );

  return debouncedValue;
}
