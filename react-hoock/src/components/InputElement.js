import React, { useRef } from "react";

const InputElement = ({ inputValue, setInputValue }) => {
  const inputRef = useRef(null);
  return (
    <div>
      <input
        ref={inputRef}
        value={inputValue}
        placeholder="Add some task"
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};

export default InputElement;
