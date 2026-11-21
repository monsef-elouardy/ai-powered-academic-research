// // import React, { useState } from "react";
// // import { FaShieldAlt, FaFileUpload, FaDownload, FaArrowLeft, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import { Navbar } from "../components/Navbar";
// // import Header from "../components/Header";
// // import mammoth from "mammoth";

// // const SERPER_API_KEY = "1c1cb592b8d3aedafade5bfd0ca9d5d9f134648f";

// // const PlagiarismPage = () => {
// //   const navigate = useNavigate();
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [textContent, setTextContent] = useState("");
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [analysisResult, setAnalysisResult] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [activeTab, setActiveTab] = useState("text");

// //   const [aiDetectionResult, setAiDetectionResult] = useState(null);

// //   const handleFileChange = async (event) => {
// //     const file = event.target.files[0];
// //     if (!file) return;

// //     if (file.size > 10 * 1024 * 1024) {
// //       setError("Le fichier est trop volumineux (max 10MB)");
// //       return;
// //     }

// //     setSelectedFile(file);
// //     setError(null);

// //     try {
// //       const content = await readFileContent(file);
// //       setTextContent(content);
// //     } catch (err) {
// //       setError("Erreur lors de la lecture du fichier");
// //       console.error(err);
// //     }
// //   };

// //   const readFileContent = (file) => {
// //     return new Promise((resolve, reject) => {
// //       const reader = new FileReader();
      
// //       reader.onload = async (event) => {
// //         try {
// //           if (file.type === "application/pdf") {
// //             resolve(event.target.result);
// //           } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
// //             const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
// //             resolve(result.value);
// //           } else {
// //             resolve(event.target.result);
// //           }
// //         } catch (err) {
// //           reject(err);
// //         }
// //       };
      
// //       reader.onerror = (error) => {
// //         reject(error);
// //       };

// //       if (file.type === "application/pdf") {
// //         reader.readAsText(file);
// //       } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
// //         reader.readAsArrayBuffer(file);
// //       } else {
// //         reader.readAsText(file);
// //       }
// //     });
// //   };


// //   const handleTextChange = (e) => {
// //     setTextContent(e.target.value);
// //     setSelectedFile(null);
// //     setError(null);
// //   };

// //   const analyzeContent = async () => {
// //     if ((!textContent || textContent.trim().length < 500) && !selectedFile) {
// //       setError("Veuillez saisir au moins 500 caractères ou importer un fichier");
// //       return;
// //     }

// //     setIsAnalyzing(true);
// //     setAnalysisResult(null);
// //     setError(null);

// //     try {
// //       let contentToAnalyze = textContent;
// //       if (selectedFile) {
// //         contentToAnalyze = await readFileContent(selectedFile);
// //       }

// //       const sentences = extractKeySentences(contentToAnalyze);
// //       const matches = [];
// //       let totalSimilarity = 0;
// //       let analyzedSentences = 0;

// //       for (const sentence of sentences.slice(0, 10)) {
// //         if (sentence.trim().length < 30) continue;
        
// //         try {
// //           const result = await searchWithSerper(sentence);
// //           if (result.matches && result.matches.length > 0) {
// //             matches.push(...result.matches);
// //             totalSimilarity += result.similarity;
// //             analyzedSentences++;
// //           }
// //         } catch (err) {
// //           console.error(`Erreur lors de l'analyse de la phrase: "${sentence}"`, err);
// //           continue;
// //         }
// //       }

// //       const overallSimilarity = analyzedSentences > 0 
// //         ? Math.min(100, Math.round(totalSimilarity / analyzedSentences))
// //         : 0;

// //       setAnalysisResult({
// //         similarity: overallSimilarity,
// //         uniqueness: 100 - overallSimilarity,
// //         matches: matches.slice(0, 10),
// //         analyzedText: contentToAnalyze,
// //         source: selectedFile ? selectedFile.name : "Texte saisi"
// //       });

// //     } catch (err) {
// //       setError("Erreur lors de l'analyse du contenu");
// //       console.error(err);
// //     } finally {
// //       setIsAnalyzing(false);
// //     }
// //   };

// //   const extractKeySentences = (text) => {
// //     const cleanText = text.replace(/\s+/g, ' ').trim();
// //     return cleanText.split(/[.!?]\s+/)
// //       .filter(s => s.length > 50)
// //       .map(s => s.trim());
// //   };

// //   const searchWithSerper = async (query) => {
// //     try {
// //       const cleanQuery = query.slice(0, 200).replace(/[^\w\s]/g, '');
// //       if (cleanQuery.length < 15) return { matches: [], similarity: 0 };
      
// //       const response = await fetch("https://google.serper.dev/search", {
// //         method: "POST",
// //         headers: {
// //           "X-API-KEY": SERPER_API_KEY,
// //           "Content-Type": "application/json",
// //           "Accept": "application/json"
// //         },
// //         body: JSON.stringify({
// //           q: `"${cleanQuery}"`,
// //           gl: "fr",
// //           hl: "fr",
// //           num: 5
// //         })
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`Erreur API: ${response.status} - ${errorText}`);
// //       }

// //       const data = await response.json();
// //       return processSerperResults(query, data);

// //     } catch (err) {
// //       console.error("Erreur Serper API:", err);
// //       throw err;
// //     }
// //   };

// //   const processSerperResults = (originalQuery, data) => {
// //     const matches = [];
// //     let maxSimilarity = 0;

// //     if (data.organic && data.organic.length > 0) {
// //       data.organic.forEach(item => {
// //         const combinedText = `${item.title || ''} ${item.snippet || ''}`;
// //         const similarity = calculateSimilarity(originalQuery, combinedText);
        
// //         if (similarity > 20) {
// //           matches.push({
// //             source: item.title || "Source inconnue",
// //             url: item.link || "#",
// //             similarity: similarity,
// //             type: similarity > 70 ? "Correspondance exacte" : "Paraphrase",
// //             snippet: item.snippet || "Aucun extrait disponible"
// //           });
// //           maxSimilarity = Math.max(maxSimilarity, similarity);
// //         }
// //       });
// //     }

