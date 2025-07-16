import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Star } from 'lucide-react';

const PostOpportunityForm: React.FC = () => {
    // UPDATED: Added new fields to the initial state
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
        // NEW FIELDS
        workLocation: 'On-site',
        stipendValue: 0,
        isFeatured: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        // Handle checkbox type separately
        const isCheckbox = type === 'checkbox';
        const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({ ...prev, [id]: inputValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const requirementsArray = formData.requirements.split(',').map(req => req.trim()).filter(Boolean);

        try {
            // Prepare data for submission, ensuring stipendValue is a number
            const dataToSubmit = {
                ...formData,
                requirements: requirementsArray,
                stipendValue: Number(formData.stipendValue) || 0, // Convert to number
                createdAt: serverTimestamp()
            };

            const oppDocRef = await addDoc(collection(db, "opportunities"), dataToSubmit);

            await addDoc(collection(db, "notifications"), {
                type: 'new_opportunity',
                title: `New ${formData.category}: ${formData.title}`,
                opportunityId: oppDocRef.id,
                createdAt: serverTimestamp()
            });

            setMessage('✅ Success! Opportunity has been posted.');
            // Reset form to initial state
            setFormData({
                title: '', company: '', location: 'Remote', category: 'jobs', status: 'open',
                stipend: 'Not Disclosed', deadline: '', link: '', description: '', requirements: '',
                workLocation: 'On-site', stipendValue: 0, isFeatured: false,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" id="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                    <div><label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label><input type="text" id="company" value={formData.company} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div><label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Company Location</label><input type="text" id="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                    {/* NEW: Work Location Dropdown */}
                    <div>
                        <label htmlFor="workLocation" className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                        <select id="workLocation" value={formData.workLocation} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div><label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label><select id="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"><option value="jobs">Job</option><option value="internships">Internship</option><option value="workshops">Workshop</option><option value="hackathons">Hackathon</option><option value="seminars">Seminar</option><option value="webinars">Webinar</option></select></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div><label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">Stipend (Display Text)</label><input type="text" id="stipend" value={formData.stipend} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., ₹15,000/month"/></div>
                    {/* NEW: Stipend Value for filtering */}
                    <div>
                        <label htmlFor="stipendValue" className="block text-sm font-medium text-gray-700 mb-1">Stipend Value (for filtering)</label>
                        <input type="number" id="stipendValue" value={formData.stipendValue} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., 15000"/>
                    </div>
                    <div><label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label><input type="date" id="deadline" value={formData.deadline} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                </div>

                <div className="mb-4"><label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Registration/Apply Link</label><input type="url" id="link" value={formData.link} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/></div>
                <div className="mb-4"><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea id="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" rows={4}></textarea></div>
                <div className="mb-4"><label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label><input type="text" id="requirements" value={formData.requirements} onChange={handleChange} placeholder="e.g. React, Node.js, Python" className="w-full p-2 border border-gray-300 rounded-md"/></div>
                
                {/* NEW: Featured Checkbox */}
                <div className="mb-6">
                    <div className="flex items-center">
                        <input id="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                        <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium text-gray-900">
                            Feature this opportunity? <span className="text-gray-500">(Will appear at the top)</span>
                        </label>
                    </div>
                </div>

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
