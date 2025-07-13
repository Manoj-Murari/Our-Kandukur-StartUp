import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Save, Link as LinkIcon, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const ManageSettings: React.FC = () => {
  const { settings, loading, error, refetch } = useSiteSettings();
  const [formData, setFormData] = useState({
    whatsappChannelUrl: '',
    whatsappCommunityUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsappChannelUrl: settings.whatsappChannelUrl || '',
        whatsappCommunityUrl: settings.whatsappCommunityUrl || '',
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const settingsRef = doc(db, 'settings', 'links');
      await setDoc(settingsRef, formData, { merge: true });
      setMessage('✅ Settings saved successfully!');
      refetch();
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage('❌ Failed to save settings.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Site Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2">WhatsApp Links</legend>
          <div className="space-y-4 pt-2">
            <div><label htmlFor="whatsappChannelUrl" className="block text-sm font-medium text-gray-700">Channel URL</label><div className="relative mt-1"><LinkIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="whatsappChannelUrl" value={formData.whatsappChannelUrl} onChange={handleChange} placeholder="https://whatsapp.com/channel/..." className="w-full pl-10 p-2 border border-gray-300 rounded-md"/></div></div>
            <div><label htmlFor="whatsappCommunityUrl" className="block text-sm font-medium text-gray-700">Community URL</label><div className="relative mt-1"><LinkIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="whatsappCommunityUrl" value={formData.whatsappCommunityUrl} onChange={handleChange} placeholder="https://chat.whatsapp.com/..." className="w-full pl-10 p-2 border border-gray-300 rounded-md"/></div></div>
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2">Social Media Links</legend>
          <div className="space-y-4 pt-2">
            <div><label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700">Facebook URL</label><div className="relative mt-1"><Facebook className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md"/></div></div>
            <div><label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700">Instagram URL</label><div className="relative mt-1"><Instagram className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md"/></div></div>
            <div><label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL</label><div className="relative mt-1"><Linkedin className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md"/></div></div>
            <div><label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">YouTube URL</label><div className="relative mt-1"><Youtube className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md"/></div></div>
          </div>
        </fieldset>
        
        <div className="flex items-center justify-end">
          {message && <p className="text-sm text-gray-600 mr-4">{message}</p>}
          <button type="submit" disabled={isSaving} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
            {isSaving ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="h-5 w-5 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageSettings;
