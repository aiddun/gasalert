const getGasHistory = () => {};

const gasPeriods = {
  "1D": "d",
  "1W": "w",
  "6M": "all",
};

// D, W, 6M
export const getGas = async (period) => {
  const params = {
    filter: "a",
    zoom: gasPeriods[period],
  };

  const url = new URL("https://www.gasnow.org/api/v3/block/history");
  url.search = new URLSearchParams(params).toString();

  let data = await fetch(url, {
    method: "GET",
  }).then((res) => res.json());

  // ugh
  data = data.data;

  if (period === "6M") {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const startIndex = data.findIndex(
      ({ time }) => new Date(time) >= sixMonthsAgo
    );

    data = data.slice(startIndex);
  }

  return data;
};

const periods = {
  "1D": 300,
  "1W": 1800,
  "6M": 86400,
};

export const getETH_USDT = async (period) => {
  let d = new Date();

  if (period === "6M") {
    d.setMonth(d.getMonth() - 6);
  } else if (period === "1W") {
    d.setDate(d.getDate() - 7);
  } else {
    // 1D
    d.setDate(d.getDate() - 1);
  }

  let params = {
    command: "returnChartData",
    currencyPair: "USDT_ETH",
    start: d.getTime() / 1000,
    end: (new Date().getTime() + 60) / 1000,
    period: periods[period] || periods["D"],
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
