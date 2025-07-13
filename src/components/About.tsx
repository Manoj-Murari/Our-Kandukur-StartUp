import React from 'react';
import { Users, Building2, Trophy, Quote, Star, Loader2, AlertCircle } from 'lucide-react';
import { useTestimonials } from '../hooks/useTestimonials'; // Import the hook to get live data

const About: React.FC = () => {
  const { testimonials, loading, error } = useTestimonials(); // Use the hook

  const stats = [
    { number: '2000+', label: 'Students Empowered', icon: Users },
    { number: '500+', label: 'Opportunities Created', icon: Trophy },
    { number: '150+', label: 'Partner Companies', icon: Building2 },
    { number: '50+', label: 'Expert Mentors', icon: Users }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Our Community Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg mr-4">
              <img 
                src="/LOGO_KDKR.png" 
                alt="OUR KANDUKUR Community Logo" 
                className="w-16 h-16 rounded-lg object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">About Our Community</h2>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              OUR KANDUKUR is a vibrant startup community that serves as a bridge between students and the industry. 
              We provide comprehensive support through internships, workshops, hackathons, tech seminars, webinars, 
              and job opportunities to help students build successful careers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Based in Kandukur, Prakasam District, Andhra Pradesh, we have successfully created a network 
              of opportunities that connects talented students with leading companies and organizations across India.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our successful community members who have transformed their careers through OUR KANDUKUR
            </p>
          </div>
          
          {/* Handle Loading and Error states */}
          {loading && <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>}
          {error && <div className="text-red-500 text-center"><AlertCircle className="inline mr-2"/>{error}</div>}
          
          {/* Render testimonials only when not loading, no errors, and data exists */}
          {!loading && !error && testimonials.length > 0 && (
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll space-x-6 w-max">
                {/* Render testimonials twice for a seamless loop */}
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={`${testimonial.id}-${index}`} className="bg-white rounded-xl p-6 shadow-lg w-80 flex-shrink-0">
                    <div className="flex items-center mb-4">
                      <img src={testimonial.image || `https://ui-avatars.com/api/?name=${testimonial.name}&background=random`} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4"/>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-blue-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />))}
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                      <p className="text-gray-600 italic pl-6">{testimonial.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;