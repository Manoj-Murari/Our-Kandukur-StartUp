import React from 'react';
import { Linkedin, Loader2, AlertCircle } from 'lucide-react';
import { useTeamMembers, TeamMember } from '../hooks/useTeamMembers';

const Team: React.FC = () => {
  const { teamMembers, loading, error } = useTeamMembers();

  // Group team members by their role
  const groupedMembers = teamMembers.reduce((acc, member) => {
    const role = member.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Define the order of roles to display
  const roleOrder = [
    'Founder',
    'Technical Support Team',
    'Content Creator Team',
    'Broadcasting Team',
    'Mentor',
    'Social Media Marketing Team'
  ];

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">Meet Our Team</h2>
          <p className="mt-4 text-xl text-gray-600">
            The passionate individuals dedicated to empowering our community.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
            <AlertCircle className="mx-auto h-8 w-8" />
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* This block handles the main display */}
        {!loading && !error && (
          <>
            {/* FIXED: Add a check for when there are no members */}
            {teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Our team is growing! Check back soon to meet our members.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {roleOrder.map(role => (
                  groupedMembers[role] && (
                    <div key={role}>
                      <h3 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
                        {role}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {groupedMembers[role].map((member) => (
                          <div key={member.id} className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <img
                              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-gray-200"
                              src={member.imageUrl}
                              alt={member.name}
                              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name}&background=random` }}
                            />
                            <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
                            <a
                              href={member.socialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors mt-2 inline-block"
                              aria-label={`LinkedIn profile of ${member.name}`}
                            >
                              <Linkedin className="h-6 w-6" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Team;
