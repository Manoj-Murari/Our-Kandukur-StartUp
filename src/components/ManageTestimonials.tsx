import React, { useState } from 'react';
import { useTestimonials, Testimonial } from '../hooks/useTestimonials';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Trash2, UserPlus, Star, Edit, X, Upload } from 'lucide-react';

// Reusable form for both adding and editing
const TestimonialForm: React.FC<{
    initialData?: Partial<Testimonial>;
    onSubmit: (data: Omit<Testimonial, 'id' | 'createdAt'>, imageFile: File | null) => Promise<void>;
    onClose?: () => void;
    isSubmitting: boolean;
}> = ({ initialData = {}, onSubmit, onClose, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        role: initialData.role || '',
        content: initialData.content || '',
        rating: initialData.rating || 5,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === 'number' ? Number(value) : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pass both form text data and the image file to the parent handler
        onSubmit(formData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="name" className="block text-sm font-medium">Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
                <div><label htmlFor="role" className="block text-sm font-medium">Role / Position</label><input type="text" id="role" value={formData.role} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
            </div>
            {/* FIXED: Replaced URL input with File input */}
            <div><label htmlFor="image" className="block text-sm font-medium">Image (Optional)</label><input type="file" id="image" onChange={handleFileChange} accept="image/*" className="w-full p-2 border rounded-md"/></div>
            <div><label htmlFor="content" className="block text-sm font-medium">Testimonial Content</label><textarea id="content" value={formData.content} onChange={handleChange} required rows={4} className="w-full p-2 border rounded-md"></textarea></div>
            <div><label htmlFor="rating" className="block text-sm font-medium">Rating (1-5)</label><select id="rating" value={formData.rating} onChange={handleChange} required className="w-full p-2 border rounded-md"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div>
            <div className="flex justify-end space-x-4 pt-4">
                {onClose && <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>}
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                    {isSubmitting ? 'Saving...' : 'Save Testimonial'}
                </button>
            </div>
        </form>
    );
};


const ManageTestimonials: React.FC = () => {
    const { testimonials, loading, error, refetch } = useTestimonials();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const uploadImage = async (imageFile: File): Promise<string> => {
        const formData = new FormData();
        formData.append('teamImage', imageFile); // The PHP script uses 'teamImage' key
        
        const uploadResponse = await fetch('https://ourkandukur.com/upload.php', {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.status !== 'success') {
            throw new Error(uploadResult.message || 'Image upload failed.');
        }
        return uploadResult.url;
    };

    const handleAddSubmit = async (data: Omit<Testimonial, 'id' | 'createdAt'>, imageFile: File | null) => {
        setIsSubmitting(true);
        setMessage('');
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            } else {
                imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff`;
            }

            await addDoc(collection(db, "testimonials"), { ...data, imageUrl, createdAt: serverTimestamp() });
            setMessage('✅ Success! Testimonial added.');
            refetch();
        } catch (err: any) {
            setMessage(`❌ Error! ${err.message}`);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleEditSubmit = async (data: Omit<Testimonial, 'id' | 'createdAt'>, imageFile: File | null) => {
        if (!editingTestimonial) return;
        setIsSubmitting(true);
        try {
            let imageUrl = editingTestimonial.image; // Start with the existing image URL
            if (imageFile) {
                // If a new file is provided, upload it and get the new URL
                imageUrl = await uploadImage(imageFile);
            }

            const testimonialRef = doc(db, "testimonials", editingTestimonial.id);
            await updateDoc(testimonialRef, { ...data, image: imageUrl }); // Use 'image' field as in the data structure
            
            alert('Testimonial updated successfully!');
            setEditingTestimonial(null);
            refetch();
        } catch (err: any) {
            alert(`Failed to update testimonial: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await deleteDoc(doc(db, "testimonials", id));
                alert('Testimonial deleted successfully.');
                refetch();
            } catch (err) {
                alert('Failed to delete testimonial.');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center"><UserPlus className="mr-3"/>Add a New Testimonial</h2>
                {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                <TestimonialForm onSubmit={handleAddSubmit} isSubmitting={isSubmitting} />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Testimonials</h2>
                {loading ? <Loader2 className="animate-spin"/> : (
                    <div className="space-y-4">
                        {testimonials.map(testimonial => (
                            <div key={testimonial.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center">
                                    <img src={testimonial.image || `https://ui-avatars.com/api/?name=${testimonial.name}`} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4 object-cover"/>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setEditingTestimonial(testimonial)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"><Edit className="h-5 w-5"/></button>
                                    <button onClick={() => handleDelete(testimonial.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"><Trash2 className="h-5 w-5"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editingTestimonial && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Edit Testimonial</h2>
                            <button onClick={() => setEditingTestimonial(null)} className="p-2 rounded-full hover:bg-gray-200"><X/></button>
                        </div>
                        <TestimonialForm 
                            initialData={editingTestimonial}
                            onSubmit={handleEditSubmit}
                            onClose={() => setEditingTestimonial(null)}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTestimonials;
