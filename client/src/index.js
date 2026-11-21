// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import HomePage from './HomePage';
// import TranslationPage from './pages/TranslationPage';
// import PlagiarismPage from './pages/PlagiarismPage';
// import SimilarityPage from './pages/SimilarityPage';
// import reportWebVitals from './reportWebVitals';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <HomePage />,
//   },
//   {
//     path: "/translate",
//     element: <TranslationPage />,
//   },
//   {
//     path: "/plagiarism",
//     element: <PlagiarismPage />,
//   },
//   {
//     path: "/similarity",
//     element: <SimilarityPage />,
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

// reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();