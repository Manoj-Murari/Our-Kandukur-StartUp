import React from 'react';
import { useJobSeekers } from '../hooks/useJobSeekers';
import { Loader2, AlertCircle, Mail, MapPin, BookOpen } from 'lucide-react';

const ViewJobSeekers: React.FC = () => {
  const { jobSeekers, loading, error, refetch } = useJobSeekers();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
        <AlertCircle className="mx-auto h-8 w-8" />
        <p className="mt-2">{error}</p>
        <button onClick={refetch} className="mt-4 text-sm font-semibold text-red-700 underline">Try Again</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse Job Seekers</h2>
      {jobSeekers.length === 0 ? (
        <p className="text-gray-500">No job seekers have registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobSeekers.map(profile => (
            <div key={profile.uid} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
              <img
                src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                alt={profile.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                referrerPolicy="no-referrer"
              />
              <h3 className="font-bold text-lg text-gray-900">{profile.name}</h3>
              <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline flex items-center justify-center mt-1">
                <Mail className="h-4 w-4 mr-1"/> Contact
              </a>
              <div className="text-left mt-4 space-y-2 text-sm text-gray-600">
                {profile.location && <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0"/> {profile.location}</p>}
                {profile.academics && <p className="flex items-start"><BookOpen className="h-4 w-4 mr-2 mt-1 flex-shrink-0"/> {profile.academics}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewJobSeekers;
