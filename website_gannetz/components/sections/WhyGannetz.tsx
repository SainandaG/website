import { Shield, Timer, Layers, Settings } from 'lucide-react';
import { Section } from '@/components/ui/Section';

const points = [
    {
        title: 'Specialized Depth, Not Generalist Breadth',
        description: 'Senior engineers with 5+ years in niche domains—not junior developers learning on your projects.',
        icon: <Shield size={24} />,
    },
    {
        title: 'Rapid Deployment',
        description: 'Pre-vetted talent pool enables 2-week onboarding vs. 3-month traditional hiring cycles.',
        icon: <Timer size={24} />,
    },
    {
        title: 'Enterprise-Grade Governance',
        description: 'Structured processes for IP protection, data security, code quality, and knowledge transfer.',
        icon: <Layers size={24} />,
    },
    {
        title: 'Flexible Engagement Models',
        description: 'Dedicated resources, managed teams, or project-based—scale up and down as innovation priorities shift.',
        icon: <Settings size={24} />,
    },
];

export function WhyGannetz() {
    return (
        <Section>
            <div className="grid grid-cols-1 gap-12 border-l border-border md:grid-cols-2 lg:grid-cols-4">
                {points.map((point, index) => (
                    <div key={index} className="pl-8">
                        <div className="mb-6 text-secondary">{point.icon}</div>
                        <h4 className="mb-4 text-xl font-bold text-primary leading-tight">{point.title}</h4>
                        <p className="text-foreground/60 leading-relaxed text-sm">
                            {point.description}
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
}
