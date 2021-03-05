const HorizontalTabSelect = ({
  elements,
  selectedElement,
  setSelectedElement,
}) => {
  const commonStyle =
    "currencySelect relative inline-flex items-center py-2 text-sm font-medium focus:outline-none border";

  const nonSelectedStyle =
    "border-gray-300 bg-white  text-gray-700 hover:bg-gray-50";

  const selectedStyle = "border-gray-300 bg-blue-600 text-white";

  return (
    <div
      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px "
      aria-label="Pagination"
    >
      {elements.map((el, index, arr) => (
        <button
          key={`${el} + ${selectedElement}`}
          className={`${`${commonStyle} ${
            index == 0
              ? " px-2 rounded-l-md "
              : index <= arr.length - 2
              ? " px-2"
              : " px-2 rounded-r-md "
          }`} ${el == selectedElement ? selectedStyle : nonSelectedStyle}`}
          onClick={(e) => setSelectedElement(e.target.innerText)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

export default HorizontalTabSelect;
