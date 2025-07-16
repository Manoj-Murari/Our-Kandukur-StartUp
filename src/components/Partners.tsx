import React from 'react';
import { usePartners, Partner } from '../hooks/usePartners';
import { Loader2, AlertCircle } from 'lucide-react';

// This is the same list from the admin dashboard to ensure order.
const partnerCategories = [
    "Community Partners",
    "Education Partners",
    "Media Partners",
    "Outreach & Influencer Partners",
    "Corporate & Sponsorship Partners",
    "Government & Institutional Partners"
];

const Partners: React.FC = () => {
    const { partners, loading, error } = usePartners();

    // Group partners by category for display
    const groupedPartners = partners.reduce((acc, partner) => {
        (acc[partner.category] = acc[partner.category] || []).push(partner);
        return acc;
    }, {} as Record<string, Partner[]>);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Our Valued Partners</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        We are proud to collaborate with a diverse group of organizations to create opportunities.
                    </p>
                </div>

                {loading && <div className="flex justify-center items-center py-12"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>}
                {error && <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg"><AlertCircle className="mx-auto h-8 w-8" /><p className="mt-2">{error}</p></div>}

                {!loading && !error && (
                    <div className="space-y-16">
                        {partnerCategories.map(category => (
                            groupedPartners[category] && (
                                <div key={category}>
                                    <div className="relative mb-10">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-white px-4 text-2xl font-semibold text-gray-700 rounded-md">{category}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                                        {groupedPartners[category].map(partner => (
                                            <div key={partner.id} className="text-center" title={partner.name}>
                                                {/* UPDATED: Removed the 'grayscale' and 'hover:grayscale-0' classes */}
                                                <img 
                                                    src={partner.logoUrl} 
                                                    alt={`${partner.name} logo`} 
                                                    className="h-24 max-w-xs object-contain transition-all duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Partners;
