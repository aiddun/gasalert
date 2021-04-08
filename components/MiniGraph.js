import React, { useEffect, useRef, useState } from "react";
import sparkline from "./Sparkline";
import VerticalTabSelect from "./VerticalTabSelect";

const roundto2decimalplaces = (n) => Math.round(n * 100) / 100;
const roundto3decimalplaces = (n) => Math.round(n * 1000) / 1000;

const SpinLoader = ({ className }) => (
  <svg
    className={"animate-spin -ml-1 h-5 w-5 text-blue-400 " + className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Memoize bc we have non-declarative components and we dont want to remount on a key change
const MiniGraph = ({
  setPrice,
  previewPrice,
  limitPrice,
  setLimitGweiPrice,
  data,
  currencySelected,
  display = true,
  limitGweiPrice,
  timeFrameSelected,
}) => {
  const formatDate = (date) =>
    new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
    });

  const mostRecentData = data[data.length - 1];
  const lastSelectedPrice = useRef(mostRecentData.value);
  // So text input doesn't change graph
  const lastSelectedGweiPrice = useRef(mostRecentData.gwei);
  const [displayDate, setDisplayDate] = useState(null);
  const [displayGweiPrice, setDisplayGweiPrice] = useState(
    lastSelectedGweiPrice
  );

  const [loading, setLoading] = useState(false);

  const lastDate = useRef(null);
  const graphRef = useRef(null);
  const toolTipRef = useRef(null);

  const canMutateGlobalPrice = useRef(true);
  const modifiedLocally = useRef(false);
  const loadCount = useRef(0);

  const findClosest = (target, tagName) => {
    if (target.tagName === tagName) {
      return target;
    }

    while ((target = target.parentNode)) {
      if (target.tagName === tagName) {
        break;
      }
    }

    return target;
  };

  useEffect(() => {
    loadCount.current++;

    graphRef.current.textContent = "";
    const mostRecentData = data[data.length - 1];
    // For initial data fetch
    if (!lastDate.current) {
      lastDate.current = mostRecentData.date;
      setDisplayDate(formatDate(mostRecentData.date));
    }
    if (!lastSelectedPrice.current) {
      lastSelectedPrice.current = mostRecentData.value;
    }
    if (!lastSelectedGweiPrice.current) {
      lastSelectedGweiPrice.current = mostRecentData.gwei;
      setDisplayGweiPrice(mostRecentData.gwei);
      modifiedLocally.current = true;
      canMutateGlobalPrice.current && setLimitGweiPrice(mostRecentData.gwei);
    }

    const options = {
      displayDate: lastDate.current,
      onmousemove: (event, datapoint) => {
        const tooltip = toolTipRef.current;

        const date = formatDate(new Date(datapoint.date));
        setDisplayDate(date);
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;

        modifiedLocally.current = true;
        setPrice(datapoint.value);
        canMutateGlobalPrice.current && setLimitGweiPrice(datapoint.gwei);
        setDisplayGweiPrice(datapoint.gwei);
      },

      onmouseout: (event) => {
        const tooltip = toolTipRef.current;
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;

        const date = formatDate(lastDate.current);
        setDisplayDate(date);

        modifiedLocally.current = true;
        setPrice(lastSelectedPrice.current);
        canMutateGlobalPrice.current &&
          setLimitGweiPrice(lastSelectedGweiPrice.current);
        setDisplayGweiPrice(lastSelectedGweiPrice.current);
      },

      onmouseupdown: (event, dp) => {
        const formattedDate = formatDate(dp.date);
        const tooltip = toolTipRef.current;

        setDisplayDate(formattedDate);

        lastSelectedPrice.current = dp.value;
        lastSelectedGweiPrice.current = dp.gwei;
        lastDate.current = dp.date;

        modifiedLocally.current = true;

        setLimitGweiPrice(dp.gwei);
        canMutateGlobalPrice.current = true;

        setPrice(dp.value);
        setDisplayGweiPrice(dp.gwei);
      },
    };

    sparkline(graphRef.current, data, options);
    setLoading(false);
  }, [data]);

  useEffect(() => {
    const mostRecentData = data[data.length - 1];
    // debugger;
    const equivelantPrice = data.find(({ date }) => {
      return date === lastDate.current;
    });

    const newPrice = equivelantPrice
      ? equivelantPrice.value
      : mostRecentData.value;
    lastSelectedPrice.current = newPrice;
    setPrice(newPrice);

    // also refresh on data because of unloaded data
  }, [currencySelected, data]);

  useEffect(() => {
    setLoading(true);
  }, [currencySelected, timeFrameSelected]);

  const conversionRate =
    // Also need to ungwei-ify for USDT because we're using the ETH conversion rate
    currencySelected === "ETH" ? 1e9 : 1;

  let value = previewPrice / conversionRate;
  if (currencySelected === "ETH") {
    value = roundto3decimalplaces(value);
  } else if (currencySelected === "USDT") {
    value = roundto2decimalplaces(value);
  } else {
    // Gwei
    value = Math.round(value);
  }

  useEffect(() => {
    console.log(loadCount.current);
    if (modifiedLocally.current === false && loadCount.current > 1) {
      canMutateGlobalPrice.current = false;
    }
    modifiedLocally.current = false;
  }, [limitGweiPrice]);

  return (
    <div className="">
      <div className="relative">
        <svg
          ref={graphRef}
          className={`eth block rounded-xl ${loading ? "invisible" : ""}`}
          width="200"
          height="70"
          strokeWidth="2"
          stroke="blue"
          fill="rgba(0, 0, 255, .2)"
        ></svg>
        <SpinLoader
          className={`absolute top-1/3 left-1/2 ${loading ? "" : "hidden"}`}
        />
      </div>
      <div className="flex justify-between px-2">
        <p className="text-xs text-left text-gray-600">
          <button
            className="focus:outline-none"
            onClick={() =>
              canMutateGlobalPrice.current &&
              setLimitGweiPrice(displayGweiPrice)
            }
          >
            {loading ? "Loading..." : `${`${displayGweiPrice} gwei`}`}
          </button>
        </p>

        <p ref={toolTipRef} className="text-xs text-gray-600 text-right">
          {displayDate}
        </p>
      </div>
    </div>
  );
};

export default MiniGraph;
