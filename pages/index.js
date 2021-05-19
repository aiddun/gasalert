import Head from "next/head";

import React, { useEffect, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import MiniGraph from "../components/MiniGraph";
import HorizontalTabSelect from "../components/HorizontalTabSelect";
import VerticalTabSelect from "../components/VerticalTabSelect";
import PhoneInput from "../components/PhoneInput";
import { getETH_USDT, getGas } from "../util/getData";

import ReCAPTCHA from "react-google-recaptcha";

const weiToGwei = (n) => n / 1e9;
const roundto2decimalplaces = (n) => Math.round(n * 100) / 100;
const roundto3decimalplaces = (n) => Math.round(n * 1000) / 1000;

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

const transactions = [
  { name: "ETH Transfer", gasCost: 21000 },
  { name: "ERC20 Transfer", gasCost: 46000 },
  { name: "Uniswap v3 Trade", gasCost: 129830 },
  { name: "Opensea Registry", gasCost: 391402 },
  { name: "Zora Mint", gasCost: 554136 },
];

// var samplePriceData = samplePriceData.map

// Index to array based on common 1 year ago start date

const gweiToUSDT = (g, date) => {};

const currencies = {
  USDT: { sm: "$", placeholder: "0.00" },
  ETH: {
    // sm: "Ξ",
    sm: "",
    placeholder: "0.0",
  },
  Gwei: { sm: "", placeholder: "0" },
};

const TR = ({
  transaction,
  price,
  setLimitPrice,
  currencySelected,
  limitPrice,
}) => {
  const { name, gasCost } = transaction;

  const conversionRate =
    // Also need to ungwei-ify for USDT because we're using the ETH conversion rate
    currencySelected === "ETH" ? 1e9 : 1;

  let value = price == null ? "-" : (price * gasCost) / conversionRate;
  if (currencySelected === "ETH") {
    value = roundto3decimalplaces(value);
  } else if (currencySelected === "USDT") {
    value = roundto2decimalplaces(value);
  } else {
    // Gwei
    value = Math.round(value);
  }

  const { sm } = currencies[currencySelected];

  return (
    <>
      <td className="px-3 py-1.5 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
        {name}
      </td>

      {/* <td className="px-3 py-1.5 whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium"></td> */}
      <td className="whitespace-no-wrap border-l text-center border-b border-gray-200 text-sm leading-3 font-medium">
        {/* <button
          className="focus:outline-none"
          // onClick={() => setLimitPrice(limitPrice)}
        > */}
        {`${sm}${value}`}
        {/* </button> */}
      </td>
    </>
  );
};

var priceDataCache = {};

const ConversionPane = ({
  limitPrice,
  setLimitPrice,
  currencySelected,
  setCurrencySelected,
  speed,
}) => {
  const [lastPrice, setLastPrice] = useState(null);
  const [timeFrameSelected, setTimeFrameSelected] = useState("1W");
  const [data, setData] = useState([{ date: 0, gwei: 0, value: 0 }]);
  const [previewPrice, setPreviewPrice] = useState(data[0]);
  // const [dateSelected, setDateSelected] = useState(null);

  useEffect(async () => {
    let pricePoints;
    if (priceDataCache[timeFrameSelected]) {
      pricePoints = priceDataCache[timeFrameSelected];
    } else {
      pricePoints = await getGas(timeFrameSelected);
      // if (timeFrameSelected !== "1D")
      priceDataCache[timeFrameSelected] = pricePoints;
    }

    pricePoints = pricePoints.map(({ time, med, min }) => {
      const val = roundto3decimalplaces(weiToGwei(med));
      return {
        date: time,
        // convert wei to gwi
        gwei: Math.round(val),
        value: val,
      };
    });

    if (currencySelected === "USDT") {
      let conversions;
      const queryString = `ETH_USDT-${timeFrameSelected}`;
      if (priceDataCache[queryString]) {
        conversions = priceDataCache[queryString];
      } else {
        conversions = await getETH_USDT(timeFrameSelected);
        priceDataCache[queryString] = conversions;
      }

      pricePoints.forEach(
        (e, i) => (e.value *= conversions[i].weightedAverage / 1e9)
      );
    }

    // if first fetch
    if (data.length === 1) {
      setPreviewPrice(pricePoints[pricePoints.length - 1].value);
    }
    setData(pricePoints);
  }, [currencySelected, timeFrameSelected, speed]);

  // const data2 = data.map(({ date, value }) => ({ date, value: value ** 2 }));

  return (
    <div>
      <div className="flex flex-col">
        <div className="-my-2 py-2 overflow-x-auto sm:px-6 lg:-mx-8 lg:px-8">
          <div
            className="align-middle inline-block min-w-full md:shadow overflow-hidden rounded-lg 
          border md:border-b md:border-l-0 md:border-r-0 md:border-t-0
          border-gray-200"
          >
            <div className="mx-auto bg-gray-50 py-2 px-5">
              <div className="mx-auto bg-white w-64 rounded-2xl shadow-sm">
                <div className="flex justify-between py-3 px-2.5">
                  <MiniGraph
                    setPrice={setPreviewPrice}
                    limitGweiPrice={limitPrice}
                    setLimitGweiPrice={setLimitPrice}
                    previewPrice={previewPrice}
                    data={data}
                    currencySelected={currencySelected}
                    timeFrameSelected={timeFrameSelected}
                  />
                  <div className="flex items-center">
                    <VerticalTabSelect
                      elements={["1D", "1W", "6M"]}
                      selectedElement={timeFrameSelected}
                      setSelectedElement={setTimeFrameSelected}
                    />
                  </div>
                </div>
              </div>
            </div>
            <table className="min-w-full border-t border-gray-200 ">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  {/* <th className="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th> */}
                  <th className="px-1 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {transactions.map((transaction, i) => (
                  <tr
                    className={i % 2 == 1 ? "bg-gray-50" : ""}
                    key={transaction.name}
                  >
                    <TR
                      transaction={transaction}
                      price={previewPrice}
                      limitPrice={limitPrice}
                      setLimitPrice={setLimitPrice}
                      currencySelected={currencySelected}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between flex-row-reverse  py-2 px-1">
              <HorizontalTabSelect
                elements={Object.keys(currencies)}
                selectedElement={currencySelected}
                setSelectedElement={setCurrencySelected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BasicInput = ({ label, placeholder = "", autocomplete = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="text"
        name={autocomplete}
        autocomplete={autocomplete}
        className="transition duration-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full  sm:text-sm border-gray-300 rounded-md"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const GweiInput = ({ limitPrice, setLimitPrice }) => {
  const [animated, setAnimated] = useState(false);
  const timeout = useRef(null);
  useEffect(() => {
    if (timeout) clearTimeout(timeout);
    setAnimated(true);
    setTimeout(() => setAnimated(false), 250);
  }, [limitPrice]);

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700"
      >
        Price per gas unit
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">g</span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className={`${animated ? "ring-1 ring-blue-300" : ""}
          transition duration-300 focus:ring-indigo-500 focus:border-indigo-500 
                      block w-full pl-7 pr-12 
                      sm:text-sm border-gray-300 rounded-md`}
          placeholder={"0"}
          value={limitPrice}
          onInput={(e) => setLimitPrice(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <p className=" pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
            gwei
          </p>
        </div>
      </div>
    </div>
  );
};

const MoneyInput = ({
  limitPrice,
  setLimitPrice,
  currencySelected,
  setCurrencySelected,
}) => {
  const defaultSymbol = "Gwei";

  const [animated, setAnimated] = useState(false);
  const timeout = useRef(null);
  useEffect(() => {
    if (timeout) clearTimeout(timeout);
    setAnimated(true);
    setTimeout(() => setAnimated(false), 250);
  }, [limitPrice]);

  return (
    <div>
      <label for="price" className="block text-sm font-medium text-gray-700">
        Price
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            {currencies[currencySelected].sm}
          </span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className={`${animated ? "ring-1 ring-blue-300" : ""}
          transition duration-300 focus:ring-indigo-500 focus:border-indigo-500 
                      block w-full pl-7 pr-12 
                      sm:text-sm border-gray-300 rounded-md`}
          placeholder={currencies[currencySelected].placeholder}
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
            onChange={(e) => setCurrencySelected(e.target.value)}
            value={currencySelected}
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

const DropdownSelect = ({ options, selected, setSelected, name = "" }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-72">
        <Listbox
          as="div"
          className="space-y-1"
          value={selected}
          onChange={setSelected}
        >
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                {name}
              </Listbox.Label>
              <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                  <Listbox.Button className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    <span className="block truncate">{selected}</span>
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
                    {options.map((o) => (
                      <Listbox.Option key={o} value={o}>
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
                              {o}
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

const SubmitButton = ({ onClick, disabled, title = "Submit", loading }) => (
  // <span className="inline-flex rounded-md shadow-sm">
  //   <button
  //     type="button"
  //     className="inline-flex items-center px-4 py-2
  //     border border-transparent text-sm leading-5 font-medium r
  //     ounded-md text-white bg-blue-500 hover:bg-blue-900 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
  //   >
  //     Submit
  //   </button>
  // </span>

  <span className="inline-flex rounded-md shadow-sm">
    <button
      disabled={disabled}
      type="button"
      className={`inline-flex items-center px-4 py-2 border border-transparent 
      text-sm leading-5 font-medium rounded-md text-white
       ${
         disabled
           ? "bg-blue-600 opacity-70 cursor-default"
           : `bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 
              focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 `
       }`}
      onClick={onClick}
    >
      <div className="h-5 w-5">
        {loading ? (
          // Loading icon
          <svg
            class="animate-spin -ml-1 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 -ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
      <p className="pl-0.5">{title}</p>
    </button>
  </span>
);

export default function Home() {
  const [limitPrice, setLimitPrice] = useState("");
  const [currencySelected, setCurrencySelected] = useState("USDT");
  const [error, setError] = useState(false);

  const speeds = ["Rapid (15s)", "Fast (1min)"];
  const [speed, setSpeed] = useState(speeds[0]);

  const cooldowns = ["30 Mins", "1 Day", "3 Days", "1 Time Only"];
  const [cooldown, setCooldown] = useState(cooldowns[3]);

  const [telephone, setTelephone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef(null);

  useEffect(() => {
    setSubmitted(false);
  }, [cooldown, limitPrice, currencySelected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 overflow-x-hidden	">
      <Head>
        <title>GasAlert</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1  text-center pt-14 sm:pt-0">
        <h1 className="text-4xl sm:text-6xl font-bold">GasAlert</h1>

        <p className="mt-3 text-lg w-72 sm:w-auto sm:text-xl">
          Get text alerts when gas prices on Ethereum fall below a limit
        </p>

        <div className="flex flex-wrap items-center justify-around mt-6">
          {/* <div className="p-6 mt-6 text-left border w-96 rounded-xl ">
            <div className="pt-4"> */}
          <ConversionPane
            limitPrice={limitPrice}
            setLimitPrice={setLimitPrice}
            currencySelected={currencySelected}
            setCurrencySelected={setCurrencySelected}
            speed={speed}
          />
          {/* </div>
          </div> */}
          <div
            className="flex flex-col justify-center 
                          p-6 mt-6 lg:mt-0 text-left border 
                          md:w-96 md:self-stretch rounded-xl 
                          md:ml-4"
          >
            <div className="">
              {/* <BasicInput
                label="Phone # (include country code)"
                autocomplete="tel"
              /> */}
              <PhoneInput value={telephone} setValue={setTelephone} />
            </div>
            <div className="pt-4">
              <GweiInput
                limitPrice={limitPrice}
                setLimitPrice={setLimitPrice}
                currencySelected={currencySelected}
                setCurrencySelected={setCurrencySelected}
              />
            </div>
            <div className="pt-4">
              <DropdownSelect
                name="Max text frequency"
                options={cooldowns}
                selected={cooldown}
                setSelected={setCooldown}
              />
            </div>
            <div className="pt-8 flex justify-center ">
              <SubmitButton
                title={submitted ? "Subscribed" : "Subscribe"}
                loading={loading}
                disabled={telephone === "" || loading}
                onClick={async (e) => {
                  e.preventDefault();
                  const token = await recaptchaRef.current.executeAsync();

                  setLoading(true);
                  const res = await fetch("/api/submit", {
                    body: JSON.stringify({
                      token,
                      cooldown,
                      limitPrice,
                      telephone,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    method: "PUT",
                  }).catch(() => {
                    setLoading(false);
                    setError("Sorry, an error occured.");
                  });

                  setLoading(false);

                  if (res.ok) {
                    setError(false);
                    setSubmitted(true);
                  } else {
                    const { error } = await res.json();
                    setError("Sorry, an error occured: " + error);
                  }
                }}
              />
            </div>
            {error && error !== "" && <p className="text-center">{error}</p>}
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t text-center text-xs text-gray-600 mt-8 md:mt-0">
        <div className="leading-6">
          All figures provided are estimations
          <br />
          By{" "}
          <a href="https://twitter.com/_aiddun" className="underline">
            aidan
          </a>
          <br />
          Tips: 0x288fccf4af11928e62eab282152f2987756188c0
        </div>
      </footer>

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE}
      />
    </div>
  );
}
