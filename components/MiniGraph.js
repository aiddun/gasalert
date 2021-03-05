import React, { useEffect, useRef, useState } from "react";
import sparkline from "./Sparkline";

// Memoize bc we have non-declarative components and we dont want to remount on a key change
const MiniGraph = React.memo(({ setLimitPrice, limitPrice, data }) => {
  const [price, setPrice] = useState(0);
  const formatDate = (date) =>
    date
      .toUTCString()
      .replace(/^.*?, (.*?) \d{2}:\d{2}:\d{2}.*?$/, "$1")
      .replace(/[0-9]{4,5}/, "");

  const mostRecentData = data[data.length - 1];
  let lastSelectedPrice = useRef(mostRecentData.value);
  let lastDate = useRef(formatDate(new Date(mostRecentData.date)));
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
    const options = {
      onmousemove: (event, datapoint) => {
        const tooltip = toolTipRef.current;

        const date = formatDate(new Date(datapoint.date));
        tooltip.textContent = date;
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;

        setPrice(datapoint.value);
        setLimitPrice(datapoint.value);
      },

      onmouseout: (event) => {
        const tooltip = toolTipRef.current;
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;
        
        tooltip.textContent = lastDate.current;
        setPrice(lastSelectedPrice.current);
        setLimitPrice(lastSelectedPrice.current);
      },
      
      onmouseupdown: (event, dp) => {
        const date = formatDate(new Date(dp.date));
        const tooltip = toolTipRef.current;
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
    <div className="mx-auto bg-white w-64  h-24 rounded-2xl flex justify-center items-center shadow-sm">
      <svg
        ref={graphRef}
        className="eth block rounded-xl"
        width="200"
        height="70"
        strokeWidth="2"
        stroke="blue"
        fill="rgba(0, 0, 255, .2)"
      ></svg>
      <p ref={toolTipRef} className="text-xs text-center text-gray-600 w-12">
        {formatDate(new Date(mostRecentData.date))}
      </p>
    </div>
  );
});

export default MiniGraph;