// //     return { matches, similarity: maxSimilarity };
// //   };

// //   const calculateSimilarity = (text1, text2) => {
// //     const normalize = (text) => text.toLowerCase()
// //       .replace(/[^\w\s]/g, '')
// //       .replace(/\s+/g, ' ')
// //       .trim();
    
// //     const normalized1 = normalize(text1);
// //     const normalized2 = normalize(text2);
    
// //     const getNGrams = (text, n = 3) => {
// //       const words = text.split(' ');
// //       const grams = [];
// //       for (let i = 0; i <= words.length - n; i++) {
// //         grams.push(words.slice(i, i + n).join(' '));
// //       }
// //       return grams;
// //     };
    
// //     const grams1 = getNGrams(normalized1);
// //     const grams2 = getNGrams(normalized2);
    
// //     const commonGrams = grams1.filter(gram => grams2.includes(gram));
// //     const similarity = (commonGrams.length / Math.max(1, grams1.length)) * 100;
    
// //     return Math.round(similarity);
// //   };

// //   const downloadReport = () => {
// //     if (!analysisResult) return;
    
// //     let reportContent = `Rapport de plagiat\n\n`;
// //     reportContent += `Source: ${analysisResult.source}\n`;
// //     reportContent += `Date d'analyse: ${new Date().toLocaleDateString()}\n\n`;
// //     reportContent += `Score de plagiat: ${analysisResult.similarity}%\n`;
// //     reportContent += `Score d'unicité: ${analysisResult.uniqueness}%\n\n`;
// //     reportContent += `Contenu analysé:\n${analysisResult.analyzedText}\n\n`;
// //     reportContent += `Correspondances trouvées:\n`;
    
// //     analysisResult.matches.forEach((match, index) => {
// //       reportContent += `\n${index + 1}. ${match.type} (${match.similarity}%)\n`;
// //       reportContent += `Source: ${match.source}\n`;
// //       reportContent += `URL: ${match.url}\n`;
// //       reportContent += `Extrait: ${match.snippet}\n`;
// //     });
    
// //     const blob = new Blob([reportContent], { type: 'text/plain' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `rapport-plagiat-${new Date().toISOString().slice(0, 10)}.txt`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   const ScoreCircle = ({ score, label, color }) => {
// //     const radius = 40;
// //     const circumference = 2 * Math.PI * radius;
// //     const strokeDashoffset = circumference - (score / 100) * circumference;

// //     return (
// //       <div className="flex flex-col items-center mx-4">
// //         <div className="relative w-32 h-32 flex items-center justify-center">
// //           <svg className="w-full h-full" viewBox="0 0 100 100">
// //             <circle
// //               className="text-gray-200"
// //               strokeWidth="8"
// //               stroke="currentColor"
// //               fill="transparent"
// //               r={radius}
// //               cx="50"
// //               cy="50"
// //             />
// //             <circle
// //               className={`text-${color}-500`}
// //               strokeWidth="8"
// //               strokeDasharray={circumference}
// //               strokeDashoffset={strokeDashoffset}
// //               strokeLinecap="round"
// //               stroke="currentColor"
// //               fill="transparent"
// //               r={radius}
// //               cx="50"
// //               cy="50"
// //               transform="rotate(-90 50 50)"
// //             />
// //           </svg>
// //           <div className="absolute flex flex-col items-center">
// //             <span className="text-3xl font-bold">{score}%</span>
// //             <span className="text-sm text-gray-500">{label}</span>
// //           </div>
// //         </div>
// //         <div className={`mt-2 flex items-center ${score > 70 ? 'text-red-500' : 'text-green-500'}`}>
// //           {score > 70 ? (
// //             <>
// //               <FaTimes className="mr-1" />
// //               <span>Risque élevé</span>
// //             </>
// //           ) : (
// //             <>
// //               <FaCheck className="mr-1" />
// //               <span>Acceptable</span>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <Navbar>
// //       <Header />
// //       <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
// //         <div className="flex-1">
// //           <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //             <section className="bg-white rounded-xl shadow-md p-8 mb-8">
// //               <div className="flex border-b border-gray-200 mb-6">
// //                 <button
// //                   className={`py-2 px-4 font-medium ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
// //                   onClick={() => setActiveTab('text')}
// //                 >
// //                   Saisir du texte
// //                 </button>
// //                 <button
// //                   className={`py-2 px-4 font-medium ${activeTab === 'file' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
// //                   onClick={() => setActiveTab('file')}
// //                 >
// //                   Importer un fichier
// //                 </button>
// //               </div>

// //               {activeTab === 'text' ? (
// //                 <div className="mb-6">
// //                   <textarea
// //                     className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
// //                     placeholder="Collez votre texte ici pour l'analyser (minimum 500 caractères)..."
// //                     value={textContent}
// //                     onChange={handleTextChange}
// //                   />
// //                   <p className="text-sm text-gray-500 mt-2">
// //                     {textContent.length} caractères | Minimum recommandé: 500 caractères
// //                   </p>
// //                 </div>
// //               ) : (
// //                 <div className="mb-6">
// //                   <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
// //                     <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
// //                       <FaFileUpload className="text-blue-600 text-3xl" />
// //                     </div>
// //                     <h3 className="text-xl font-medium text-gray-800 mb-2">
// //                       {selectedFile ? selectedFile.name : "Déposez votre fichier ici"}
// //                     </h3>
// //                     <p className="text-gray-500 mb-6">ou</p>
// //                     <input
// //                       type="file"
// //                       id="file-upload"
// //                       className="hidden"
// //                       accept=".pdf,.docx,.txt"
// //                       onChange={handleFileChange}
// //                     />
// //                     <label 
// //                       htmlFor="file-upload"
// //                       className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
// //                     >
// //                       Sélectionner un fichier
// //                     </label>
// //                     <p className="text-sm text-gray-500 mt-4">Formats supportés: PDF, DOCX, TXT (max. 10MB)</p>
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="flex justify-center">
// //                 <button 
// //                   onClick={analyzeContent}
// //                   disabled={isAnalyzing || (!textContent && !selectedFile) || (activeTab === 'text' && textContent.length < 500)}
// //                   className={`px-8 py-3 rounded-lg font-medium flex items-center ${
// //                     isAnalyzing 
// //                       ? 'bg-gray-400 cursor-not-allowed' 
// //                       : (!textContent && !selectedFile) || (activeTab === 'text' && textContent.length < 500)
// //                         ? 'bg-gray-400 cursor-not-allowed'
// //                         : 'bg-green-600 hover:bg-green-700 text-white'
// //                   }`}
// //                 >
// //                   {isAnalyzing ? (
// //                     <>
// //                       <FaSpinner className="animate-spin mr-2" />
// //                       Analyse en cours...
// //                     </>
// //                   ) : (
// //                     'Analyser le contenu'
// //                   )}
// //                 </button>
// //               </div>
// //               {error && (
// //                 <div className="mt-4 text-center text-red-500">{error}</div>
// //               )}
// //             </section>

