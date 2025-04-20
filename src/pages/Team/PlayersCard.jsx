import React from "react";
import { formatLabel } from '../../utils/format';
import { UsersIcon } from "@heroicons/react/24/outline";

const PlayersCard = ({ team }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
        <UsersIcon className="h-6 w-6 mr-2 text-indigo-600" />
        Team Players ({team.players?.length || 0})
      </h2>

      {team.players && team.players.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {team.players.map(player => {
            // Select icon for role
            let roleIcon = "🧍";
            if (player.role?.toLowerCase() === "batsman") roleIcon = "🏏";
            else if (player.role?.toLowerCase() === "bowler") roleIcon = "⚾️";
            else if (player.role?.toLowerCase() === "all rounder") roleIcon = "🔁";

            return (
              <div
                key={player.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col border"
              >
                {/* Image Section */}
                <div className="h-32 w-full bg-gray-100 rounded-md overflow-hidden mb-4">
                  <img
                    src={player.image_url ? player.image_url : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                    alt={player.first_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name & Role */}
                <div className="text-center flex justify-center mb-1">
                  <h3 className="text-md font-semibold text-gray-900">
                    {player.first_name} {player.last_name}
                  </h3>
                  <div className="text-lg ml-2">{roleIcon}</div>
                </div>

                {/* Batting & Bowling Info */}
                {/* <div className="text-xs text-gray-600 justify-center items-center gap-4 mt-auto">
                  <span className="flex items-center gap-1">
                    🏏 <span>{formatLabel(player.batting_style) || '–'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    ⚾️ <span>{formatLabel(player.bowling_style) || '–'}</span>
                  </span>
                </div> */}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
          <span className="text-3xl">🧍</span>
          <p className="mt-3 text-sm text-gray-600">No players found in this team</p>
        </div>
      )}
    </div>
  );
};

export default PlayersCard;
