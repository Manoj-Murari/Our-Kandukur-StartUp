import React, { useState, useMemo, useEffect } from 'react';
import { useOpportunities, Opportunity } from '../hooks/useOpportunities';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, AlertCircle, Trash2, Search, Edit, X } from 'lucide-react';

// This is the Edit Form that will appear in a modal
const EditOpportunityForm: React.FC<{ opportunity: Opportunity; onClose: () => void; onSave: () => void; }> = ({ opportunity, onClose, onSave }) => {
    const [formData, setFormData] = useState(opportunity);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleRequirementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, requirements: e.target.value.split(',').map(r => r.trim()) }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const oppRef = doc(db, "opportunities", opportunity.id);
            // Create a new object for updating, excluding the id
            const { id, ...updateData } = formData;
            await updateDoc(oppRef, updateData);
            alert('Opportunity updated successfully!');
            onSave(); // This will refetch the data in the parent
            onClose(); // Close the modal
        } catch (err) {
            console.error("Error updating opportunity:", err);
            alert("Failed to update opportunity.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit Opportunity</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X/></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label htmlFor="title" className="block text-sm font-medium">Title</label><input type="text" id="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                    <div><label htmlFor="company" className="block text-sm font-medium">Company</label><input type="text" id="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                    <div><label htmlFor="category" className="block text-sm font-medium">Category</label><select id="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="jobs">Job</option><option value="internships">Internship</option><option value="workshops">Workshop</option><option value="hackathons">Hackathon</option><option value="seminars">Seminar</option><option value="webinars">Webinar</option></select></div>
                    <div><label htmlFor="status" className="block text-sm font-medium">Status</label><select id="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="open">Open</option><option value="closed">Closed</option></select></div>
                    <div><label htmlFor="deadline" className="block text-sm font-medium">Deadline</label><input type="date" id="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                    <div><label htmlFor="link" className="block text-sm font-medium">Apply Link</label><input type="url" id="link" value={formData.link} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                    <div><label htmlFor="description" className="block text-sm font-medium">Description</label><textarea id="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md" rows={3}></textarea></div>
                    <div><label htmlFor="requirements" className="block text-sm font-medium">Requirements (comma-separated)</label><input type="text" id="requirements" value={formData.requirements.join(', ')} onChange={handleRequirementsChange} className="w-full p-2 border rounded-md"/></div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
                            {isSaving && <Loader2 className="animate-spin mr-2"/>}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ManageOpportunities: React.FC = () => {
  const { opportunities, loading, error, refetch } = useOpportunities();
  const [searchTerm, setSearchTerm] = useState('');
  // State to hold the opportunity being edited
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const filteredOpportunities = useMemo(() => {
    if (!searchTerm) return opportunities;
    return opportunities.filter(opp => 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [opportunities, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
        try {
            await deleteDoc(doc(db, "opportunities", id));
            alert('Opportunity deleted successfully.');
            refetch(); // Refresh the list
        } catch (err) {
            console.error("Error deleting opportunity: ", err);
            alert('Failed to delete opportunity.');
        }
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Opportunities</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {loading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {error && <div className="text-red-600"><AlertCircle className="inline mr-2"/>{error}</div>}
        
        {!loading && !error && (
          <div className="space-y-4">
            {filteredOpportunities.length > 0 ? filteredOpportunities.map(opp => (
              <div key={opp.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{opp.title}</p>
                  <p className="text-sm text-gray-500">{opp.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* EDIT BUTTON */}
                    <button onClick={() => setEditingOpportunity(opp)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100">
                        <Edit className="h-5 w-5"/>
                    </button>
                    {/* DELETE BUTTON */}
                    <button onClick={() => handleDelete(opp.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                        <Trash2 className="h-5 w-5"/>
                    </button>
                </div>
              </div>
            )) : <p className="text-gray-500 text-center py-8">No opportunities found.</p>}
          </div>
        )}
      </div>

      {/* The Edit Modal will appear here when an opportunity is selected */}
      {editingOpportunity && (
        <EditOpportunityForm 
            opportunity={editingOpportunity} 
            onClose={() => setEditingOpportunity(null)}
            onSave={refetch}
        />
      )}
    </>
  );
};

export default ManageOpportunities;
