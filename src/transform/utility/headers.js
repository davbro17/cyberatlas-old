export default function(n) {
  let result = [];
  // Get index of first and last letters
  const indexA = "A".charCodeAt(0);
  const indexZ = "Z".charCodeAt(0);

  let alphabetLength = indexZ - indexA + 1;
  const repeatNum = Math.floor(n / alphabetLength);

  let startIndex = 0;
  let startString = "";
  let string = "";

  while (startIndex <= repeatNum) {
    if (startIndex > 0) {
      startString = String.fromCharCode(indexA + startIndex - 1);
    }

    if (startIndex === repeatNum) {
      alphabetLength = n % alphabetLength;
    }

    for (var i = 0; i < alphabetLength; i++) {
      string = String.fromCharCode(indexA + i);

      result.push(startString + string);
    }
    startIndex++;
  }
  return result;
}
