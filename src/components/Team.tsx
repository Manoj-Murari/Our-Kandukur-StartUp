import React from 'react';
import { Mail, Linkedin, MapPin, Instagram, FileText, Users, Loader2, AlertCircle } from 'lucide-react';
import { useTeamMembers } from '../hooks/useTeamMembers';

const Team: React.FC = () => {
  const { teamMembers, loading, error } = useTeamMembers();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated team members of OUR KANDUKUR community who are committed to empowering students and creating opportunities.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading team members...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">Error loading team members: {error}</span>
            </div>
          </div>
        )}

        {/* Team Members */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 card-3d slide-in-up">
              <div className="text-center mb-6">
                <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 float-animation pulse-glow">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold">{member.role}</p>
              </div>
              
              {/* Contact Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  {member.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                    {member.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="h-4 w-4 mr-3 text-gray-400">📞</span>
                  <a href={`tel:${member.phone}`} className="hover:text-blue-600 transition-colors">
                    {member.phone}
                  </a>
                </div>
              </div>

              {/* Social Media & Resume */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-3">
                  <a
                    href={member.linkedin}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.instagram}
                    className="text-gray-400 hover:text-pink-600 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  {member.resume_url && (
                    <a
                      href={member.resume_url}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Download Resume"
                    >
                      <FileText className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Join Our Team CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Team</h2>
            <p className="text-xl mb-6">
              Want to be part of OUR KANDUKUR community? We're always looking for passionate individuals to join our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join Our Team
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;