import React, { useState } from "react";

const TextAreaComponent = () => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value); // Log value on change
  };

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="textarea" className="mb-2 text-lg font-semibold">
        Project description:
      </label>
      <textarea
        id="textarea"
        value={value}
        onChange={handleChange}
        placeholder="Brefily describe the project's goals,your solutions and the impact you made here..."
        className="h-32 p-2 w-full border transition-colors border-gray-300 rounded-lg focus:outline-black"
      />
    </div>
  );
};

export default TextAreaComponent;
