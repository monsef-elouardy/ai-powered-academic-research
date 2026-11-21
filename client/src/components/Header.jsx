// // src/components/Header.jsx
// import React from "react";
// import { useLocation } from "react-router-dom";
// import {
//   FaExchangeAlt,
//   FaShieldAlt,
//   FaChartLine
// } from "react-icons/fa";

// const Header = () => {
//   const location = useLocation();
  
//   // Déterminer le titre et l'icône en fonction de la route
//   const getPageInfo = () => {
//     switch(location.pathname) {
//       case "/translate":
//         return { 
//           title: "Traduction Multilingue", 
//           icon: <FaExchangeAlt className="text-2xl text-blue-600" /> 
//         };
//       case "/plagiarism":
//         return { 
//           title: "Détection de Plagiat", 
//           icon: <FaShieldAlt className="text-2xl text-green-600" /> 
//         };
//       case "/similarity":
//         return { 
//           title: "Analyse de Similarité", 
//           icon: <FaChartLine className="text-2xl text-purple-600" /> 
//         };
//       default:
//         return null; // Ne rien afficher pour l'accueil et autres routes
//     }
//   };

//   const pageInfo = getPageInfo();

//   if (!pageInfo) return null;

//   return (
//     <header className="bg-white shadow-sm py-6">
//       <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
//         <div className="bg-gray-100 p-3 rounded-full">
//           {pageInfo.icon}
//         </div>
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//           {pageInfo.title}
//         </h1>
//       </div>
//     </header>
//   );
// };

// export default Header;
// src/components/Header.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  FaExchangeAlt,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  
  const getPageInfo = () => {
    switch(location.pathname) {
      case "/translate":
        return { 
          title: "Traduction Multilingue", 
          icon: <FaExchangeAlt className="text-2xl text-blue-600" />,
          gradient: "bg-gradient-to-r from-blue-500 to-blue-700"
        };
      case "/plagiarism":
        return { 
          title: "Détection de Plagiat", 
          icon: <FaShieldAlt className="text-2xl text-green-600" />,
          gradient: "bg-gradient-to-r from-green-500 to-green-700"
        };
      case "/similarity":
        return { 
          title: "Analyse de Similarité", 
          icon: <FaChartLine className="text-2xl text-purple-600" />,
          gradient: "bg-gradient-to-r from-purple-500 to-purple-700"
        };
      default:
        return null;
    }
  };

  const pageInfo = getPageInfo();

  if (!pageInfo) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm py-4 z-40 ml-20">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
        <div className="bg-gray-100 p-3 rounded-full">
          {pageInfo.icon}
        </div>
        <h1 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent ${pageInfo.gradient}`}>
          {pageInfo.title}
        </h1>
      </div>
    </header>
  );
};

export default Header;