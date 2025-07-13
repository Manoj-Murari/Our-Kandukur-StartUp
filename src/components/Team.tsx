import React from 'react';
import { Linkedin, Loader2, AlertCircle } from 'lucide-react';
import { useTeamMembers, TeamMember } from '../hooks/useTeamMembers';

const Team: React.FC = () => {
  const { teamMembers, loading, error } = useTeamMembers();

  const groupedMembers = teamMembers.reduce((acc, member) => {
    const role = member.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const roleOrder = [
    'Founder',
    'Technical Support Team',
    'Content Creator Team',
    'Broadcasting Team',
    'Mentor',
    'Social Media Marketing Team'
  ];

  return (
    <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Meet Our Team</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals dedicated to empowering our community.
          </p>
        </div>

        {loading && <div className="flex justify-center items-center py-12"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>}
        {error && <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg"><AlertCircle className="mx-auto h-8 w-8" /><p className="mt-2">{error}</p></div>}

        {!loading && !error && (
          <div className="space-y-20">
            {roleOrder.map(role => (
              groupedMembers[role] && (
                <div key={role}>
                  {/* New Role Title Design */}
                  <div className="relative mb-12">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                          <span className="bg-blue-50 px-4 text-2xl font-semibold text-gray-700 rounded-md">{role}</span>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {groupedMembers[role].map((member) => (
                      <div key={member.id} className="group relative text-center">
                        {/* New Circular Image Card with Hover Effect */}
                        <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <img
                            className="w-full h-full object-cover"
                            src={member.imageUrl}
                            alt={member.name}
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name.replace(/\s/g, '+')}&background=random&color=fff&size=160` }}
                          />
                           <a
                            href={member.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300"
                            aria-label={`LinkedIn profile of ${member.name}`}
                          >
                            <Linkedin className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300" />
                          </a>
                        </div>
                        <h4 className="mt-4 text-xl font-bold text-gray-900">{member.name}</h4>
                        <p className="text-blue-600 font-medium">{role === 'Founder' ? 'Founder' : 'Team Member'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
