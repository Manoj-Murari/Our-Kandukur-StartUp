import React, { useState } from 'react';
import { Calendar, MapPin, IndianRupee, Briefcase, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useOpportunities, Opportunity } from '../hooks/useOpportunities';
import { useAuth } from '../contexts/AuthContext';

// Define the component's props to accept the navigation function
interface OpportunitiesProps {
  setCurrentSection: (section: string) => void;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ setCurrentSection }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { opportunities, loading, error, refetch } = useOpportunities();
  // Get the new profile completion status
  const { user, signIn, isProfileComplete } = useAuth();

  const categories = [
    { id: 'all', label: 'All Opportunities' }, { id: 'internships', label: 'Internships' },
    { id: 'jobs', label: 'Jobs' }, { id: 'workshops', label: 'Workshops' },
    { id: 'hackathons', label: 'Hackathons' }, { id: 'seminars', label: 'Seminars' },
    { id: 'webinars', label: 'Webinars' }
  ];

  // FIXED: Added a defensive check `(opportunities || [])` to prevent crashes
  const filteredOpportunities = (opportunities || []).filter(opportunity => {
    const matchesCategory = selectedCategory === 'all' || opportunity.type === selectedCategory;
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (opportunity: Opportunity) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const deadline = new Date(opportunity.deadline);
    if (deadline < today) {
      return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Closed</span>;
    }
    return opportunity.status === 'open' ? (
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Open</span>
    ) : (
      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Closed</span>
    );
  };

  const handleApplyClick = (opportunity: Opportunity) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const isPastDeadline = new Date(opportunity.deadline) < today;
    const isClosed = opportunity.status === 'closed' || isPastDeadline;

    if (isClosed) return;

    if (!user) {
      alert('Please sign in to apply for this opportunity.');
      signIn();
      return;
    }
    if (!isProfileComplete) {
      alert('Please complete your profile before applying for opportunities.');
      setCurrentSection('profile');
      return;
    }
    if (opportunity.link) {
      window.open(opportunity.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="opportunities" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Opportunities</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover the latest internships, jobs, workshops, and events - updated in real-time</p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center text-sm text-gray-500"><div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>Live Updates</div>
            <button onClick={refetch} className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"><RefreshCw className="h-4 w-4 mr-1" />Refresh</button>
          </div>
        </div>
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1"><div className="relative"><Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search opportunities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/></div></div>
          <div className="flex gap-2 flex-wrap">{categories.map((category) => (<button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{category.label}</button>))}</div>
        </div>

        {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /><span className="ml-2 text-gray-600">Loading opportunities...</span></div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"><div className="flex items-center"><AlertCircle className="h-5 w-5 text-red-600 mr-2" /><span className="text-red-800">Error loading opportunities: {error}</span><button onClick={refetch} className="ml-4 text-red-600 hover:text-red-800 underline">Try again</button></div></div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
            {filteredOpportunities.map((opportunity: Opportunity) => {
              const today = new Date(); today.setHours(0,0,0,0); const isPastDeadline = new Date(opportunity.deadline) < today; const isClosed = opportunity.status === 'closed' || isPastDeadline;
              return (
                <div key={opportunity.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-3d slide-in-up">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full pulse-glow">{opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}</span>{getStatusBadge(opportunity)}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                    <div className="flex items-center text-gray-600 mb-4"><Briefcase className="h-4 w-4 mr-2" />{opportunity.company}</div>
                    <div className="space-y-2 mb-4"><div className="flex items-center text-sm text-gray-500"><MapPin className="h-4 w-4 mr-2" />{opportunity.location}</div><div className="flex items-center text-sm text-gray-500"><Calendar className="h-4 w-4 mr-2" />Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</div><div className="flex items-center text-sm text-gray-500"><IndianRupee className="h-4 w-4 mr-2" />{opportunity.stipend}</div></div>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{opportunity.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">{opportunity.requirements.map((req, index) => (<span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{req}</span>))}</div>
                    <button onClick={() => handleApplyClick(opportunity)} className={`w-full mt-auto py-2 px-4 rounded-lg font-medium transition-all ${!isClosed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={isClosed}>{!user && !isClosed ? 'Sign In to Apply' : (!isClosed ? 'Apply Now' : 'Application Closed')}</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {!loading && !error && filteredOpportunities.length === 0 && (<div className="text-center py-12"><p className="text-gray-500 text-lg">No opportunities found matching your criteria.</p></div>)}
      </div>
    </section>
  );
};

export default Opportunities;
