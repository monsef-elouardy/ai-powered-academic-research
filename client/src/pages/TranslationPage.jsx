import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Header from "../components/Header";
import { FaCopy, FaMicrophone, FaExchangeAlt, FaVolumeUp } from "react-icons/fa";

// const LANGUAGES = [
//   { code: "fr", name: "Français", rtl: false, script: "latin" },
//   { code: "en", name: "Anglais", rtl: false, script: "latin" },
//   { code: "ar", name: "Arabe", rtl: true, script: "arabic" },
//   { code: "es", name: "Espagnol", rtl: false, script: "latin" },
//   { code: "de", name: "Allemand", rtl: false, script: "latin" },
//   { code: "ber", name: "Amazigh", rtl: false, script: "tifinagh" },
// ];

const LANGUAGES = [
  { code: "fr", name: "Français", rtl: false, script: "latin" },
  { code: "en", name: "Anglais", rtl: false, script: "latin" },
  { code: "ar", name: "Arabe", rtl: true, script: "arabic" },
  { code: "es", name: "Espagnol", rtl: false, script: "latin" },
  { code: "de", name: "Allemand", rtl: false, script: "latin" },
  { code: "ber", name: "Amazigh Maroc", rtl: false, script: "tifinagh" }, // Changement ici
];

const TIFINAGH_MAP = {
  'a': 'ⴰ', 'b': 'ⴱ', 'c': 'ⵛ', 'd': 'ⴷ', 'e': 'ⴻ',
  'f': 'ⴼ', 'g': 'ⴳ', 'h': 'ⵀ', 'i': 'ⵉ', 'j': 'ⵊ',
  'k': 'ⴽ', 'l': 'ⵍ', 'm': 'ⵎ', 'n': 'ⵏ', 'o': 'ⵓ',
  'p': 'ⵄ', 'q': 'ⵈ', 'r': 'ⵔ', 's': 'ⵙ', 't': 'ⵜ',
  'u': 'ⵓ', 'v': 'ⵖ', 'w': 'ⵡ', 'x': 'ⵅ', 'y': 'ⵢ',
  'z': 'ⵣ'
};

const PLACEHOLDERS = {
  fr: "Entrez votre texte ici...",
  en: "Enter your text here...",
  ar: "أدخل النص هنا...",
  es: "Ingrese su texto aquí...",
  de: "Geben Sie Ihren Text hier ein...",
  ber: "Aru tttext annid..."
};

export default function TranslationPage() {
  const [fromLang, setFromLang] = useState("fr");
  const [toLang, setToLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechRef = useRef(null);
  const debounceTimer = useRef(null);

  const convertToTifinagh = (text) => {
    if (toLang !== "ber") return text;
    return text.split('').map(char => {
      const lowerChar = char.toLowerCase();
      return TIFINAGH_MAP[lowerChar] || char;
    }).join('');
  };

  const isRtl = (langCode) => {
    const lang = LANGUAGES.find(l => l.code === langCode);
    return lang ? lang.rtl : false;
  };

  const getScript = (langCode) => {
    const lang = LANGUAGES.find(l => l.code === langCode);
    return lang ? lang.script : "latin";
  };

  useEffect(() => {
    if (sourceText.trim() === "") {
      setTranslatedText("");
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      translateText(sourceText);
    }, 4000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [sourceText, fromLang, toLang]);

  const translateText = async (text) => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/translate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          text: text,
          source_lang: fromLang,
          target_lang: toLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = fromLang;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSourceText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        setError("Erreur de reconnaissance vocale: " + event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [fromLang]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
    }
  }, []);

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Reconnaissance vocale non supportée");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = fromLang;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
          const originalHtml = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span class="text-green-500">✓</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalHtml;
          }, 2000);
        }
      })
      .catch(err => {
        setError("Échec de la copie");
        console.error("Erreur de copie:", err);
      });
  };

  const speakText = (text, lang) => {
    if (!text) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      speechRef.current.speak(utterance);
    } else {
      setError("Synthèse vocale non supportée par votre navigateur");
    }
  };

  return (
    <Navbar>
      <Header />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow">
              <div className="flex-1">
                <select
                  value={fromLang}
                  onChange={(e) => setFromLang(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={`from-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapLanguages}
                disabled={loading}
                className="mx-4 p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                aria-label="Échanger les langues"
              >
                <FaExchangeAlt className="h-5 w-5 text-blue-600" />
              </button>

              <div className="flex-1">
                <select
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={`to-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className={`w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    isRtl(fromLang) ? 'text-right' : 'text-left'
                  }`}
                  style={{ 
                    direction: isRtl(fromLang) ? 'rtl' : 'ltr',
                    fontFamily: getScript(fromLang) === "arabic" ? "'Noto Sans Arabic', sans-serif" : 
                               getScript(fromLang) === "tifinagh" ? "'Noto Sans Tifinagh', sans-serif" : "inherit"
                  }}
                  placeholder={PLACEHOLDERS[fromLang]}
                />
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <button
                    onClick={toggleSpeechRecognition}
                    disabled={loading}
                    className={`p-2 rounded-full ${
                      isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                    } text-white hover:opacity-80 transition-opacity`}
                    title="Dictée vocale"
                  >
                    <FaMicrophone className="h-5 w-5" />
                  </button>
                  {sourceText && (
                    <button
                      onClick={() => speakText(sourceText, fromLang)}
                      className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                      title="Lire le texte source"
                    >
                      <FaVolumeUp className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 relative">
                <div className={`w-full h-64 p-4 border rounded-lg shadow-sm overflow-auto ${
                  loading ? "bg-gray-100" : "bg-white"
                } border-gray-300 ${isRtl(toLang) ? 'text-right' : 'text-left'}`}
                style={{ 
                  direction: isRtl(toLang) ? 'rtl' : 'ltr',
                  fontFamily: getScript(toLang) === "arabic" ? "'Noto Sans Arabic', sans-serif" : 
                             getScript(toLang) === "tifinagh" ? "'Noto Sans Tifinagh', sans-serif" : "inherit"
                }}>
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : translatedText ? (
                    <div className="space-y-4">
                      {toLang === "ber" && (
                        <>
                          <p className="whitespace-pre-wrap text-2xl" style={{fontFamily: "'Noto Sans Tifinagh', sans-serif"}}>
                            {convertToTifinagh(translatedText)}
                          </p>
                          <div className="pt-4 mt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Version latine:</p>
                            <p className="whitespace-pre-wrap">{translatedText}</p>
                          </div>
                        </>
                      )}
                      {toLang !== "ber" && (
                        <p className="whitespace-pre-wrap">{translatedText}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400"></p>
                  )}
                </div>
                {translatedText && (
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button
                      id="copy-btn"
                      onClick={copyToClipboard}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Copier le texte"
                    >
                      <FaCopy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => speakText(translatedText, toLang)}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Lire la traduction"
                    >
                      <FaVolumeUp className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">Erreur</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
}