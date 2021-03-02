import Head from "next/head";

import React, { useEffect, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import sparkline from "@fnando/sparkline";
const speed = ["Slow (Recommended)", "Average", "Fast", "Instant"];

const MiniGraph = () => {
  const d = [
    { name: "Ethereum", date: "2017-01-01", value: 8.3 },
    { name: "Ethereum", date: "2017-02-01", value: 10.57 },
    { name: "Ethereum", date: "2017-03-01", value: 15.73 },
    { name: "Ethereum", date: "2017-04-01", value: 49.51 },
    { name: "Ethereum", date: "2017-05-01", value: 85.69 },
    { name: "Ethereum", date: "2017-06-01", value: 226.51 },
    { name: "Ethereum", date: "2017-07-01", value: 246.65 },
    { name: "Ethereum", date: "2017-08-01", value: 213.87 },
    { name: "Ethereum", date: "2017-09-01", value: 386.61 },
    { name: "Ethereum", date: "2017-10-01", value: 303.56 },
    { name: "Ethereum", date: "2017-11-01", value: 298.21 },
  ];

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

  var options = {
    onmousemove: (event, datapoint) => {
      var svg = findClosest(event.target, "svg");
      var tooltip = svg.nextElementSibling;
      var date = new Date(datapoint.date)
        .toUTCString()
        .replace(/^.*?, (.*?) \d{2}:\d{2}:\d{2}.*?$/, "$1");

      tooltip.textContent = `${date}: $${datapoint.value.toFixed(2)} USD`;
      tooltip.style.top = `${event.offsetY}px`;
      tooltip.style.left = `${event.offsetX + 20}px`;
    },

    onmouseout: (event) => {
      var svg = findClosest(event.target, "svg");
      var tooltip = svg.nextElementSibling;
    },
  };

  const graphRef = useRef(null);
  useEffect(() => {
    sparkline(graphRef.current, d, options);
  }, []);

  return (
    <div>
      <svg
        ref={graphRef}
        className="eth"
        width="100"
        height="20"
        stroke-width="2"
        stroke="blue"
        fill="rgba(0, 0, 255, .2)"
      ></svg>
      <span className="tooltip text-xs">{d[d.length - 1].value}</span>
    </div>
  );
};

const HorizontalCurrencySelect = () => {
  const commonStuff =
    "currencySelect relative inline-flex items-center py-2 text-sm font-medium focus:outline-none border";

  const nonSelected =
    "border-gray-300 bg-white  text-gray-700 hover:bg-gray-50";

  const selected = "border-gray-300 bg-blue-600 text-white";

  const [selectedElement, setSelectedElement] = useState("Gwei");

  return (
    <div
      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px "
      aria-label="Pagination"
    >
      {["Gwei", "USD", "Eth"].map((e, i, arr) => (
        <button
          key={`${e} + ${selectedElement}`}
          className={`${`${commonStuff} ${
            i == 0
              ? " px-2 rounded-l-md "
              : i <= arr.length - 2
              ? " px-2"
              : " px-2 rounded-r-md "
          }`} ${e == selectedElement ? selected : nonSelected}`}
          onClick={(e) => setSelectedElement(e.target.innerText)}
        >
          {e}
        </button>
      ))}
    </div>
  );
};

const ConversionTable = () => (
  <div class="flex flex-col">
    <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden rounded-lg border-b border-gray-200">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                High
              </th>
              <th class="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Low
              </th>
              <th class="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Med
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            {[
              "Compound Deposit",
              "Uniswap Trade",
              "ERC20 Approval",
              "ERC20 Transfer",
              "ETH Transfer",
            ].map((name, index) => (
              <tr className={index % 2 == 1 ? "bg-gray-50" : ""} key={name}>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                  {name}
                </td>

                <td class="px-3 py-2 whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium">
                  <button>0.00</button>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium">
                  <button>0.00</button>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium">
                  <button>0.00</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-700 text-right pt-2">24 hour prices</p>
    </div>
  </div>
);

const ConversionPane = () => (
  <>
    <div className="flex flex-row-reverse">
      <HorizontalCurrencySelect />
    </div>
    <div className="pt-2">
      <ConversionTable />
    </div>
  </>
);

const BasicInput = () => (
  <div>
    <label for="tel" className="block text-sm font-medium text-gray-700">
      Phone #
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="text"
        name="tel"
        id="tel"
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full  sm:text-sm border-gray-300 rounded-md"
        placeholder="000-000-0000"
      />
    </div>
  </div>
);

const MoneyInput = () => {
  const defaultSymbol = "Gwei";
  const symbols = {
    Gwei: { sm: "g", placeholder: "0" },
    ETH: { sm: "Ξ", placeholder: "0.0" },
    USD: { sm: "$", placeholder: "0.00" },
  };
  const [selected, setSelected] = useState(defaultSymbol);
  return (
    <div>
      <label for="price" className="block text-sm font-medium text-gray-700">
        Price
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            {symbols[selected].sm}
          </span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder={symbols[selected].placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label for="currency" className="sr-only">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
            onChange={(e) => setSelected(e.target.value)}
          >
            {Object.keys(symbols).map((sym) => (
              <option key={sym}>{sym}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const CurrencySelect = () => {
  const [selectedPerson, setSelectedPerson] = useState(speed[0]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-72">
        <Listbox
          as="div"
          className="space-y-1"
          value={selectedPerson}
          onChange={setSelectedPerson}
        >
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                Responsiveness level
              </Listbox.Label>
              <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                  <Listbox.Button className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    <span className="block truncate">{selectedPerson}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Listbox.Button>
                </span>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                >
                  <Listbox.Options
                    static
                    className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                  >
                    {speed.map((person) => (
                      <Listbox.Option key={person} value={person}>
                        {({ selected, active }) => (
                          <div
                            className={`${
                              active
                                ? "text-white bg-blue-600"
                                : "text-gray-900"
                            } cursor-default select-none relative py-2 pl-8 pr-4`}
                          >
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {person}
                            </span>
                            {selected && (
                              <span
                                className={`${
                                  active ? "text-white" : "text-blue-600"
                                } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                              >
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};

const SubmitButton = () => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
    >
      Submit
    </button>
  </span>
);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 overflow-x-hidden	">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Gas Time</h1>

        <p className="mt-3 text-2xl">
          Get text alerts when gas falls below a limit
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl ">
            <div className="pt-4">
              <ConversionPane />
              <MiniGraph />
            </div>
          </div>
          <div className="p-6 mt-6 text-left border w-96 rounded-xl ">
            <div className="pt-4">
              <BasicInput />
            </div>
            <div className="pt-4">
              <MoneyInput />
            </div>
            <div className="pt-4">
              <CurrencySelect />
            </div>
            <div className="pt-8 mx-auto w-20">
              <SubmitButton />
            </div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t text-xs text-gray-600">
        Tips: 0x288fccf4af11928e62eab282152f2987756188c0
      </footer>
    </div>
  );
}
