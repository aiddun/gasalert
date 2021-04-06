const VerticalTabSelect = ({
  elements,
  selectedElement,
  setSelectedElement,
}) => {
  const commonStyle =
    "currencySelect py-1 text-xs text-center font-medium  border-l border-r focus:outline-none mx-auto w-7";

  const nonSelectedStyle =
    "border-gray-300 bg-white  text-gray-700 hover:bg-gray-50";

  const selectedStyle = "border-gray-300 bg-blue-600 text-white";

  return (
    <div
      className="z-0 flex flex-col justify-center items-center rounded-md shadow-sm -space-x-px 0"
      aria-label="Pagination"
    >
      {elements.map((el, index, arr) => (
        <button
          key={`${el} + ${selectedElement}`}
          className={`${`${commonStyle} ${
            index == 0
              ? "border-t border-b rounded-t-md self-center"
              : index <= arr.length - 2
              ? "rounded-none	"
              : "border-t border-b rounded-b-md "
          }`} ${el == selectedElement ? selectedStyle : nonSelectedStyle}`}
          onClick={(e) => setSelectedElement(e.target.innerText)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

export default VerticalTabSelect;
