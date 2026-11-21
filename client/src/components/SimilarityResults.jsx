import React from "react";
import { FaFileAlt, FaStar, FaUniversity, FaInfoCircle } from "react-icons/fa";

const StatCard = ({ icon, title, value, color, tooltip }) => (
  <div className={`${color} p-4 rounded-lg flex items-center relative group`}>
    <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full mr-3 md:mr-4">
      {icon}
    </div>
    <div>
      <div className="flex items-center">
        <p className="text-sm font-medium text-white opacity-90">{title}</p>
        {tooltip && (
          <div className="ml-2 relative">
            <FaInfoCircle className="text-white opacity-70 text-xs" />
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const SimilarityResults = ({ data }) => {
  const calculateAverageSimilarity = () => {
    if (!data.results || data.results.length === 0) return "0%";
    
    const totalSimilarity = data.results.reduce((acc, curr) => {
      return acc + (curr.similarity || 0);
    }, 0);
    
    const average = (totalSimilarity / data.results.length) * 100;
    return `${average.toFixed(1)}%`;
  };

  const uniqueSources = new Set(
    data.results?.map(r => {
      try {
        const url = new URL(r.url);
        return url.hostname;
      } catch {
        return "unknown";
      }
    })
  ).size;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Search Results</h2>
            <p className="opacity-90 text-sm md:text-base">
              {data.query ? `"${data.query}"` : "Image search"}
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-90">Results:</span>
              <span className="text-lg md:text-xl font-bold">
                {data.stats?.totalResults || data.results?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <StatCard
            icon={<FaFileAlt className="text-white text-lg md:text-xl" />}
            title="Results"
            value={data.stats?.totalResults || data.results?.length || 0}
            color="bg-purple-500"
            tooltip="Total number of matching results"
          />
          <StatCard
            icon={<FaStar className="text-white text-lg md:text-xl" />}
            title="Avg Similarity"
            value={calculateAverageSimilarity()}
            color="bg-indigo-500"
            tooltip="Average similarity score across all results"
          />
          <StatCard
            icon={<FaUniversity className="text-white text-lg md:text-xl" />}
            title="Sources"
            value={uniqueSources}
            color="bg-blue-500"
            tooltip="Number of unique sources"
          />
        </div>
      </div>
    </div>
  );
};

export default SimilarityResults;