import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import MatchCard from './MatchCard';
import { fetchMatches } from '../../services/matchService';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (error) {
        console.error("Failed to load matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const filteredMatches = matches.filter(match =>
    match.team1?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.team2?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Cricket Fixtures
          </h1>
          <p className="mt-2 text-gray-600">Live scores and upcoming matches</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-grow max-w-md">
            {/* Search input */}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg text-sm font-medium">
              All Matches
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
              Create Match
            </button>
          </div>
        </div>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...filteredMatches, ...filteredMatches, ...filteredMatches].map(match => (
          <MatchCard key={`${match.id}-${Math.random()}`} match={match} />
        ))}
      </div>

      {/* Empty state */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <img src="/empty-fixtures.svg" alt="No matches" className="mx-auto h-40" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No matches scheduled</h3>
          <button className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Schedule New Match
          </button>
        </div>
      )}
    </div>
  );
};

export default Matches;
