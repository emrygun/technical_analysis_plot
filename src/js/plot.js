import { GoogleCharts } from "google-charts";
import { fetchData, getSampleData, getRequestParams } from "./service.js";
import { getRSIDataArray, getEMADataArray, getBoolingerBandDataArray, getMacdDataArray } from "./utils.js";

const arrayColumn = (arr, idx) => arr.map(x => x[idx]);
const addColumn = (arr, column, colIdx) => arr.map((x, idx) => x[colIdx] = column[idx]);

const plotColumnHeaders = ["day", "Price", "max", "open", "close",
                            "Volume", "EMA", "Upper Bollinger Band", "Lower Bollinger Band"];
const rsiPlotColumnHeaders = ["day", "RSI"];
const macdPlotColumnHeaders = ["day", "MACD", "Smoothed MACD", "Difference"];

const apiData = fetchData();

const dataCountRequestParam = parseInt(getRequestParams()["dataCount"]);
console.log(dataCountRequestParam);
const PLOT_DATA_COUNT = (Number.isInteger(dataCountRequestParam) && dataCountRequestParam < 500) ? dataCountRequestParam : 90;

const KLINES_OPEN_TIME_IDX  = 0;
const KLINES_OPEN_VAL_IDX   = 1;
const KLINES_HIGH_VAL_IDX   = 2;
const KLINES_LOW_VAL_IDX    = 3;
const KLINES_CLOSE_VAL_IDX  = 4;
const KLINES_VOLUME_IDX     = 5;

const PLOT_TIME_IDX                 = 0;
const PLOT_LOW_IDX                  = 1;
const PLOT_OPEN_IDX                 = 2;
const PLOT_CLOSE_IDX                = 3;
const PLOT_HIGH_IDX                 = 4;
const PLOT_VOLUME_IDX               = 5;
const PLOT_EMA_IDX                  = 6;
const PLOT_BOOLINGER_UPPER_BAND_IDX = 7;
const PLOT_BOOLINGER_LOWER_BAND_IDX = 8;

const PLOT_RSI_TIME_IDX             = 0;
const PLOT_RSI_RSI_IDX              = 1;

const PLOT_MACD_TIME_IDX            = 0;
const PLOT_MACD_MACD_IDX            = 1;
const PLOT_MACD_SMOOTHED_MACD_IDX   = 2;
const PLOT_MACD_DIFF_IDX            = 3;

const DATA_MACD_MACD_IDX          = 0;
const DATA_MACD_SMOOTHED_MACD_IDX = 1;
const DATA_MACD_DIFF_IDX          = 2;

const DATA_BOOLINGER_UPPER_BAND_IDX = 0;
const DATA_BOOLINGER_LOWER_BAND_IDX = 1;

const RSI_AVG_DAY             = 14;
const EMA_AVG_DAY             = 12;
const BOOLINGER_BANDS_AVG_DAY = 12;
const MACD_EMA1_AVG_DAY       = 12;
const MACD_EMA2_AVG_DAY       = 26;
const MACD_SMOOTHING_AVG_DAY  = 9;

const open_time_array   = arrayColumn(apiData, KLINES_OPEN_TIME_IDX)
                          .map(timestamp => getMonthAndDateByTimestamp(timestamp));
const open_val_array    = arrayColumn(apiData, KLINES_OPEN_VAL_IDX).map(Number);
const high_val_array    = arrayColumn(apiData, KLINES_HIGH_VAL_IDX).map(Number);
const low_val_array     = arrayColumn(apiData, KLINES_LOW_VAL_IDX).map(Number);
const close_val_array   = arrayColumn(apiData, KLINES_CLOSE_VAL_IDX).map(Number);

const volume_val_array  = arrayColumn(apiData, KLINES_VOLUME_IDX).map(Number);
const ema_val_array     = getEMADataArray(close_val_array, EMA_AVG_DAY);
const rsi_val_array     = getRSIDataArray(close_val_array, RSI_AVG_DAY);

const boolinger_bands_arrays = getBoolingerBandDataArray(close_val_array, BOOLINGER_BANDS_AVG_DAY, 2);

const macd_val_arrays = getMacdDataArray(close_val_array, MACD_EMA1_AVG_DAY, MACD_EMA2_AVG_DAY, MACD_SMOOTHING_AVG_DAY);

