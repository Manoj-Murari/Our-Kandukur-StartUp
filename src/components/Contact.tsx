import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from 'lucide-react';
// FIXED: Import the useAuth hook to get user and sign-in function
import { useAuth } from '../contexts/AuthContext';

const Contact: React.FC = () => {
  // FIXED: Get user and signIn function from the auth context
  const { user, signIn } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      const truncatedValue = numericValue.slice(0, 10);
      setFormData({ ...formData, [name]: truncatedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFeedbackMessage('Please fill out all required fields.');
      return;
    }
    setIsSubmitting(true);
    setFeedbackMessage('');

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setFeedbackMessage('✅ Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', phone: '', category: 'General Inquiry', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setFeedbackMessage('❌ Sorry, there was an error sending your message.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedbackMessage(''), 5000);
    }
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'info@ourkandukur.com', link: 'mailto:info@ourkandukur.com' },
    { icon: Phone, title: 'Phone', value: '+91 9876543210', link: 'tel:+919876543210' },
    { icon: MapPin, title: 'Address', value: 'Kandukur, Prakasam District, Andhra Pradesh, India', link: '#' }
  ];

  // FIXED: Function to handle Join/Partner clicks
  const handleJoinClick = () => {
    if (user) {
        alert("You are already signed in!");
    } else {
        signIn();
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or want to partner with us? We'd love to hear from you. Reach out and let's build something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{info.title}</h3>
                      <a href={info.link} className="text-gray-600 hover:text-blue-600 transition-colors">{info.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your full name"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your email address"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your phone number"/>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Student Support">Student Support</option>
                  <option value="Company Partnership">Company Partnership</option>
                  <option value="Mentor Application">Mentor Application</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your message"/>
              </div>
              <div className="flex justify-end items-center">
                {feedbackMessage && <p className="text-sm mr-4">{feedbackMessage}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-gray-400">
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <MessageCircle className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-xl mb-6">
              Connect with us today and take the first step towards building your future. Whether you're a student, company, or mentor, we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* FIXED: Added onClick handler */}
              <button onClick={handleJoinClick} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join as Student
              </button>
              {/* FIXED: Added onClick handler */}
              <button onClick={handleJoinClick} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
