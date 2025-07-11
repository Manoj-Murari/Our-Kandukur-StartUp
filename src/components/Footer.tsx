import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useVisitorCount } from '../hooks/useVisitorCount';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const visitorCount = useVisitorCount();

  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Opportunities', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const services = [
    { name: 'Internships', href: '#' },
    { name: 'Job Placements', href: '#' },
    { name: 'Workshops', href: '#' },
    { name: 'Hackathons', href: '#' },
    { name: 'Seminars', href: '#' },
    { name: 'Webinars', href: '#' },
  ];

  const resources = [
    { name: 'Student Guide', href: '#' },
    { name: 'Company Portal', href: '#' },
    { name: 'Mentor Program', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white">OUR KANDUKUR</h3>
              <p className="text-gray-400">Startup Community</p>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering students through comprehensive support in building Intellectual, 
              Financial, and Social Capital for a successful career.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">info@ourkandukur.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Kandukur, Andhra Pradesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Opportunities</h4>
            <ul className="space-y-2">
              {services.map((opportunity) => (
                <li key={opportunity.name}>
                  <a
                    href={opportunity.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {opportunity.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a
                    href={resource.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} OUR KANDUKUR. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Visitors: {visitorCount.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Empowering students • Building futures • Creating opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;