/**
 * Compare semantic version numbers to sort them, Eg:
 * ['2.0.0', '1.12.0', '1.1.4', '4.50.0', '0.4.1', '0.4.12'].sort(compareSemVer)
 * => ['0.4.1', '0.4.12', '1.1.4', '1.12.0', '2.0.0', '4.50.0']
 */
const compareSemVer = (a, b) => {
  if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }

  if (a === b) {
    return 0;
  }

  var a_components = a.split('.');
  var b_components = b.split('.');

  if ((a_components.length === b_components.length) === 0) return 0;
  if (a_components.length === 0) return -1;
  if (b_components.length === 0) return 1;

  var len = Math.min(a_components.length, b_components.length);

  // loop while the components are equal
  for (var i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i], 10) > parseInt(b_components[i], 10)) {
      return 1;
    }

    // B bigger than A
    if (parseInt(a_components[i], 10) < parseInt(b_components[i], 10)) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  // Otherwise they are the same.
  return 0;
};

export {compareSemVer};

export const dateSort = (a, b) => new Date(a) - new Date(b);

export const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;

export const booleanSort = (a, b) => (a === b ? 0 : a ? -1 : 1);

export const shallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
};

export const comparerFlatArray = otherArray => {
  return function(current) {
    return (
      otherArray.filter(function(other) {
        return other === current;
      }).length === 0
    );
  };
};
