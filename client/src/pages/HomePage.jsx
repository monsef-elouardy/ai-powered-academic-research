// // export default HomePage;
// import React from 'react';
// import { FaExchangeAlt, FaGlobe, FaShieldAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.jpg';

// const HomePage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation minimaliste */}
//       <nav className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-lg overflow-hidden">
//               <img 
//                 src={logo} 
//                 alt="TPS Logo" 
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <h1 className="text-xl font-semibold text-gray-800">TPS</h1>
//           </div>
//           <button 
//             onClick={() => navigate('/translate')}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
//           >
//             Commencer
//           </button>
//         </div>
//       </nav>

//       {/* Features Grid avec liens */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Solutions académiques</h2>
//           <p className="text-gray-600 max-w-xl mx-auto">
//             Outils spécialisés pour répondre aux besoins des chercheurs et universitaires
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <FeatureCard 
//             icon={<FaExchangeAlt className="text-blue-500 text-2xl" />}
//             title="Traduction Multilingue"
//             description="Traductions précises entre français, anglais et arabe ... avec préservation du contexte académique."
//             borderColor="border-blue-200"
//             link="/translate"
//             linkText="Accéder à la traduction"
//           />
//           <FeatureCard 
//             icon={<FaShieldAlt className="text-green-500 text-2xl" />}
//             title="Détection de Plagiat"
//             description="Analyse approfondie contre des milliards de sources académiques et publications."
//             borderColor="border-green-200"
//             link="/plagiarism"
//             linkText="Vérifier un document"
//           />
//           <FeatureCard 
//             icon={<FaChartLine className="text-purple-500 text-2xl" />}
//             title="Analyse de Similarité"
//             description="Comparaison avancée avec les travaux existants pour garantir l'originalité."
//             borderColor="border-purple-200"
//             link="/similarity"
//             linkText="Analyser un texte"
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// // Composant de carte de fonctionnalité avec lien
// const FeatureCard = ({ icon, title, description, borderColor, link, linkText }) => {
//   const navigate = useNavigate();

//   return (
//     <div 
//       className={`bg-white p-6 rounded-lg border-t-4 ${borderColor} shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer group`}
//       onClick={() => navigate(link)}
//     >
//       <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center mb-4">
//         {icon}
//       </div>
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       <p className="text-gray-600 text-sm flex-grow mb-4">{description}</p>
//       <div className="mt-auto">
//         <button 
//           className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
//           onClick={(e) => {
//             e.stopPropagation();
//             navigate(link);
//           }}
//         >
//           {linkText} <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React from 'react';
import { FaExchangeAlt, FaGlobe, FaShieldAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation avec style sombre */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src={logo} 
                alt="TPS Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold text-white">TPS</h1>
          </div>
          <button 
            onClick={() => navigate('/translate')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-sm font-medium"
          >
            Commencer
          </button>
        </div>
      </nav>

      {/* Contenu principal avec style sombre */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Solutions académiques</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Outils spécialisés pour répondre aux besoins des chercheurs et universitaires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<FaExchangeAlt className="text-blue-400 text-2xl" />}
            title="Traduction Multilingue"
            description="Traductions précises entre français, anglais et arabe,Amazigh ... avec préservation du contexte académique."
            borderColor="border-blue-500"
            bgColor="bg-gray-800"
            link="/translate"
            linkText="Accéder à la traduction"
          />
          <FeatureCard 
            icon={<FaShieldAlt className="text-green-400 text-2xl" />}
            title="Détection de Plagiat"
            description="Analyse approfondie contre des milliards de sources académiques et publications."
            borderColor="border-green-500"
            bgColor="bg-gray-800"
            link="/plagiarism"
            linkText="Vérifier un document"
          />
          <FeatureCard 
            icon={<FaChartLine className="text-purple-400 text-2xl" />}
            title="Analyse de Similarité"
            description="Comparaison avancée avec les travaux existants pour garantir l'originalité."
            borderColor="border-purple-500"
            bgColor="bg-gray-800"
            link="/similarity"
            linkText="Analyser un texte"
          />
        </div>
      </main>
    </div>
  );
};

// Composant de carte de fonctionnalité avec style sombre
const FeatureCard = ({ icon, title, description, borderColor, bgColor, link, linkText }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`${bgColor} p-6 rounded-lg border-t-4 ${borderColor} shadow-lg hover:shadow-xl transition-all h-full flex flex-col cursor-pointer group hover:bg-gray-750`}
      onClick={() => navigate(link)}
    >
      <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm flex-grow mb-4">{description}</p>
      <div className="mt-auto">
        <button 
          className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
          onClick={(e) => {
            e.stopPropagation();
            navigate(link);
          }}
        >
          {linkText} <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;