const plotEl = document.getElementById('plot');
const plotRSIEl = document.getElementById('plotRSI');
const plotMACDEl = document.getElementById('plotMACD');

//const apiData = generatePlotData(getSampleData().slice(0, 90));

//Turns api data into chart data table
function generatePlotData() {
  let plotData = Array(500).fill(0).map(() => new Array(5));

  addColumn(plotData, open_time_array, PLOT_TIME_IDX);
  addColumn(plotData, low_val_array, PLOT_LOW_IDX);
  addColumn(plotData, open_val_array, PLOT_OPEN_IDX);
  addColumn(plotData, close_val_array, PLOT_CLOSE_IDX);
  addColumn(plotData, high_val_array, PLOT_HIGH_IDX);

  addColumn(plotData, volume_val_array, PLOT_VOLUME_IDX);
  addColumn(plotData, ema_val_array, PLOT_EMA_IDX);
  addColumn(plotData, boolinger_bands_arrays[DATA_BOOLINGER_UPPER_BAND_IDX], PLOT_BOOLINGER_UPPER_BAND_IDX)
  addColumn(plotData, boolinger_bands_arrays[DATA_BOOLINGER_LOWER_BAND_IDX], PLOT_BOOLINGER_LOWER_BAND_IDX)

  return plotData;
}

function generateRSIPlotData() {
  let plotData = Array(500).fill(0).map(() => new Array(2));
  addColumn(plotData, open_time_array, PLOT_RSI_TIME_IDX);
  addColumn(plotData, rsi_val_array, PLOT_RSI_RSI_IDX);

  return plotData;
}

function generateMACDPlotData() {
  let plotData = Array(500).fill(0).map(() => new Array(4));
  addColumn(plotData, open_time_array, PLOT_MACD_TIME_IDX);
  addColumn(plotData, macd_val_arrays[DATA_MACD_MACD_IDX], PLOT_MACD_MACD_IDX);
  addColumn(plotData, macd_val_arrays[DATA_MACD_SMOOTHED_MACD_IDX], PLOT_MACD_SMOOTHED_MACD_IDX);
  addColumn(plotData, macd_val_arrays[DATA_MACD_DIFF_IDX], PLOT_MACD_DIFF_IDX);

  return plotData;
}

function getMonthAndDateByTimestamp(UNIX_timestamp) {
  const timestampDate = new Date(UNIX_timestamp);

  let month = timestampDate.getMonth();
  let date = timestampDate.getDate();

  return `${month}/${date}`;
}

//Chart initializer callback function
export function initChart() {
  let plotData = generatePlotData().splice(-1 * PLOT_DATA_COUNT);
  plotData.unshift(plotColumnHeaders);
  const chartData = google.visualization.arrayToDataTable(plotData);
  const lineChartObj = new GoogleCharts.api.visualization.LineChart(plotEl);
  lineChartObj.draw(chartData, {
    series: {
      0: { 
        type: "candlesticks",
        targetAxisIndex: 0
      },
      1: { 
        type: "bars",
        targetAxisIndex: 1,
        dataOpacity: 0.1,
      },
      2: {
        type: "line",
        targetAxisIndex: 0,
      },
      3: {
        type: "line",
        targetAxisIndex: 0,
        color: "bdbdbd",
      },
      4: {
        type: "line",
        targetAxisIndex: 0,
        color: "bdbdbd",
      }
    },
  });
}

export function initRSIPlot() {
  let plotData = generateRSIPlotData().splice(-1 * PLOT_DATA_COUNT);

  plotData.unshift(rsiPlotColumnHeaders);

  const chartData = google.visualization.arrayToDataTable(plotData);
  const lineChartObj = new GoogleCharts.api.visualization.LineChart(plotRSIEl);

  lineChartObj.draw(chartData);
}

export function initMACDPlot() {
  let plotData = generateMACDPlotData().splice(-1 * PLOT_DATA_COUNT);

  plotData.unshift(macdPlotColumnHeaders);

  const chartData = google.visualization.arrayToDataTable(plotData);
  const lineChartObj = new GoogleCharts.api.visualization.LineChart(plotMACDEl);

  lineChartObj.draw(chartData, {
    series: {
      0: { 
        type: "line",
        targetAxisIndex: 0
      },
      1: { 
        type: "line",
        targetAxisIndex: 0,
      },
      2: {
        type: "bars",
        targetAxisIndex: 1,
        dataOpacity: "0.3"
      },
    },
  });
}