// //             {analysisResult && (
// //               <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
// //                 <div className="bg-blue-600 text-white px-8 py-5">
// //                   <h2 className="text-2xl font-bold">Résultats de l'analyse</h2>
// //                 </div>
// //                 <div className="p-8">
// //                   <div className="flex flex-wrap justify-center my-8">
// //                     <ScoreCircle 
// //                       score={analysisResult.similarity} 
// //                       label="Plagiat" 
// //                       color="red" 
// //                     />
// //                     <ScoreCircle 
// //                       score={analysisResult.uniqueness} 
// //                       label="Unicité" 
// //                       color="green" 
// //                     />
// //                   </div>

// //                   {analysisResult.similarity > 0 ? (
// //                     <div className="space-y-6">
// //                       <h3 className="text-lg font-medium text-gray-800">Correspondances détectées:</h3>
// //                       {analysisResult.matches.map((match, index) => (
// //                         <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
// //                           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
// //                             <div>
// //                               <h4 className="font-medium text-gray-800">
// //                                 {match.type} ({match.similarity}%)
// //                               </h4>
// //                               <p className="text-gray-500 text-sm">{match.source}</p>
// //                               <a 
// //                                 href={match.url} 
// //                                 target="_blank" 
// //                                 rel="noopener noreferrer"
// //                                 className="text-blue-500 text-sm hover:underline"
// //                               >
// //                                 {match.url}
// //                               </a>
// //                             </div>
// //                             <span className={`${
// //                               match.type.includes('exacte') 
// //                                 ? 'bg-red-100 text-red-800' 
// //                                 : 'bg-orange-100 text-orange-800'
// //                             } px-3 py-1 rounded-full text-sm font-medium self-start`}>
// //                               {match.type}
// //                             </span>
// //                           </div>
// //                           {match.snippet && (
// //                             <div className="bg-gray-50 p-4 rounded-lg mt-2 text-gray-700">
// //                               {match.snippet}
// //                             </div>
// //                           )}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     <div className="text-center py-8">
// //                       <div className="bg-green-100 text-green-800 inline-block px-4 py-2 rounded-full mb-4">
// //                         Aucun plagiat détecté
// //                       </div>
// //                       <p className="text-gray-600">Aucune correspondance significative n'a été trouvée avec des sources en ligne.</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </section>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </Navbar>
// //   );
// // };

// // export default PlagiarismPage;
// import React, { useState } from "react";
// import { FaShieldAlt, FaFileUpload, FaDownload, FaArrowLeft, FaSpinner, FaCheck, FaTimes, FaRobot } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "../components/Navbar";
// import Header from "../components/Header";
// import mammoth from "mammoth";

// const SERPER_API_KEY = "1c1cb592b8d3aedafade5bfd0ca9d5d9f134648f";
// const GPTZERO_API_KEY = "fff2a06b-c95f-43ea-9bd4-624258afef9c";

