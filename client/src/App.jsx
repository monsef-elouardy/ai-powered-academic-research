// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navbar } from "./components/Navbar";
// import Footer from "./components/Footer";

// import HomePage from "./pages/HomePage";
// import TranslationPage from "./pages/TranslationPage";
// import PlagiarismPage from "./pages/PlagiarismPage";
// import SimilarityPage from "./pages/SimilarityPage";

// const App = () => (
//   <Router>
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/translate" element={<TranslationPage />} />
//           <Route path="/plagiarism" element={<PlagiarismPage />} />
//           <Route path="/similarity" element={<SimilarityPage />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   </Router>
// );

// export default App;
// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import TranslationPage from "./pages/TranslationPage";
import PlagiarismPage from "./pages/PlagiarismPage";
import SimilarityPage from "./pages/SimilarityPage";

const App = () => (
  <Router>
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/translate" element={<TranslationPage />} />
        <Route path="/plagiarism" element={<PlagiarismPage />} />
        <Route path="/similarity" element={<SimilarityPage />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

export default App;