// 📁 components/MainContent.jsx
import React from "react";
import { Footer } from "./Footer";

export const MainContent = ({ children }) => {
  return (
    <div className="pl-64 min-h-screen flex flex-col"> {/* pl-64 correspond à la largeur de la sidebar */}
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};