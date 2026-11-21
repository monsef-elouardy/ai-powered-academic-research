// // // src/components/Navbar.jsx
// // import React, { useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import logo from '../assets/logo.jpg';
// // import {
// //   FaShieldAlt,
// //   FaChartLine,
// //   FaCog,
// //   FaHome,
// //   FaBars,
// //   FaChevronLeft,
// //   FaChevronRight,
// //   FaExchangeAlt,
// //   FaUser,
// // } from "react-icons/fa";

// // const Navbar = ({ children }) => {
// //   // const location = useLocation();
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// //   const [isHovered, setIsHovered] = useState(false);
// //   const [isToggleHovered, setIsToggleHovered] = useState(false);

// //   const toggleSidebar = () => setIsSidebarOpen((v) => !v);

// //   /* Calculs d’état de la barre latérale */
// //   const shouldShowFullSidebar = isSidebarOpen || isHovered;
// //   const sidebarWidth = shouldShowFullSidebar ? "w-64" : "w-20";
// //   const contentMargin = shouldShowFullSidebar ? "ml-64" : "ml-20";

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* ----------------- Sidebar ----------------- */}
// //       <aside
// //         className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-gray-900 text-white flex flex-col z-50 transition-all duration-300`}
// //         onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
// //         onMouseLeave={() => setIsHovered(false)}
// //       >
// //         {/* Logo + bouton toggle */}
// //         <div className="p-4 flex items-center justify-between border-b border-gray-800">
// //           {shouldShowFullSidebar ? (
// //             <div className="flex items-center space-x-2 animate-fadeIn">
// //               {/* <div className="bg-blue-600 p-2 rounded-lg">
// //                 <FaUser className="text-white text-lg" />
// //               </div> */}
// //               <h1 className="text-xl font-bold">TPS</h1>
// //             </div>
// //           ) : (
// //             <div className="bg-blue-600 p-2 rounded-lg mx-auto">
// //               <FaUser className="text-white text-lg" />
// //             </div>
// //           )}

// //           <button
// //             onClick={toggleSidebar}
// //             className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
// //             onMouseEnter={() => setIsToggleHovered(true)}
// //             onMouseLeave={() => setIsToggleHovered(false)}
// //             title="Toggle sidebar"
// //           >
// //             {isSidebarOpen ? (
// //               isToggleHovered ? (
// //                 <FaChevronLeft className="text-white text-lg" />
// //               ) : (
// //                 <FaBars className="text-white text-lg" />
// //               )
// //             ) : isToggleHovered ? (
// //               <FaChevronRight className="text-white text-lg" />
// //             ) : (
// //               <FaBars className="text-white text-lg" />
// //             )}
// //           </button>
// //         </div>

// //         {/* Menu principal */}
// //         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
// //           <NavItem to="/" icon={<FaHome />} label="Accueil" />
// //           <NavItem to="/translate" icon={<FaExchangeAlt />} label="Traduction" />
// //           <NavItem to="/plagiarism" icon={<FaShieldAlt />} label="Détection de plagiat" />
// //           <NavItem to="/similarity" icon={<FaChartLine />} label="Analyse de similarité" />
// //         </nav>

// //         {/* Menu secondaire */}
// //         {/* <div className="p-4 border-t border-gray-800">
// //           <NavItem to="/settings" icon={<FaCog />} label="Paramètres" />
// //         </div> */}
// //       </aside>

// //       {/* ----------------- Contenu principal ----------------- */}
// //       <div className={`flex-1 flex flex-col ${contentMargin} transition-all duration-300`}>
// //         {/* Bouton pour ré-ouvrir la sidebar lorsqu’elle est fermée */}
// //         {!isSidebarOpen && !isHovered && (
// //           <button
// //             onClick={toggleSidebar}
// //             className="fixed top-4 left-6 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors hover:scale-110"
// //             title="Ouvrir la barre latérale"
// //           >
// //             <FaBars className="text-lg" />
// //           </button>
// //         )}

// //         <main className="flex-1 overflow-y-auto p-6">{children}</main>
// //       </div>
// //     </div>
// //   );
// // };

// // /* --------- Petit composant utilitaire pour un item de menu --------- */
// // const NavItem = ({ to, icon, label }) => {
// //   const location = useLocation();
// //   const pathActive = location.pathname === to;

// //   return (
// //     <Link
// //       to={to}
// //       className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
// //         pathActive ? "bg-gray-800" : "hover:bg-gray-800"
// //       }`}
// //     >
// //       <span className="text-blue-400 text-lg">{icon}</span>
// //       {/* Affiche le texte seulement si la sidebar est élargie */}
// //       <span className="block truncate">{label}</span>
// //     </Link>
// //   );
// // };

// // /* --------------------------------------------------------------- */
// // export { Navbar };   // named export
// // // export default Navbar; // 👈 ajout d’un export default

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import logo from '../assets/logo.jpg';
// import {
//   FaShieldAlt,
//   FaChartLine,
//   FaCog,
//   FaHome,
//   FaBars,
//   FaChevronLeft,
//   FaChevronRight,
//   FaExchangeAlt,
// } from "react-icons/fa";