// const PlagiarismPage = () => {
//   const navigate = useNavigate();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [textContent, setTextContent] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("text");
//   const [aiDetectionResult, setAiDetectionResult] = useState(null);

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (file.size > 10 * 1024 * 1024) {
//       setError("Le fichier est trop volumineux (max 10MB)");
//       return;
//     }

//     setSelectedFile(file);
//     setError(null);

//     try {
//       const content = await readFileContent(file);
//       setTextContent(content);
//     } catch (err) {
//       setError("Erreur lors de la lecture du fichier");
//       console.error(err);
//     }
//   };

//   const readFileContent = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
      
//       reader.onload = async (event) => {
//         try {
//           if (file.type === "application/pdf") {
//             resolve(event.target.result);
//           } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//             const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
//             resolve(result.value);
//           } else {
//             resolve(event.target.result);
//           }
//         } catch (err) {
//           reject(err);
//         }
//       };
      
//       reader.onerror = (error) => {
//         reject(error);
//       };

//       if (file.type === "application/pdf") {
//         reader.readAsText(file);
//       } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//         reader.readAsArrayBuffer(file);
//       } else {
//         reader.readAsText(file);
//       }
//     });
//   };

//   const handleTextChange = (e) => {
//     setTextContent(e.target.value);
//     setSelectedFile(null);
//     setError(null);
//   };

//   const analyzeContent = async () => {
//     if ((!textContent || textContent.trim().length < 500) && !selectedFile) {
//       setError("Veuillez saisir au moins 500 caractères ou importer un fichier");
//       return;
//     }

//     setIsAnalyzing(true);
//     setAnalysisResult(null);
//     setError(null);

//     try {
//       let contentToAnalyze = textContent;
//       if (selectedFile) {
//         contentToAnalyze = await readFileContent(selectedFile);
//       }

//       const sentences = extractKeySentences(contentToAnalyze);
//       const matches = [];
//       let totalSimilarity = 0;
//       let analyzedSentences = 0;

//       for (const sentence of sentences.slice(0, 10)) {
//         if (sentence.trim().length < 30) continue;
        
//         try {
//           const result = await searchWithSerper(sentence);
//           if (result.matches && result.matches.length > 0) {
//             matches.push(...result.matches);
//             totalSimilarity += result.similarity;
//             analyzedSentences++;
//           }
//         } catch (err) {
//           console.error(`Erreur lors de l'analyse de la phrase: "${sentence}"`, err);
//           continue;
//         }
//       }

//       const overallSimilarity = analyzedSentences > 0 
//         ? Math.min(100, Math.round(totalSimilarity / analyzedSentences))
//         : 0;

//       setAnalysisResult({
//         similarity: overallSimilarity,
//         uniqueness: 100 - overallSimilarity,
//         matches: matches.slice(0, 10),
//         analyzedText: contentToAnalyze,
//         source: selectedFile ? selectedFile.name : "Texte saisi"
//       });

//     } catch (err) {
//       setError("Erreur lors de l'analyse du contenu");
//       console.error(err);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const detectAI = async () => {
//   if (!textContent || textContent.trim().length < 100) {
//     setError("Veuillez saisir au moins 100 caractères");
//     return;
//   }

//   setIsAnalyzing(true);
//   setError(null);

//   try {
//     console.log("Texte envoyé à l'API:", textContent); // Ajouté
    
//     const response = await fetch("http://localhost:8000/api/detect-ai", {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({
//         text: textContent
//       })
//     });

//     console.log("Réponse brute:", response); // Ajouté

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || `Erreur ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("Résultat de l'API:", result); // Ajouté
    
//     setAiDetectionResult({
//       score: result.score,
//       isAI: result.is_plagiarized,
//       details: result.details,
//       error: result.error,
//       date: new Date().toLocaleString()
//     });

//   } catch (err) {
//     console.error("Erreur détection AI:", err);
//     setError(err.message || "Erreur lors de la détection AI");
//   } finally {
//     setIsAnalyzing(false);
//   }
// };

// //  const detectAI = async () => {
// //   if (!textContent || textContent.trim().length < 100) {
// //     setError("Veuillez saisir au moins 100 caractères");
// //     return;
// //   }

// //   setIsAnalyzing(true);
// //   setError(null);

// //   try {
// //     const response = await fetch("http://localhost:8000/api/detect-ai", {
// //       method: "POST",
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Accept': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         text: textContent
// //       })
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.detail || `Erreur ${response.status}`);
// //     }

// //     const result = await response.json();
    
// //     setAiDetectionResult({
// //       score: result.score,
// //       isAI: result.is_plagiarized,
// //       details: result.details,
// //       error: result.error,
// //       date: new Date().toLocaleString()
// //     });

// //   } catch (err) {
// //     console.error("Erreur détection AI:", err);
// //     setError(err.message || "Erreur lors de la détection AI");
// //   } finally {
// //     setIsAnalyzing(false);
// //   }
// // };
// // const detectAI = async () => {
// //   if (!textContent || textContent.trim().length < 100) {
// //     setError("Veuillez saisir au moins 100 caractères");
// //     return;
// //   }

// //   setIsAnalyzing(true);
// //   setError(null);

// //   try {
// //     const response = await fetch("http://localhost:8000/api/detect-ai", {
// //       method: "POST",
// //       headers: {
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         text: textContent
// //       })
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.error || `Erreur ${response.status}`);
// //     }

// //     const result = await response.json();
    
// //     setAiDetectionResult({
// //       score: result.score,
// //       isAI: result.is_plagiarized,
// //       details: result.details,
// //       error: result.error
// //     });

// //   } catch (err) {
// //     console.error("Erreur détection AI:", err);
// //     setError(err.message || "Erreur lors de la détection AI");
// //   } finally {
// //     setIsAnalyzing(false);
// //   }
// // };

//   const extractKeySentences = (text) => {
//     const cleanText = text.replace(/\s+/g, ' ').trim();
//     return cleanText.split(/[.!?]\s+/)
//       .filter(s => s.length > 50)
//       .map(s => s.trim());
//   };

//   const searchWithSerper = async (query) => {
//     try {
//       const cleanQuery = query.slice(0, 200).replace(/[^\w\s]/g, '');
//       if (cleanQuery.length < 15) return { matches: [], similarity: 0 };
      
//       const response = await fetch("https://google.serper.dev/search", {
//         method: "POST",
//         headers: {
//           "X-API-KEY": SERPER_API_KEY,
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify({
//           q: `"${cleanQuery}"`,
//           gl: "fr",
//           hl: "fr",
//           num: 5
//         })
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Erreur API: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       return processSerperResults(query, data);

//     } catch (err) {
//       console.error("Erreur Serper API:", err);
//       throw err;
//     }
//   };

//   const processSerperResults = (originalQuery, data) => {
//     const matches = [];
//     let maxSimilarity = 0;

//     if (data.organic && data.organic.length > 0) {
//       data.organic.forEach(item => {
//         const combinedText = `${item.title || ''} ${item.snippet || ''}`;
//         const similarity = calculateSimilarity(originalQuery, combinedText);
        
//         if (similarity > 20) {
//           matches.push({
//             source: item.title || "Source inconnue",
//             url: item.link || "#",
//             similarity: similarity,
//             type: similarity > 70 ? "Correspondance exacte" : "Paraphrase",
//             snippet: item.snippet || "Aucun extrait disponible"
//           });
//           maxSimilarity = Math.max(maxSimilarity, similarity);
//         }
//       });
//     }

//     return { matches, similarity: maxSimilarity };
//   };

//   const calculateSimilarity = (text1, text2) => {
//     const normalize = (text) => text.toLowerCase()
//       .replace(/[^\w\s]/g, '')
//       .replace(/\s+/g, ' ')
//       .trim();
    
//     const normalized1 = normalize(text1);
//     const normalized2 = normalize(text2);
    
//     const getNGrams = (text, n = 3) => {
//       const words = text.split(' ');
//       const grams = [];
//       for (let i = 0; i <= words.length - n; i++) {
//         grams.push(words.slice(i, i + n).join(' '));
//       }
//       return grams;
//     };
    
//     const grams1 = getNGrams(normalized1);
//     const grams2 = getNGrams(normalized2);
    
//     const commonGrams = grams1.filter(gram => grams2.includes(gram));
//     const similarity = (commonGrams.length / Math.max(1, grams1.length)) * 100;
    
//     return Math.round(similarity);
//   };

//   const downloadReport = () => {
//     if (!analysisResult) return;
    
//     let reportContent = `Rapport de plagiat\n\n`;
//     reportContent += `Source: ${analysisResult.source}\n`;
//     reportContent += `Date d'analyse: ${new Date().toLocaleDateString()}\n\n`;
//     reportContent += `Score de plagiat: ${analysisResult.similarity}%\n`;
//     reportContent += `Score d'unicité: ${analysisResult.uniqueness}%\n\n`;
//     reportContent += `Contenu analysé:\n${analysisResult.analyzedText}\n\n`;
//     reportContent += `Correspondances trouvées:\n`;
    
//     analysisResult.matches.forEach((match, index) => {
//       reportContent += `\n${index + 1}. ${match.type} (${match.similarity}%)\n`;
//       reportContent += `Source: ${match.source}\n`;
//       reportContent += `URL: ${match.url}\n`;
//       reportContent += `Extrait: ${match.snippet}\n`;
//     });
    
//     const blob = new Blob([reportContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `rapport-plagiat-${new Date().toISOString().slice(0, 10)}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const downloadAIReport = () => {
//     if (!aiDetectionResult) return;
    
//     let reportContent = `Rapport de détection AI\n\n`;
//     reportContent += `Date d'analyse: ${aiDetectionResult.date}\n\n`;
//     reportContent += `Score de probabilité AI: ${aiDetectionResult.score}%\n`;
//     reportContent += `Conclusion: ${aiDetectionResult.isAI ? "Texte généré par AI" : "Texte probablement humain"}\n\n`;
//     reportContent += `Contenu analysé:\n${aiDetectionResult.analyzedText}\n\n`;
//     reportContent += `Détails techniques:\n${JSON.stringify(aiDetectionResult.details, null, 2)}`;
    
//     const blob = new Blob([reportContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `rapport-ai-${new Date().toISOString().slice(0, 10)}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const ScoreCircle = ({ score, label, color }) => {
//     const radius = 40;
//     const circumference = 2 * Math.PI * radius;
//     const strokeDashoffset = circumference - (score / 100) * circumference;

//     return (
//       <div className="flex flex-col items-center mx-4">
//         <div className="relative w-32 h-32 flex items-center justify-center">
//           <svg className="w-full h-full" viewBox="0 0 100 100">
//             <circle
//               className="text-gray-200"
//               strokeWidth="8"
//               stroke="currentColor"
//               fill="transparent"
//               r={radius}
//               cx="50"
//               cy="50"
//             />
//             <circle
//               className={`text-${color}-500`}
//               strokeWidth="8"
//               strokeDasharray={circumference}
//               strokeDashoffset={strokeDashoffset}
//               strokeLinecap="round"
//               stroke="currentColor"
//               fill="transparent"
//               r={radius}
//               cx="50"
//               cy="50"
//               transform="rotate(-90 50 50)"
//             />
//           </svg>
//           <div className="absolute flex flex-col items-center">
//             <span className="text-3xl font-bold">{score}%</span>
//             <span className="text-sm text-gray-500">{label}</span>
//           </div>
//         </div>
//         <div className={`mt-2 flex items-center ${score > 70 ? 'text-red-500' : 'text-green-500'}`}>
//           {score > 70 ? (
//             <>
//               <FaTimes className="mr-1" />
//               <span>Risque élevé</span>
//             </>
//           ) : (
//             <>
//               <FaCheck className="mr-1" />
//               <span>Acceptable</span>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Navbar>
//       <Header />
//       <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
//         <div className="flex-1">
//           <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <section className="bg-white rounded-xl shadow-md p-8 mb-8">
//               <div className="flex border-b border-gray-200 mb-6">
//                 <button
//                   className={`py-2 px-4 font-medium ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                   onClick={() => setActiveTab('text')}
//                 >
//                   Saisir du texte
//                 </button>
//                 <button
//                   className={`py-2 px-4 font-medium ${activeTab === 'ai' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
//                   onClick={() => setActiveTab('ai')}
//                 >
//                   Détecter AI
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <textarea
//                   className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   placeholder={activeTab === 'text' 
//                     ? "Collez votre texte ici pour l'analyser (minimum 500 caractères)..." 
//                     : "Collez votre texte ici pour détecter s'il a été généré par une IA (minimum 500 caractères)..."}
//                   value={textContent}
//                   onChange={handleTextChange}
//                 />
//                 <p className="text-sm text-gray-500 mt-2">
//                   {textContent.length} caractères | Minimum recommandé: 500 caractères
//                 </p>
//               </div>

//               <div className="flex justify-center">
//                 <button 
//                   onClick={activeTab === 'text' ? analyzeContent : detectAI}
//                   disabled={isAnalyzing || !textContent || textContent.length < 500}
//                   className={`px-8 py-3 rounded-lg font-medium flex items-center ${
//                     isAnalyzing 
//                       ? 'bg-gray-400 cursor-not-allowed' 
//                       : !textContent || textContent.length < 500
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : activeTab === 'text'
//                           ? 'bg-green-600 hover:bg-green-700 text-white'
//                           : 'bg-purple-600 hover:bg-purple-700 text-white'
//                   }`}
//                 >
//                   {isAnalyzing ? (
//                     <>
//                       <FaSpinner className="animate-spin mr-2" />
//                       Analyse en cours...
//                     </>
//                   ) : (
//                     activeTab === 'text' ? 'Analyser le contenu' : 'Détecter AI'
//                   )}
//                 </button>
//               </div>
//               {error && (
//                 <div className="mt-4 text-center text-red-500">{error}</div>
//               )}
//             </section>

//             {analysisResult && activeTab === 'text' && (
//               <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//                 <div className="bg-blue-600 text-white px-8 py-5">
//                   <h2 className="text-2xl font-bold">Résultats de l'analyse</h2>
//                 </div>
//                 <div className="p-8">
//                   <div className="flex flex-wrap justify-center my-8">
//                     <ScoreCircle 
//                       score={analysisResult.similarity} 
//                       label="Plagiat" 
//                       color="red" 
//                     />
//                     <ScoreCircle 
//                       score={analysisResult.uniqueness} 
//                       label="Unicité" 
//                       color="green" 
//                     />
//                   </div>

//                   {analysisResult.similarity > 0 ? (
//                     <div className="space-y-6">
//                       <h3 className="text-lg font-medium text-gray-800">Correspondances détectées:</h3>
//                       {analysisResult.matches.map((match, index) => (
//                         <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
//                           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
//                             <div>
//                               <h4 className="font-medium text-gray-800">
//                                 {match.type} ({match.similarity}%)
//                               </h4>
//                               <p className="text-gray-500 text-sm">{match.source}</p>
//                               <a 
//                                 href={match.url} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="text-blue-500 text-sm hover:underline"
//                               >
//                                 {match.url}
//                               </a>
//                             </div>
//                             <span className={`${
//                               match.type.includes('exacte') 
//                                 ? 'bg-red-100 text-red-800' 
//                                 : 'bg-orange-100 text-orange-800'
//                             } px-3 py-1 rounded-full text-sm font-medium self-start`}>
//                               {match.type}
//                             </span>
//                           </div>
//                           {match.snippet && (
//                             <div className="bg-gray-50 p-4 rounded-lg mt-2 text-gray-700">
//                               {match.snippet}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <div className="bg-green-100 text-green-800 inline-block px-4 py-2 rounded-full mb-4">
//                         Aucun plagiat détecté
//                       </div>
//                       <p className="text-gray-600">Aucune correspondance significative n'a été trouvée avec des sources en ligne.</p>
//                     </div>
//                   )}

//                   <div className="flex justify-center mt-8">
//                     <button
//                       onClick={downloadReport}
//                       className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
//                     >
//                       <FaDownload className="mr-2" />
//                       Télécharger le rapport
//                     </button>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {aiDetectionResult && activeTab === 'ai' && (
//               <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//                 <div className="bg-purple-600 text-white px-8 py-5">
//                   <h2 className="text-2xl font-bold">Résultats de détection AI</h2>
//                 </div>
//                 <div className="p-8">
//                   <div className="flex flex-wrap justify-center my-8">
//                     <ScoreCircle 
//                       score={Math.round(aiDetectionResult.score)} 
//                       label="Probabilité AI" 
//                       color={aiDetectionResult.isAI ? "red" : "green"} 
//                     />
//                   </div>

//                   <div className="text-center mb-8">
//                     <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${
//                       aiDetectionResult.isAI 
//                         ? 'bg-red-100 text-red-800' 
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {aiDetectionResult.isAI ? (
//                         <>
//                           <FaRobot className="mr-2" />
//                           Ce texte semble généré par une IA (score: {Math.round(aiDetectionResult.score)}%)
//                         </>
//                       ) : (
//                         <>
//                           <FaCheck className="mr-2" />
//                           Ce texte semble écrit par un humain (score: {Math.round(aiDetectionResult.score)}%)
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-6 rounded-lg">
//                     <h3 className="text-lg font-medium text-gray-800 mb-4">Détails de l'analyse</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Score de probabilité AI:</span>
//                         <span className="font-medium">{Math.round(aiDetectionResult.score)}%</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Date d'analyse:</span>
//                         <span className="font-medium">{aiDetectionResult.date}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Conclusion:</span>
//                         <span className="font-medium">
//                           {aiDetectionResult.isAI ? "Probablement généré par AI" : "Probablement humain"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-center mt-8">
//                     <button
//                       onClick={downloadAIReport}
//                       className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center"
//                     >
//                       <FaDownload className="mr-2" />
//                       Télécharger le rapport
//                     </button>
//                   </div>
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
//       </div>
//     </Navbar>
//   );
// };

// export default PlagiarismPage;

import React, { useState } from "react";
import { FaShieldAlt, FaFileUpload, FaDownload, FaSpinner, FaCheck, FaTimes, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Header from "../components/Header";
import mammoth from "mammoth";

const SERPER_API_KEY = "1c1cb592b8d3aedafade5bfd0ca9d5d9f134648f";

const PlagiarismPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [aiDetectionResult, setAiDetectionResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("text");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    setSelectedFile(file);
    setError(null);

    try {
      const content = await readFileContent(file);
      setTextContent(content);
    } catch (err) {
      setError("Erreur lors de la lecture du fichier");
      console.error(err);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          if (file.type === "application/pdf") {
            resolve(event.target.result);
          } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
            resolve(result.value);
          } else {
            resolve(event.target.result);
          }
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };

      if (file.type === "application/pdf") {
        reader.readAsText(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleTextChange = (e) => {
    setTextContent(e.target.value);
    setSelectedFile(null);
    setError(null);
  };

  const analyzeContent = async () => {
    if ((!textContent || textContent.trim().length < 500) && !selectedFile) {
      setError("Veuillez saisir au moins 500 caractères ou importer un fichier");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      let contentToAnalyze = textContent;
      if (selectedFile) {
        contentToAnalyze = await readFileContent(selectedFile);
      }

      const sentences = extractKeySentences(contentToAnalyze);
      const matches = [];
      let totalSimilarity = 0;
      let analyzedSentences = 0;

      for (const sentence of sentences.slice(0, 10)) {
        if (sentence.trim().length < 30) continue;
        
        try {
          const result = await searchWithSerper(sentence);
          if (result.matches && result.matches.length > 0) {
            matches.push(...result.matches);
            totalSimilarity += result.similarity;
            analyzedSentences++;
          }
        } catch (err) {
          console.error(`Erreur lors de l'analyse de la phrase: "${sentence}"`, err);
          continue;
        }
      }

      const overallSimilarity = analyzedSentences > 0 
        ? Math.min(100, Math.round(totalSimilarity / analyzedSentences))
        : 0;

      setAnalysisResult({
        similarity: overallSimilarity,
        uniqueness: 100 - overallSimilarity,
        matches: matches.slice(0, 10),
        analyzedText: contentToAnalyze,
        source: selectedFile ? selectedFile.name : "Texte saisi"
      });

    } catch (err) {
      setError("Erreur lors de l'analyse du contenu");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };
const detectAI = async () => {
    if (!textContent || textContent.trim().length < 100) {
      setError("Veuillez saisir au moins 100 caractères");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/detect-ai", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: textContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erreur ${response.status}`);
      }

      const result = await response.json();
      
      setAiDetectionResult({
        score: result.score,
        humanScore: result.human_score,
        isAI: result.is_plagiarized,
        details: result.details,
        sources: result.sources || [],
        date: new Date().toLocaleString()
      });

    } catch (err) {
      console.error("Erreur détection AI:", err);
      setError(err.message || "Erreur lors de la détection AI");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // const detectAI = async () => {
  //   if (!textContent || textContent.trim().length < 100) {
  //     setError("Veuillez saisir au moins 100 caractères");
  //     return;
  //   }

  //   setIsAnalyzing(true);
  //   setError(null);

  //   try {
  //     const response = await fetch("http://localhost:8000/api/detect-ai", {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         text: textContent
  //       })
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.detail || `Erreur ${response.status}`);
  //     }

  //     const result = await response.json();
      
  //     setAiDetectionResult({
  //       score: result.score,
  //       humanScore: result.human_score,
  //       isAI: result.is_plagiarized,
  //       details: result.details,
  //       sources: result.sources || [],
  //       date: new Date().toLocaleString()
  //     });

  //   } catch (err) {
  //     console.error("Erreur détection AI:", err);
  //     setError(err.message || "Erreur lors de la détection AI");
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  const extractKeySentences = (text) => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    return cleanText.split(/[.!?]\s+/)
      .filter(s => s.length > 50)
      .map(s => s.trim());
  };

  const searchWithSerper = async (query) => {
    try {
      const cleanQuery = query.slice(0, 200).replace(/[^\w\s]/g, '');
      if (cleanQuery.length < 15) return { matches: [], similarity: 0 };
      
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          q: `"${cleanQuery}"`,
          gl: "fr",
          hl: "fr",
          num: 5
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return processSerperResults(query, data);

    } catch (err) {
      console.error("Erreur Serper API:", err);
      throw err;
    }
  };

  const processSerperResults = (originalQuery, data) => {
    const matches = [];
    let maxSimilarity = 0;

    if (data.organic && data.organic.length > 0) {
      data.organic.forEach(item => {
        const combinedText = `${item.title || ''} ${item.snippet || ''}`;
        const similarity = calculateSimilarity(originalQuery, combinedText);
        
        if (similarity > 20) {
          matches.push({
            source: item.title || "Source inconnue",
            url: item.link || "#",
            similarity: similarity,
            type: similarity > 70 ? "Correspondance exacte" : "Paraphrase",
            snippet: item.snippet || "Aucun extrait disponible"
          });
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }
      });
    }

    return { matches, similarity: maxSimilarity };
  };

  const calculateSimilarity = (text1, text2) => {
    const normalize = (text) => text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const normalized1 = normalize(text1);
    const normalized2 = normalize(text2);
    
    const getNGrams = (text, n = 3) => {
      const words = text.split(' ');
      const grams = [];
      for (let i = 0; i <= words.length - n; i++) {
        grams.push(words.slice(i, i + n).join(' '));
      }
      return grams;
    };
    
    const grams1 = getNGrams(normalized1);
    const grams2 = getNGrams(normalized2);
    
    const commonGrams = grams1.filter(gram => grams2.includes(gram));
    const similarity = (commonGrams.length / Math.max(1, grams1.length)) * 100;
    
    return Math.round(similarity);
  };

  const downloadReport = () => {
    if (!analysisResult) return;
    
    let reportContent = `Rapport de plagiat\n\n`;
    reportContent += `Source: ${analysisResult.source}\n`;
    reportContent += `Date d'analyse: ${new Date().toLocaleDateString()}\n\n`;
    reportContent += `Score de plagiat: ${analysisResult.similarity}%\n`;
    reportContent += `Score d'unicité: ${analysisResult.uniqueness}%\n\n`;
    reportContent += `Contenu analysé:\n${analysisResult.analyzedText}\n\n`;
    reportContent += `Correspondances trouvées:\n`;
    
    analysisResult.matches.forEach((match, index) => {
      reportContent += `\n${index + 1}. ${match.type} (${match.similarity}%)\n`;
      reportContent += `Source: ${match.source}\n`;
      reportContent += `URL: ${match.url}\n`;
      reportContent += `Extrait: ${match.snippet}\n`;
    });
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-plagiat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAIReport = () => {
    if (!aiDetectionResult) return;
    
    let reportContent = `Rapport de détection AI\n\n`;
    reportContent += `Date d'analyse: ${aiDetectionResult.date}\n\n`;
    reportContent += `Score de probabilité AI: ${aiDetectionResult.score}%\n`;
    reportContent += `Score humain: ${aiDetectionResult.humanScore}%\n`;
    reportContent += `Conclusion: ${aiDetectionResult.isAI ? "Texte généré par AI" : "Texte probablement humain"}\n\n`;
    reportContent += `Contenu analysé:\n${textContent}\n\n`;
    reportContent += `Détails techniques:\n${JSON.stringify(aiDetectionResult.details, null, 2)}\n\n`;
    
    if (aiDetectionResult.sources && aiDetectionResult.sources.length > 0) {
      reportContent += `Sources potentielles:\n`;
      aiDetectionResult.sources.forEach((source, index) => {
        reportContent += `\n${index + 1}. ${source.url || 'Source inconnue'}\n`;
        if (source.title) reportContent += `Titre: ${source.title}\n`;
        if (source.similarity) reportContent += `Similarité: ${source.similarity}%\n`;
      });
    }
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-ai-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ScoreCircle = ({ score, label, color }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center mx-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={`text-${color}-500`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold">{score}%</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        </div>
        <div className={`mt-2 flex items-center ${score > 70 ? 'text-red-500' : 'text-green-500'}`}>
          {score > 70 ? (
            <>
              <FaTimes className="mr-1" />
              <span>Risque élevé</span>
            </>
          ) : (
            <>
              <FaCheck className="mr-1" />
              <span>Acceptable</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Navbar>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex-1">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <section className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('text')}
                >
                  Détection de plagiat
                </button>
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'ai' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('ai')}
                >
                  Détection AI
                </button>
              </div>

              <div className="mb-6">
                <textarea
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={activeTab === 'text' 
                    ? "Collez votre texte ici pour détecter le plagiat (minimum 500 caractères)..." 
                    : "Collez votre texte ici pour détecter s'il a été généré par une IA (minimum 100 caractères)..."}
                  value={textContent}
                  onChange={handleTextChange}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {textContent.length} caractères | Minimum recommandé: {activeTab === 'text' ? '500' : '100'} caractères
                </p>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={activeTab === 'text' ? analyzeContent : detectAI}
                  disabled={isAnalyzing || !textContent || (activeTab === 'text' ? textContent.length < 500 : textContent.length < 100)}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                    isAnalyzing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : !textContent || (activeTab === 'text' ? textContent.length < 500 : textContent.length < 100)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : activeTab === 'text'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Analyse en cours...
                    </>
                  ) : (
                    activeTab === 'text' ? 'Détecter le plagiat' : 'Détecter AI'
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 text-center text-red-500">{error}</div>
              )}
            </section>

            {analysisResult && activeTab === 'text' && (
              <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="bg-blue-600 text-white px-8 py-5">
                  <h2 className="text-2xl font-bold">Résultats de détection de plagiat</h2>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap justify-center my-8">
                    <ScoreCircle 
                      score={analysisResult.similarity} 
                      label="Plagiat" 
                      color="red" 
                    />
                    <ScoreCircle 
                      score={analysisResult.uniqueness} 
                      label="Unicité" 
                      color="green" 
                    />
                  </div>

                  {analysisResult.similarity > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-800">Correspondances détectées:</h3>
                      {analysisResult.matches.map((match, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {match.type} ({match.similarity}%)
                              </h4>
                              <p className="text-gray-500 text-sm">{match.source}</p>
                              <a 
                                href={match.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 text-sm hover:underline"
                              >
                                {match.url}
                              </a>
                            </div>
                            <span className={`${
                              match.type.includes('exacte') 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-orange-100 text-orange-800'
                            } px-3 py-1 rounded-full text-sm font-medium self-start`}>
                              {match.type}
                            </span>
                          </div>
                          {match.snippet && (
                            <div className="bg-gray-50 p-4 rounded-lg mt-2 text-gray-700">
                              {match.snippet}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-green-100 text-green-800 inline-block px-4 py-2 rounded-full mb-4">
                        Aucun plagiat détecté
                      </div>
                      <p className="text-gray-600">Aucune correspondance significative n'a été trouvée avec des sources en ligne.</p>
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={downloadReport}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                    >
                      <FaDownload className="mr-2" />
                      Télécharger le rapport
                    </button>
                  </div>
                </div>
              </section>
            )}

            {aiDetectionResult && activeTab === 'ai' && (
              <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="bg-purple-600 text-white px-8 py-5">
                  <h2 className="text-2xl font-bold">Résultats de détection AI</h2>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap justify-center my-8">
                    <ScoreCircle 
                      score={Math.round(aiDetectionResult.score)} 
                      label="AI" 
                      color={aiDetectionResult.isAI ? "red" : "green"} 
                    />
                    <ScoreCircle 
                      score={Math.round(aiDetectionResult.humanScore)} 
                      label="Humaine" 
                      color={!aiDetectionResult.isAI ? "green" : "red"} 
                    />
                  </div>

                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${
                      aiDetectionResult.isAI 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {aiDetectionResult.isAI ? (
                        <>
                          <FaRobot className="mr-2" />
                          Ce texte semble généré par une IA (score: {Math.round(aiDetectionResult.score)}%)
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Ce texte semble écrit par un humain (score: {Math.round(aiDetectionResult.humanScore)}%)
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Détails de l'analyse</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score de probabilité AI:</span>
                        <span className="font-medium">{Math.round(aiDetectionResult.score)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score humain:</span>
                        <span className="font-medium">{Math.round(aiDetectionResult.humanScore)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date d'analyse:</span>
                        <span className="font-medium">{aiDetectionResult.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conclusion:</span>
                        <span className="font-medium">
                          {aiDetectionResult.isAI ? "Probablement généré par AI" : "Probablement humain"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {aiDetectionResult.sources && aiDetectionResult.sources.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Sources potentielles:</h3>
                      <div className="space-y-4">
                        {aiDetectionResult.sources.map((source, index) => (
                          <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:underline"
                                >
                                  {source.title || source.url || 'Source inconnue'}
                                </a>
                                {source.similarity && (
                                  <p className="text-sm text-gray-500">Similarité: {source.similarity}%</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={downloadAIReport}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center"
                    >
                      <FaDownload className="mr-2" />
                      Télécharger le rapport
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default PlagiarismPage;