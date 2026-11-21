// 📁 components/TextAreaBox.jsx
import React from "react";

export const TextAreaBox = ({ value, onChange, placeholder, readOnly = false }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full h-56 p-4 border rounded-xl bg-${readOnly ? "gray-100" : "blue-50"} text-black resize-none`}
  />
);