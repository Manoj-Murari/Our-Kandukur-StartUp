import React from 'react';
import { Users, Building2, MapPin, Trophy, Calendar, Quote, Star } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '2000+', label: 'Students Empowered', icon: Users },
    { number: '500+', label: 'Opportunities Created', icon: Trophy },
    { number: '150+', label: 'Partner Companies', icon: Building2 },
    { number: '50+', label: 'Expert Mentors', icon: Users }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Software Engineer at TCS",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "OUR KANDUKUR helped me land my dream job at TCS. The workshops and mentorship program were incredibly valuable in building my technical skills.",
      rating: 5
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Data Analyst at Infosys",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The internship opportunities provided by this community opened doors I never thought possible. Forever grateful for the support and guidance.",
      rating: 5
    },
    {
      id: 3,
      name: "Sneha Reddy",
      role: "UI/UX Designer at Wipro",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "From hackathons to job placements, OUR KANDUKUR has been instrumental in shaping my career. The community support is unmatched.",
      rating: 5
    },
    {
      id: 4,
      name: "Arjun Patel",
      role: "Full Stack Developer at Accenture",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The tech seminars and webinars kept me updated with industry trends. Thanks to OUR KANDUKUR, I'm now working at my dream company.",
      rating: 5
    },
    {
      id: 5,
      name: "Kavya Nair",
      role: "Business Analyst at HCL",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The mentorship and networking opportunities provided by this community are exceptional. It's more than just job placement - it's career transformation.",
      rating: 5
    },
    {
      id: 6,
      name: "Vikram Singh",
      role: "DevOps Engineer at IBM",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "OUR KANDUKUR doesn't just find you opportunities - they prepare you for success. The comprehensive support system is what sets them apart.",
      rating: 5
    }
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Our Community Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg mr-4 float-animation card-3d">
              <img 
                src="/LOGO_KDKR.png" 
                alt="OUR KANDUKUR Community Logo" 
                className="w-16 h-16 rounded-lg object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 bounce-in">About Our Community</h2>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              OUR KANDUKUR is a vibrant startup community that serves as a bridge between students and the industry. 
              We provide comprehensive support through internships, workshops, hackathons, tech seminars, webinars, 
              and job opportunities to help students build successful careers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our community is built on the foundation of empowering students through three core areas: 
              Intellectual Capital, Financial Capital, and Social Capital. We believe in creating an ecosystem 
              where students can learn, grow, and thrive in their chosen fields.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Based in Kandukur, Prakasam District, Andhra Pradesh, we have successfully created a network 
              of opportunities that connects talented students with leading companies and organizations across India.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-8 mb-16 perspective-container">
          {stats.map((stat, index) => (
            <div key={index} className="text-center slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all card-3d pulse-glow">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 float-animation">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Info */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-16 card-3d gradient-shift glass-effect">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3 bounce-in">
              <MapPin className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Location</h3>
                <p>Kandukur, Prakasam District, AP</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Established</h3>
                <p>2023</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Community</h3>
                <p>2000+ Active Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our successful community members who have transformed their careers through OUR KANDUKUR
            </p>
          </div>

          {/* Scrolling Testimonials */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6 w-max">
              {/* First set of testimonials */}
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-80 flex-shrink-0 card-3d">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-blue-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                    <p className="text-gray-600 italic pl-6">{testimonial.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Duplicate set for seamless scrolling */}
              {testimonials.map((testimonial) => (
                <div key={`duplicate-${testimonial.id}`} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-80 flex-shrink-0 card-3d">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-blue-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                    <p className="text-gray-600 italic pl-6">{testimonial.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;