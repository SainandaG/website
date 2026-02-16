import { Car, Battery, Landmark, HeartPulse, Laptop } from 'lucide-react';
import { Section } from '@/components/ui/Section';

const industries = [
    { name: 'Automotive & Electric Vehicles', icon: <Car size={20} /> },
    { name: 'Energy & Utilities', icon: <Battery size={20} /> },
    { name: 'Financial Services & Fintech', icon: <Landmark size={20} /> },
    { name: 'Healthcare Technology', icon: <HeartPulse size={20} /> },
    { name: 'IT Services & Digital Transformation', icon: <Laptop size={20} /> },
];

export function IndustriesServe() {
    return (
        <Section variant="white" className="border-y border-border">
            <div className="mb-16 text-center">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Industries We Serve</h2>
                <h3 className="text-3xl font-bold text-secondary md:text-4xl max-w-2xl mx-auto">
                    Deep Domain Expertise Across Critical Innovation Sectors
                </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {industries.map((industry, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 px-6 py-4 rounded-full border border-border bg-surface text-secondary font-medium hover:border-primary transition-colors"
                    >
                        {industry.icon}
                        <span>{industry.name}</span>
                    </div>
                ))}
            </div>
        </Section>
    );
}
