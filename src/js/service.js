/* => API Guide
  [
    [
      1499040000000,      // Open time
      "0.01634790",       // Open
      "0.80000000",       // High
      "0.01575800",       // Low
      "0.01577100",       // Close
      "148976.11427815",  // Volume
      1499644799999,      // Close time
      "2434.19055334",    // Quote asset volume
      308,                // Number of trades
      "1756.87402397",    // Taker buy base asset volume
      "28.46694368",      // Taker buy quote asset volume
      "17928899.62484339" // Ignore.
    ]
  ]
*/

//Constants
const interval = "1d";
const symbol = "BTCUSDT"

const klineApiEndpoint = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`;

export function fetchData() {
  let data;

  $.ajax({
    url: klineApiEndpoint,
    type: "GET",
    async: false,
    success: response => {
      data = response;
    }
  });

  return data;
}


//Sample Data
export const getSampleData = () => {
  return (
    [
      ["day",       "low",    "open",     "close", "high",    "i0",   "i1",   "i2",   "i3",   "i4"  ],
      ["2004/05",   200,      300,        400,      100,      200,    200,    200,    200,    200   ],
      ["2004/05",   200,      300,        400,      100,      200,    200,    200,    200,    200   ],
      ["2004/05",   200,      300,        400,      100,      200,    200,    200,    200,    200   ],
      ["2004/05",   200,      300,        400,      100,      200,    200,    200,    200,    200   ],
      ["2004/05",   200,      300,        400,      100,      200,    200,    200,    200,    200   ],
    ]
  );
}

