import React from 'react';
import { Linkedin, Loader2, AlertCircle, MapPin, Mail, Twitter, Github } from 'lucide-react';
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
        "Founder", "Mentors", "Research & Development Team", "Event Management Team",
        "Social Media Marketing Team", "GFX / VFX Team", "Content Writing Team", "General Core Team"
    ];

    return (
        <section id="team" className="py-20 bg-gray-50">
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
                                    <div className="relative mb-12">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-gray-50 px-4 text-2xl font-semibold text-gray-700 rounded-md">{role}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                                        {groupedMembers[role].map((member) => (
                                            // UPDATED: Added a continuous ring effect that intensifies on hover.
                                            <div key={member.id} className="bg-white rounded-lg p-6 flex flex-col text-center transition-all duration-300 max-w-xs w-full shadow-lg shadow-blue-500/10 ring-1 ring-blue-300/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:ring-2 hover:ring-blue-400">
                                                <img
                                                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-blue-200"
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name.replace(/\s/g, '+')}&background=random&color=fff&size=128` }}
                                                />
                                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                                <p className="text-blue-600 font-semibold mb-3">{member.title}</p>
                                                
                                                <p className="text-gray-600 text-sm mb-4 flex-grow">{member.bio}</p>

                                                <div className="space-y-2 text-sm text-left mb-4 border-t pt-4">
                                                    <div className="flex items-center text-gray-500">
                                                        <MapPin className="h-4 w-4 mr-2 shrink-0" />
                                                        <span>{member.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-500">
                                                        <Mail className="h-4 w-4 mr-2 shrink-0" />
                                                        <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">{member.email}</a>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center space-x-4">
                                                    {member.linkedinUrl && (
                                                        <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700"><Linkedin /></a>
                                                    )}
                                                    {member.twitterUrl && (
                                                        <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500"><Twitter /></a>
                                                    )}
                                                    {member.githubUrl && (
                                                        <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900"><Github /></a>
                                                    )}
                                                </div>
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
