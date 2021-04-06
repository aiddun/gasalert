import React, { useEffect, useRef, useState } from "react";
import sparkline from "./Sparkline";
import VerticalTabSelect from "./VerticalTabSelect";

// Memoize bc we have non-declarative components and we dont want to remount on a key change
const MiniGraph = ({
  setPrice,
  limitPrice,
  data,
  currencySelected,
  display = true,
}) => {
  const formatDate = (date) =>
    new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
    });

  const mostRecentData = data[data.length - 1];
  const lastSelectedPrice = useRef(mostRecentData.value);
  const lastDate = useRef(null);
  const graphRef = useRef(null);
  const toolTipRef = useRef(null);

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
    console.log("mount");
  }, []);

  useEffect(() => {
    graphRef.current.textContent = "";
    const mostRecentData = data[data.length - 1];
    // For initial data fetch
    if (!lastDate.current) lastDate.current = mostRecentData.date;
    if (!lastSelectedPrice.current)
      lastSelectedPrice.current = mostRecentData.value;
    const options = {
      displayDate: lastDate.current,
      onmousemove: (event, datapoint) => {
        const tooltip = toolTipRef.current;

        const date = formatDate(new Date(datapoint.date));
        tooltip.textContent = date;
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;

        setPrice(datapoint.value);
      },

      onmouseout: (event) => {
        const tooltip = toolTipRef.current;
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;

        tooltip.textContent = formatDate(lastDate.current);
        setPrice(lastSelectedPrice.current);
      },

      onmouseupdown: (event, dp) => {
        const date = dp.date;
        const formattedDate = formatDate(date);
        const tooltip = toolTipRef.current;
        tooltip.textContent = formattedDate;

        lastSelectedPrice.current = dp.value;
        console.log(date);
        lastDate.current = date;

        setPrice(dp.value);
      },
    };

    sparkline(graphRef.current, data, options);
  }, [data]);

  useEffect(() => {
    const mostRecentData = data[data.length - 1];
    // debugger;
    console.log(data);
    console.log(lastDate.current);
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

  return (
    <div className="">
      <svg
        ref={graphRef}
        className="eth block rounded-xl"
        width="200"
        height="70"
        strokeWidth="2"
        stroke="blue"
        fill="rgba(0, 0, 255, .2)"
      ></svg>
      <p ref={toolTipRef} className="text-xs text-left pl-1 text-gray-600">
        {formatDate(new Date(mostRecentData.date))}
      </p>
    </div>
  );
};

export default MiniGraph;
