import Head from "next/head";

import React, { useEffect, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
const speed = ["Slow (Recommended)", "Average", "Fast", "Instant"];

import MiniGraph from "../components/MiniGraph";
import HorizontalTabSelect from "../components/HorizontalTabSelect";
import testPriceData from "../sampledata.json";

const weiToGwei = (n) => n / 10e9;
const roundto2decimalplaces = (n) => Math.round(n * 100) / 100;

const data = testPriceData.body.aggregations.hour_bucket.buckets.map(
  ({ key_as_string, avgGasDay, percentilesDay }) => ({
    date: key_as_string,
    // convert wei to gwi
    value: roundto2decimalplaces(weiToGwei(percentilesDay.values["50.0"])),
  })
);

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

const currencies = {
  Gwei: { sm: "g", placeholder: "0" },
  ETH: { sm: "Ξ", placeholder: "0.0" },
  USD: { sm: "$", placeholder: "0.00" },
};

const TR = ({ name, setLimitPrice, currencySelected, setCurrencySelected }) => {
  // const data = [
  //   { name: "ETH", date: "2017-01-01", value: 8.3 },
  //   { name: "ETH", date: "2017-02-01", value: 10.57 },
  //   { name: "ETH", date: "2017-03-01", value: 15.73 },
  //   { name: "ETH", date: "2017-04-01", value: 49.51 },
  //   { name: "ETH", date: "2017-05-01", value: 85.69 },
  //   { name: "ETH", date: "2017-06-01", value: 226.51 },
  //   { name: "ETH", date: "2017-07-01", value: 246.65 },
  //   { name: "ETH", date: "2017-08-01", value: 213.87 },
  //   { name: "ETH", date: "2017-09-01", value: 386.61 },
  //   { name: "ETH", date: "2017-10-01", value: 303.56 },
  //   { name: "ETH", date: "2017-11-01", value: 298.21 },
  // ];

  const mostRecentPrice = data[data.length - 1].value;
  const [price, setPrice] = useState(mostRecentPrice);
  const [lastPrice, setLastPrice] = useState(0);

  return (
    <>
      <td className="px-3 py-1.5 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
        {name}
      </td>

      <td className="px-3 py-1.5 whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium"></td>
      <td className="px-3 py-1.5 whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium">
        <button className="w-12">{price}</button>
      </td>
    </>
  );
};

const ConversionTable = ({
  currencies,
  // For later side-effect of deselecting price
  setLimitPrice,
  currencySelected,
  setCurrencySelected,
}) => {
  const transactions = [
    { name: "Compound Deposit" },
    { name: "Uniswap Trade" },
    { name: "ERC20 Approval" },
    { name: "ERC20 Transfer" },
    { name: "ETH Transfer" },
  ];

  const [currency, setCurrency] = useState("Gwei");
  const [lastPrice, setLastPrice] = useState(0);

  return (
    <div>
      <div className="flex flex-col">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block min-w-full shadow overflow-hidden rounded-lg border-b border-gray-200">
            <div className="mx-auto bg-gray-50 py-2">
              <MiniGraph
                setLimitPrice={setLimitPrice}
                lastPrice={lastPrice}
                setLastPrice={setLastPrice}
                data={data}
              />
            </div>
            <table className="min-w-full border-t border-gray-200 ">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {transactions.map(({ name }, i) => (
                  <tr className={i % 2 == 1 ? "bg-gray-50" : ""} key={name}>
                    <TR
                      name={name}
                      setLimitPrice={setLimitPrice}
                      currencySelected={currencySelected}
                      setCurrencySelected={setCurrencySelected}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between py-2 px-1">
              <HorizontalTabSelect
                elements={["1M", "1W", "1D"]}
                selectedElement={"1M"}
                setSelectedElement={setCurrency}
              />
              <HorizontalTabSelect
                elements={Object.keys(currencies)}
                selectedElement={currency}
                setSelectedElement={setCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConversionPane = ({
  limitPrice,
  setLimitPrice,
  currencySelected,
  setCurrencySelected,
}) => {
  const [currency, setCurrency] = useState("Gwei");
  const [lastPrice, setLastPrice] = useState(0);

  return (
    <>
      <div className="pt-2">
        <ConversionTable
          currencies={currencies}
          currency={currency}
          setLimitPrice={setLimitPrice}
          currencySelected={currencySelected}
          setCurrencySelected={setCurrencySelected}
        />
      </div>
    </>
  );
};

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

const MoneyInput = ({ limitPrice, setLimitPrice }) => {
  const defaultSymbol = "Gwei";
  const [selected, setSelected] = useState(defaultSymbol);
  return (
    <div>
      <label for="price" className="block text-sm font-medium text-gray-700">
        Price
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            {currencies[selected].sm}
          </span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder={currencies[selected].placeholder}
          value={limitPrice}
          onInput={(e) => setLimitPrice(e.target.value)}
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
            {Object.keys(currencies).map((sym) => (
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
  const [limitPrice, setLimitPrice] = useState("");
  const [currencySelected, setCurrencySelected] = useState("");

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

        <div className="flex flex-wrap  items-center justify-around flex- max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl ">
            <div className="pt-4">
              <ConversionPane
                limitPrice={limitPrice}
                setLimitPrice={setLimitPrice}
                currencySelected={currencySelected}
                setCurrencySelected={setCurrencySelected}
              />
            </div>
          </div>
          <div className="p-6 mt-6 text-left border w-96 rounded-xl md:mx-4">
            <div className="pt-4">
              <BasicInput />
            </div>
            <div className="pt-4">
              <MoneyInput
                limitPrice={limitPrice}
                setLimitPrice={setLimitPrice}
              />
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
