import { areaCodes } from "../util/areaCodes";
import { useState } from "react";

const PhoneInput = () => {
  const autocomplete = "Tel";
  const placeholder = "";

  const [country, setCountry] = useState("US");

  const displayCountry = `${country} ${areaCodes[country]}`;
  console.log({ width: `${displayCountry.length * 10}rem` });

  return (
    <div>
      <label
        for="phone_number"
        className="block text-sm font-medium text-gray-700"
      >
        Phone Number
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <select
            aria-label="Country"
            className="form-select h-full py-0 pl-3 
            pr-0 border-transparent bg-transparent 
            text-gray-500 sm:text-sm sm:leading-5 max-w-3xl "
            defaultValue={`${country} ${areaCodes[country]}`}
            onChange={(e) => setCountry(e.target.value.split(" ")[0])}
            style={{
              width: `${
                displayCountry.length < 7
                  ? displayCountry.length * 1.15
                  : displayCountry.length > 8
                  ? displayCountry.length * 0.9
                  : displayCountry.length * 1.05
              }em`,
            }}
          >
            {Object.entries(areaCodes).map(([name, code]) => (
              <option>{`${name} ${code}`}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name={autocomplete}
          autocomplete={autocomplete}
          className={`transition duration-200 
          focus:ring-indigo-500 focus:border-indigo-500 block w-full  
          sm:text-sm border-gray-300 rounded-md`}
          style={{
            paddingLeft: `${
              displayCountry.length < 9
                ? displayCountry.length
                : displayCountry.length * 0.8
            }rem`,
          }}
          placeholder={placeholder}
        />
      </div>
    </div>

    // <div>
    //   <div className="mt-1 relative rounded-md shadow-sm">

    //     <input
    //       id="phone_number"
    //       className="form-input block w-full pl-16 sm:text-sm sm:leading-5
    //       transition duration-200 focus:ring-indigo-500 focus:border-indigo-500
    //        border-gray-300 rounded-md"
    //       placeholder="+1 (555) 987-6543"
    //     />
    //   </div>
    // </div>
  );
};

export default PhoneInput;