// const Navbar = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isToggleHovered, setIsToggleHovered] = useState(false);

//   const toggleSidebar = () => setIsSidebarOpen((v) => !v);

//   const shouldShowFullSidebar = isSidebarOpen || isHovered;
//   const sidebarWidth = shouldShowFullSidebar ? "w-64" : "w-20";
//   const contentMargin = shouldShowFullSidebar ? "ml-64" : "ml-20";

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* ----------------- Sidebar ----------------- */}
//       <aside
//         className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-gray-900 text-white flex flex-col z-50 transition-all duration-300`}
//         onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Logo + bouton toggle */}
//         <div className="p-4 flex items-center justify-between border-b border-gray-800">
//           {shouldShowFullSidebar ? (
//             <div className="flex items-center space-x-3 animate-fadeIn">
//               <img 
//                 src={logo} 
//                 alt="Logo" 
//                 className="w-8 h-8 rounded-lg object-cover"
//               />
//               <h1 className="text-xl font-bold">TPS</h1>
//             </div>
//           ) : (
//             <div className="w-8 h-8"></div> // Espace vide pour garder l'alignement
//           )}

//           <button
//             onClick={toggleSidebar}
//             className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
//             onMouseEnter={() => setIsToggleHovered(true)}
//             onMouseLeave={() => setIsToggleHovered(false)}
//             title="Toggle sidebar"
//           >
//             {isSidebarOpen ? (
//               isToggleHovered ? (
//                 <FaChevronLeft className="text-white text-lg" />
//               ) : (
//                 <FaBars className="text-white text-lg" />
//               )
//             ) : isToggleHovered ? (
//               <FaChevronRight className="text-white text-lg" />
//             ) : (
//               <FaBars className="text-white text-lg" />
//             )}
//           </button>
//         </div>

//         {/* Menu principal */}
//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//           <NavItem to="/" icon={<FaHome />} label="Accueil" />
//           <NavItem to="/translate" icon={<FaExchangeAlt />} label="Traduction" />
//           <NavItem to="/plagiarism" icon={<FaShieldAlt />} label="Détection de plagiat" />
//           <NavItem to="/similarity" icon={<FaChartLine />} label="Analyse de similarité" />
//         </nav>
//       </aside>

//       {/* ----------------- Contenu principal ----------------- */}
//       <div className={`flex-1 flex flex-col ${contentMargin} transition-all duration-300`}>
//         {!isSidebarOpen && !isHovered && (
//           <button
//             onClick={toggleSidebar}
//             className="fixed top-4 left-6 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors hover:scale-110"
//             title="Ouvrir la barre latérale"
//           >
//             <FaBars className="text-lg" />
//           </button>
//         )}

//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   );
// };

// const NavItem = ({ to, icon, label }) => {
//   const location = useLocation();
//   const pathActive = location.pathname === to;

//   return (
//     <Link
//       to={to}
//       className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
//         pathActive ? "bg-gray-800" : "hover:bg-gray-800"
//       }`}
//     >
//       <span className="text-blue-400 text-lg">{icon}</span>
//       <span className="block truncate">{label}</span>
//     </Link>
//   );
// };

// export { Navbar };
// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.jpg';
import {
  FaShieldAlt,
  FaChartLine,
  FaHome,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
} from "react-icons/fa";

const Navbar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  const shouldShowFullSidebar = isSidebarOpen || isHovered;
  const sidebarWidth = shouldShowFullSidebar ? "w-64" : "w-20";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-gray-900 text-white flex flex-col z-50 transition-all duration-300`}
        onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo + bouton toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {shouldShowFullSidebar ? (
            <div className="flex items-center space-x-3 animate-fadeIn">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <h1 className="text-xl font-bold">TPS</h1>
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            title="Toggle sidebar"
          >
            {isSidebarOpen ? (
              isToggleHovered ? (
                <FaChevronLeft className="text-white text-lg" />
              ) : (
                <FaBars className="text-white text-lg" />
              )
            ) : isToggleHovered ? (
              <FaChevronRight className="text-white text-lg" />
            ) : (
              <FaBars className="text-white text-lg" />
            )}
          </button>
        </div>

        {/* Menu principal */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/" icon={<FaHome />} label="Accueil" />
          <NavItem to="/translate" icon={<FaExchangeAlt />} label="Traduction" />
          <NavItem to="/plagiarism" icon={<FaShieldAlt />} label="Détection de plagiat" />
          <NavItem to="/similarity" icon={<FaChartLine />} label="Analyse de similarité" />
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${shouldShowFullSidebar ? 'ml-64' : 'ml-20'}`}>
        {!isSidebarOpen && !isHovered && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-6 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors hover:scale-110"
            title="Ouvrir la barre latérale"
          >
            <FaBars className="text-lg" />
          </button>
        )}

        <main className="flex-1 overflow-y-auto pt-20 px-6">{children}</main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const pathActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
        pathActive ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
    >
      <span className="text-blue-400 text-lg">{icon}</span>
      <span className="block truncate">{label}</span>
    </Link>
  );
};

export { Navbar };