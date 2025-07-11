import React from 'react';
import { Brain, DollarSign, Users, ChevronRight } from 'lucide-react';

interface HeroProps {
  setCurrentSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setCurrentSection }) => {
  const pillars = [
    {
      icon: Brain,
      title: 'Intellectual Capital',
      description: 'Building knowledge and skills through workshops, seminars, and hands-on learning experiences.',
      color: 'bg-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Financial Capital',
      description: 'Creating pathways to financial growth through internships, jobs, and entrepreneurship opportunities.',
      color: 'bg-green-600'
    },
    {
      icon: Users,
      title: 'Social Capital',
      description: 'Fostering connections and building networks that last a lifetime through community engagement.',
      color: 'bg-purple-600'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white gradient-shift overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 slide-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 float-animation">
            Welcome to <span className="text-yellow-400 unique-3d-text">OUR KANDUKUR</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto bounce-in">
            Empowering students through comprehensive support in internships, workshops, hackathons, 
            tech seminars, webinars, and job opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentSection('opportunities')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold btn-3d neon-glow flex items-center justify-center gap-2"
            >
              Explore Opportunities
              <ChevronRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 rounded-lg font-semibold btn-3d glass-effect">
              Learn More
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 perspective-container">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 card-3d glass-effect pulse-glow"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`${pillar.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 float-animation`}>
                <pillar.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
              <p className="text-blue-200 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;