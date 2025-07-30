import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Building, Eye, Edit3, Trash2 } from 'lucide-react';

const ExperienceCard = ({ experience, onDelete }) => {
  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case 'selected':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {experience.companyName}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(experience.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Building className="h-4 w-4 mr-1" />
            <span>{experience.rounds} rounds</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResultColor(experience.result)}`}>
          {experience.result || 'Pending'}
        </span>
      </div>

      {experience.domains && experience.domains.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {experience.domains.slice(0, 3).map((domain, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
              >
                {domain}
              </span>
            ))}
            {experience.domains.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{experience.domains.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link
          to={`/experience/${experience._id || experience.id}`}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Link>
        
        <div className="flex space-x-2">
          <Link
            to={`/edit-experience/${experience._id || experience.id}`}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(experience._id || experience.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;