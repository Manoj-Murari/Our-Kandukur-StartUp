import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save } from 'lucide-react';

const PostOpportunityForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    category: 'jobs',
    status: 'open',
    stipend: 'Not Disclosed',
    deadline: '',
    link: '',
    description: '',
    requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const requirementsArray = formData.requirements.split(',').map(req => req.trim()).filter(Boolean);

    try {
      await addDoc(collection(db, "opportunities"), {
        ...formData,
        requirements: requirementsArray,
        createdAt: serverTimestamp()
      });
      setMessage('✅ Success! Opportunity has been posted.');
      // Reset form
      setFormData({
        title: '', company: '', location: 'Remote', category: 'jobs', status: 'open',
        stipend: 'Not Disclosed', deadline: '', link: '', description: '', requirements: '',
      });
    } catch (error) {
      console.error("Error adding opportunity: ", error);
      setMessage('❌ Error! Could not post opportunity.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Post a New Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group full-width mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" id="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label><input type="text" id="company" value={formData.company} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" id="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label><select id="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"><option value="jobs">Job</option><option value="internships">Internship</option><option value="workshops">Workshop</option><option value="hackathons">Hackathon</option><option value="seminars">Seminar</option><option value="webinars">Webinar</option></select></div>
            <div><label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label><select id="status" value={formData.status} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"><option value="open">Open</option><option value="closed">Closed</option></select></div>
            <div><label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">Stipend / Salary</label><input type="text" id="stipend" value={formData.stipend} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label><input type="date" id="deadline" value={formData.deadline} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
        </div>
        <div className="mb-4"><label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Registration/Apply Link</label><input type="url" id="link" value={formData.link} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
        <div className="mb-4"><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea id="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" rows={4}></textarea></div>
        <div className="mb-4"><label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label><input type="text" id="requirements" value={formData.requirements} onChange={handleChange} placeholder="e.g. React, Node.js, Python" className="w-full p-2 border border-gray-300 rounded-md"/></div>
        
        <div className="flex items-center justify-end">
            {message && <p className="text-sm text-gray-600 mr-4">{message}</p>}
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="h-5 w-5 mr-2" />}
                {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default PostOpportunityForm;
