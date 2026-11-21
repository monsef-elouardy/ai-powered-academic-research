// 📁 components/LanguageSelector.jsx
import React from "react";

export const LanguageSelector = ({ value, onChange, label }) => (
  <div className="flex flex-col">
    <label className="font-medium text-sm mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="p-2 border rounded-md bg-white shadow-sm"
    >
      <option value="fr">Français</option>
      <option value="en">Anglais</option>
      <option value="ar">Arabe</option>
    </select>
  </div>
);
