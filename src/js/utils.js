const fillMissingRows = (array, size) => Array.from({length: size}, () => array.unshift(0));

const average = (array) => array.reduce((a, b) => a + b) / array.length;
const getEmaConstant = (day) => 2/(day + 1);

function getSMA(data, avgOffset) {
  let SMA = Array();

  for (let i = avgOffset; i < data.length; i++)
    SMA.push(average(data.slice(i - avgOffset, i)));

  return SMA;
}

function getStandardDeviation(array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function getStandardDeviationArray(data, avgOffset) {
  let STDEV = Array();

  for (let i = avgOffset; i < data.length; i++)
    STDEV.push(getStandardDeviation(data.slice(i - avgOffset, i)));

  return STDEV;
}


export function getRSIDataArray(closeData, avgOffset = 14) {

  let priceChangeArray = [];

  //Generate price change for close data
  for (let i = 1; i < closeData.length; i++) {
    priceChangeArray.push(closeData[i] - closeData[i - 1]);
  }

  //Generate gain and loss data
  const gainArray = priceChangeArray.map(price => price > 0 ? price : 0);
  const lossArray = priceChangeArray.map(price => price < 0 ? -1 * price : 0);

  //Generate average gain and loss
  const avgGain = getSMA(gainArray, avgOffset);
  const avgLoss = getSMA(lossArray, avgOffset);

  //Generate RS and RSI
  let RS = avgGain.map((val, idx) => val / avgLoss[idx]);
  let RSI = RS.map(val => 100 - (100 / (val + 1)));

  //Fill missing indexes as 0
  fillMissingRows(RSI, avgOffset + 1);

  return RSI;
}

export function getEMADataArray(closeData, avgOffset = 12) {
  const smoothingConstant = getEmaConstant(avgOffset)

  let SMA = Array();
  let EMA = Array();

  //Generate 12 day close average
  SMA = getSMA(closeData, avgOffset)

  //Put first ema value
  EMA.push(SMA[0]);

  //Calculate EMA
  for (let i = 1; i < SMA.length; i++)
    EMA.push(SMA[i] * smoothingConstant + EMA[i - 1] * (1 - smoothingConstant));

  //Fill missing indexes as 0
  fillMissingRows(EMA, avgOffset + 1);

  return EMA;
}

export function getBoolingerBandDataArray(closeData, avgOffset = 12, bandMultiplier = 2) {
  const SMA = getSMA(closeData, avgOffset);
  const STDEV = getStandardDeviationArray(closeData, avgOffset);

  let upperBand = SMA.map((smaVal, idx) => smaVal + STDEV[idx] * bandMultiplier);
  let lowerBand = SMA.map((smaVal, idx) => smaVal - STDEV[idx] * bandMultiplier);

  fillMissingRows(upperBand, avgOffset + 1);
  fillMissingRows(lowerBand, avgOffset + 1);

  return [upperBand, lowerBand];
}

export function getMacdDataArray(closeData, avgOffset1 = 12, avgOffset2 = 26, smoothingConstant = 9) {
  const EMA1 = getEMADataArray(closeData, avgOffset1);
  const EMA2 = getEMADataArray(closeData, avgOffset2);

  const MACD = EMA1.map((val, idx) => val - EMA2[idx]);
  const EMA_MACD = getEMADataArray(MACD, smoothingConstant);

  const diffHistogram = MACD.map((val, idx) => val - EMA_MACD[idx]);

  return [MACD, EMA_MACD, diffHistogram];
}
