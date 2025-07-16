import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, IndianRupee, Briefcase, Search, Loader2, AlertCircle, RefreshCw, Star, Building, SlidersHorizontal, X } from 'lucide-react';
import { useOpportunities, Opportunity } from '../hooks/useOpportunities';
import { useAuth } from '../contexts/AuthContext';

interface OpportunitiesPreviewProps {
    setCurrentSection: (section: string) => void;
}

const OpportunitiesPreview: React.FC<OpportunitiesPreviewProps> = ({ setCurrentSection }) => {
    // All state and hooks from the main Opportunities page are now here
    const { opportunities, loading, error, refetch } = useOpportunities();
    const { user, signIn, isProfileComplete } = useAuth();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [workLocationFilter, setWorkLocationFilter] = useState('all');
    const [stipendFilter, setStipendFilter] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { id: 'all', label: 'All' }, { id: 'internships', label: 'Internships' },
        { id: 'jobs', label: 'Jobs' }, { id: 'workshops', label: 'Workshops' },
        { id: 'hackathons', label: 'Hackathons' }, { id: 'seminars', label: 'Seminars' },
        { id: 'webinars', label: 'Webinars' }
    ];

    const filteredOpportunities = useMemo(() => {
        return (opportunities || []).filter(opportunity => {
            const matchesCategory = selectedCategory === 'all' || opportunity.type === selectedCategory;
            const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  opportunity.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesWorkLocation = workLocationFilter === 'all' || opportunity.workLocation === workLocationFilter;
            const matchesStipend = opportunity.stipendValue >= stipendFilter;
            
            return matchesCategory && matchesSearch && matchesWorkLocation && matchesStipend;
        });
    }, [opportunities, selectedCategory, searchTerm, workLocationFilter, stipendFilter]);
    
    const resetFilters = () => {
        setSearchTerm('');
        setWorkLocationFilter('all');
        setStipendFilter(0);
    };

    const handleApplyClick = (opportunity: Opportunity, isClosed: boolean) => {
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
        <section id="opportunities-preview" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Opportunities</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover the latest internships, jobs, workshops, and events - updated in real-time</p>
                    <div className="flex items-center justify-center mt-4 space-x-4">
                        <div className="flex items-center text-sm text-gray-500"><div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>Live Updates</div>
                        <button onClick={refetch} className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"><RefreshCw className="h-4 w-4 mr-1" />Refresh</button>
                    </div>
                </div>
                
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input id="search-main" type="text" placeholder="Search by title or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"/>
                        </div>
                        <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 px-4 py-3 bg-white text-gray-800 rounded-lg font-semibold shadow-sm border hover:bg-gray-100 w-full sm:w-auto justify-center">
                            <SlidersHorizontal className="h-4 w-4" />
                             Filters
                        </button>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center justify-center pt-4">
                        {categories.map((category) => (<button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all ${selectedCategory === category.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-800 hover:bg-gray-100 shadow-sm border'}`}>{category.label}</button>))}
                    </div>
                </div>

                {showFilters && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setShowFilters(false)}>
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md space-y-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-gray-200"><X className="h-5 w-5"/></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="workLocationFilter" className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                                    <select id="workLocationFilter" value={workLocationFilter} onChange={(e) => setWorkLocationFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="all">All</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="stipendFilter" className="block text-sm font-medium text-gray-700 mb-1">Minimum Stipend/Salary: ₹{stipendFilter.toLocaleString()}</label>
                                    <input type="range" id="stipendFilter" min="0" max="100000" step="5000" value={stipendFilter} onChange={(e) => setStipendFilter(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t">
                                <button onClick={resetFilters} className="text-sm font-medium text-gray-600 hover:text-red-600">Reset Filters</button>
                                <button onClick={() => setShowFilters(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Done</button>
                            </div>
                        </div>
                    </div>
                )}

                {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /><span className="ml-2 text-gray-600">Loading opportunities...</span></div>}
                {error && <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"><div className="flex items-center"><AlertCircle className="h-5 w-5 text-red-600 mr-2" /><span className="text-red-800">Error loading opportunities: {error}</span><button onClick={refetch} className="ml-4 text-red-600 hover:text-red-800 underline">Try again</button></div></div>}

                {!loading && !error && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* UPDATED: Only show the first 3 results */}
                        {filteredOpportunities.slice(0, 3).map((opportunity: Opportunity) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const deadlineDate = new Date(opportunity.deadline);
                            deadlineDate.setHours(0, 0, 0, 0);
                            const isClosed = today > deadlineDate || opportunity.status === 'closed';

                            return (
                                <div key={opportunity.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden ${opportunity.isFeatured ? 'ring-2 ring-blue-500 shadow-blue-200' : 'border border-gray-200'}`}>
                                    {opportunity.isFeatured && (
                                        <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold flex items-center gap-1">
                                            <Star className="h-3 w-3" /> Featured
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4 pt-4">
                                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}</span>
                                            {isClosed 
                                                ? <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Closed</span>
                                                : <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Open</span>
                                            }
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                                        <div className="flex items-center text-gray-600 mb-4"><Briefcase className="h-4 w-4 mr-2" />{opportunity.company}</div>
                                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center"><Building className="h-4 w-4 mr-2" />{opportunity.workLocation}</div>
                                            <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{opportunity.location}</div>
                                            <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</div>
                                            <div className="flex items-center"><IndianRupee className="h-4 w-4 mr-2" />{opportunity.stipend}</div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">{opportunity.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">{opportunity.requirements.map((req, index) => (<span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{req}</span>))}</div>
                                        <button onClick={() => handleApplyClick(opportunity, isClosed)} className={`w-full mt-auto py-2 px-4 rounded-lg font-medium transition-all ${!isClosed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={isClosed}>{!isClosed ? 'Apply Now' : 'Application Closed'}</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                {!loading && !error && filteredOpportunities.length === 0 && (<div className="text-center py-12"><p className="text-gray-500 text-lg">No opportunities found matching your criteria.</p></div>)}
                
                {/* See All Opportunities Button */}
                <div className="mt-16 text-right">
                    <button 
                        onClick={() => setCurrentSection('opportunities')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        See All Opportunities
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OpportunitiesPreview;
