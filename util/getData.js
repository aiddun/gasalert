const getDate = (periodString) => {
  const d = new Date();
  if (periodString === "90D") {
    d.setDate(d.getDate() - 90);
  } else if (periodString === "1W") {
    d.setDate(d.getDate() - 7);
  } else {
    d.setDate(d.getDate() - 1);
  }

  return d;
}

const periodCandleLengthsMins = {
  "1D": 10,
  "1W": 60,
  "90D": 24 * 60,
};

// D, W, 6M
export const getGas = async (period) => {
  const d = getDate(period);
  const deltaD = (new Date() - d) / 1000 / 60;
  const params = {
    from: d.getTime() / 1000,
    // Maximum, can ignore
    candles: Math.floor(deltaD / periodCandleLengthsMins[period]),
    timeframe: periodCandleLengthsMins[period],
    tokenprice: true,
  };

  const url = new URL("https://owlracle.info/eth/history");
  url.search = new URLSearchParams(params).toString();

  let data = await fetch(url, {
    method: "GET",
  }).then((res) => res.json());

  console.log(data)

  return data;
};


export const getETH_USDT = async (period) => {
  let d = getDate(period);

  let params = {
    command: "returnChartData",
    currencyPair: "USDT_ETH",
    start: d.getTime() / 1000,
    end: (new Date().getTime() + 60) / 1000,
    period: periodCandleLengthsMins[period],
  };

  const url = new URL("https://poloniex.com/public");
  url.search = new URLSearchParams(params).toString();

  let res = await fetch(url, {
    method: "GET",
  }).then((res) => res.json());

  if (period === "1D" || period === "1W") {
    // Transform from 5min api period to 10 minute period
    // Or 30 min to 60 min
    res = res.filter((_, i) => i % 2 === 0);
  }

  return res;
};
