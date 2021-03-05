import React, { useEffect, useRef, useState } from "react";
import sparkline from "./Sparkline";

// Memoize bc we have non-declarative components and we dont want to remount on a key change
const MiniGraph = React.memo(
  ({ setLimitPrice, limitPrice, setPrice, data }) => {
    const formatDate = (date) =>
      date.toUTCString().replace(/^.*?, (.*?) \d{2}:\d{2}:\d{2}.*?$/, "$1");

    const mostRecentData = data[data.length - 1];
    let lastSelectedPrice = useRef(mostRecentData.value);
    let lastDate = useRef(formatDate(new Date(mostRecentData.date)));
    const graphRef = useRef(null);

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
      const options = {
        onmousemove: (event, datapoint) => {
          const svg = findClosest(event.target, "svg");
          const tooltip = svg.nextElementSibling;

          const date = formatDate(new Date(datapoint.date));
          tooltip.textContent = date;
          tooltip.style.top = `${event.offsetY}px`;
          tooltip.style.left = `${event.offsetX + 20}px`;

          setPrice(datapoint.value);
          setLimitPrice(datapoint.value);
        },

        onmouseout: (event) => {
          const svg = findClosest(event.target, "svg");
          const tooltip = svg.nextElementSibling;
          tooltip.style.top = `${event.offsetY}px`;
          tooltip.style.left = `${event.offsetX + 20}px`;

          tooltip.textContent = lastDate.current;
          setPrice(lastSelectedPrice.current);
          setLimitPrice(lastSelectedPrice.current);
        },

        onmouseupdown: (event, dp) => {
          const svg = findClosest(event.target, "svg");
          const tooltip = svg.nextElementSibling;
          const date = formatDate(new Date(dp.date));
          tooltip.textContent = date;

          lastSelectedPrice.current = dp.value;
          lastDate.current = date;

          setPrice(dp.value);
          setLimitPrice(dp.value);
        },
      };

      sparkline(graphRef.current, data, options);

      return () => {
        console.log("should never be here");
      };
    }, []);

    return (
      <div>
        <svg
          ref={graphRef}
          className="eth"
          width="100"
          height="20"
          strokeWidth="2"
          stroke="blue"
          fill="rgba(0, 0, 255, .2)"
        ></svg>
        <span className={"tooltip text-xs"}>
          {formatDate(new Date(mostRecentData.date))}
        </span>
      </div>
    );
  }
);

export default MiniGraph;
