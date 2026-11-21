// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { FaSearch, FaUpload, FaSpinner, FaExternalLinkAlt, FaMicrophone, FaImage, FaTimes } from 'react-icons/fa';
// import SimilarityResults from '../components/SimilarityResults';
// import { Navbar } from '../components/Navbar';
// import Header from "../components/Header";
// const SimilarityPage = () => {
//   const [query, setQuery] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const fileInputRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // Initialize speech recognition
//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window) {
//       recognitionRef.current = new window.webkitSpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'fr-FR';

//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setQuery(transcript);
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error', event.error);
//         setIsListening(false);
//         setError('Speech recognition failed');
//       };
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   const toggleSpeechRecognition = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const handleImageUpload = useCallback((file) => {
//     if (!file) return;
    
//     if (file.size > 5 * 1024 * 1024) {
//       setError('Image size should be less than 5MB');
//       return;
//     }
    
//     if (!['image/jpeg', 'image/png'].includes(file.type)) {
//       setError('Only JPEG and PNG images are allowed');
//       return;
//     }
    
//     setImageFile(file);
//     setQuery(`Image: ${file.name}`);
//     setError(null);
//   }, []);

//   const handleSearch = useCallback(async () => {
//     if (!query && !imageFile) {
//       setError('Please enter a search term or upload an image');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResults(null);

//     try {
//       const formData = new FormData();
//       if (query && !imageFile) formData.append('query', query);
//       if (imageFile) formData.append('image', imageFile);

//       const response = await fetch('http://localhost:8000/api/similarity', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || `Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setResults(data);
//     } catch (err) {
//       setError(err.message || 'An error occurred during search');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [query, imageFile]);

//   const clearSearch = () => {
//     setQuery('');
//     setImageFile(null);
//     setResults(null);
//     setError(null);
//   };

//   return (
//     <Navbar>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Unified Search Bar */}
//           <div className="flex flex-col items-center justify-center min-h-[40vh]">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//               Multimodal Image Search
//             </h1>
            
//             <div className="w-full max-w-2xl">
//               <div className="relative">
//                 <div className="flex items-center border border-gray-300 rounded-full shadow-lg hover:shadow-md transition-shadow bg-white">
//                   <input
//                     type="text"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Search with text or upload an image..."
//                     className="w-full py-3 px-5 rounded-full focus:outline-none"
//                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                     disabled={loading}
//                   />
                  
//                   <div className="flex items-center pr-2 space-x-1">
//                     <button
//                       onClick={toggleSpeechRecognition}
//                       className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:bg-gray-100'}`}
//                       disabled={!('webkitSpeechRecognition' in window)}
//                       title="Voice search"
//                     >
//                       <FaMicrophone />
//                     </button>
                    
//                     <label className="p-2 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer" title="Upload image">
//                       <FaUpload />
//                       <input 
//                         ref={fileInputRef}
//                         type="file" 
//                         className="hidden" 
//                         accept="image/*"
//                         onChange={(e) => handleImageUpload(e.target.files[0])}
//                         disabled={loading}
//                       />
//                     </label>
                    
//                     <button
//                       onClick={handleSearch}
//                       disabled={loading || (!query && !imageFile)}
//                       className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       title="Search"
//                     >
//                       {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
//                     </button>
//                   </div>
//                 </div>
                
//                 {imageFile && (
//                   <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
//                     <div className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm mt-2">
//                       <FaImage className="mr-2" />
//                       {imageFile.name}
//                       <button 
//                         onClick={() => {
//                           setImageFile(null);
//                           if (query.startsWith('Image: ')) setQuery('');
//                         }}
//                         className="ml-2 text-gray-500 hover:text-gray-700"
//                       >
//                         <FaTimes />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {error && (
//                 <div className="mt-4 text-center text-red-500 text-sm">
//                   {error}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Results Display */}
//           {loading ? (
//             <div className="flex justify-center mt-8">
//               <FaSpinner className="animate-spin text-4xl text-blue-600" />
//             </div>
//           ) : results ? (
//             <div className="mt-8 space-y-6">
//               <SimilarityResults data={results} />
              
//               {results.results?.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//                   {results.results.map((result, index) => (
//                     <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                       <div className="relative aspect-square">
//                         <img
//                           src={result.image_url}
//                           alt={result.title}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
//                           }}
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
//                           <p className="text-white font-medium truncate">{result.title}</p>
//                           <div className="flex justify-between items-center mt-1">
//                             <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
//                               {(result.similarity * 100).toFixed(1)}% match
//                             </span>
//                             <a 
//                               href={result.url} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="text-white hover:text-blue-300 text-sm flex items-center gap-1"
//                             >
//                               <FaExternalLinkAlt size={12} />
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
//                   <div className="mx-auto max-w-md">
//                     <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                       <FaSearch className="text-gray-400 text-2xl" />
//                     </div>
//                     <h2 className="text-lg md:text-xl font-medium text-gray-900">No results found</h2>
//                     <p className="mt-2 text-gray-500">
//                       Try a different search term or image
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 text-center border border-gray-200 mt-8">
//               <div className="mx-auto max-w-md">
//                 <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                   <FaSearch className="text-gray-400 text-2xl md:text-3xl" />
//                 </div>
//                 <h2 className="text-lg md:text-xl font-medium text-gray-900">Search for images</h2>
//                 <p className="mt-2 text-gray-500">
//                   Enter text, use voice search, or upload an image to find similar images
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Navbar>
//   );
// };

// export default SimilarityPage;
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaSearch, FaSpinner, FaExternalLinkAlt, FaMicrophone, FaCamera, FaTimes } from 'react-icons/fa';
import SimilarityResults from '../components/SimilarityResults';
import { Navbar } from '../components/Navbar';
import Header from "../components/Header";

const SimilarityPage = () => {
  const [query, setQuery] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale', event.error);
        setIsListening(false);
        setError('Erreur de reconnaissance vocale');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageUpload = useCallback((file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('La taille de l\'image doit être inférieure à 5MB');
      return;
    }
    
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Seuls les formats JPEG et PNG sont autorisés');
      return;
    }
    
    setImageFile(file);
    setError(null);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query && !imageFile) {
      setError('Veuillez entrer un terme de recherche ou télécharger une image');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      if (query && !imageFile) formData.append('query', query);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('http://localhost:8000/api/similarity', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erreur: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la recherche');
      console.error('Erreur de recherche:', err);
    } finally {
      setLoading(false);
    }
  }, [query, imageFile]);

  const clearSearch = () => {
    setQuery('');
    setImageFile(null);
    setResults(null);
    setError(null);
  };

  return (
    <Navbar>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="w-full mb-8">
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-xl shadow-lg hover:shadow-md transition-shadow bg-white h-16">
                {/* Image preview on the left */}
                {imageFile && (
                  <div className="flex items-center ml-3">
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Preview" 
                      className="w-10 h-10 rounded object-cover border border-gray-200"
                    />
                    <button 
                      onClick={() => {
                        setImageFile(null);
                        setQuery('');
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700 p-1"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher avec du texte ou télécharger une image..."
                  className="w-full h-full py-4 px-6 rounded-xl focus:outline-none text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={loading}
                />
                
                <div className="flex items-center pr-4 space-x-2">
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`p-3 rounded-full ${isListening ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:bg-gray-100'}`}
                    disabled={!('webkitSpeechRecognition' in window)}
                    title="Recherche vocale"
                  >
                    <FaMicrophone />
                  </button>
                  
                  <label className="p-3 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer" title="Télécharger une image">
                    <FaCamera />
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      disabled={loading}
                    />
                  </label>
                  
                  <button
                    onClick={handleSearch}
                    disabled={loading || (!query && !imageFile)}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Rechercher"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-2 text-center text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="flex justify-center mt-8">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          ) : results ? (
            <div className="mt-8 space-y-6">
              <SimilarityResults data={results} />
              
              {results.results?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {results.results.map((result, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square">
                        <img
                          src={result.image_url}
                          alt={result.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300?text=Image+Non+Trouvée';
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
                          <p className="text-white font-medium truncate">{result.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              {(result.similarity * 100).toFixed(1)}% correspondance
                            </span>
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-white hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                              <FaExternalLinkAlt size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
                  <div className="mx-auto max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaSearch className="text-gray-400 text-2xl" />
                    </div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-900">Aucun résultat trouvé</h2>
                    <p className="mt-2 text-gray-500">
                      Essayez un autre terme de recherche ou une autre image
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 text-center border border-gray-200 mt-8">
              <div className="mx-auto max-w-md">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaSearch className="text-gray-400 text-2xl md:text-3xl" />
                </div>
                <h2 className="text-lg md:text-xl font-medium text-gray-900">Recherche d'images</h2>
                <p className="mt-2 text-gray-500">
                  Entrez du texte, utilisez la recherche vocale ou téléchargez une image pour trouver des images similaires
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default SimilarityPage;