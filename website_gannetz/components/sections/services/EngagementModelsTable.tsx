import { Section } from '@/components/ui/Section';

const models = [
    { model: 'Dedicated Resources', bestFor: 'Filling specific role gaps', duration: '3-12 months', management: 'Client-managed' },
    { model: 'Managed Teams', bestFor: 'Complete delivery ownership', duration: '6+ months', management: 'GANNETZ-managed' },
    { model: 'Project-Based', bestFor: 'Defined scope initiatives', duration: '2-6 months', management: 'Milestone-driven' },
    { model: 'Offshore Development Center', bestFor: 'Long-term capacity', duration: '12+ months', management: 'Hybrid model' },
];

export function EngagementModelsTable() {
    return (
        <Section variant="surface">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-4">Engagement Models</h2>
                <p className="text-foreground/60 max-w-2xl">
                    Flexible partnership frameworks designed to align with your project timelines and governance requirements.
                </p>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="p-4 font-semibold">Model</th>
                            <th className="p-4 font-semibold">Best For</th>
                            <th className="p-4 font-semibold">Duration</th>
                            <th className="p-4 font-semibold">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {models.map((item, idx) => (
                            <tr key={idx} className="hover:bg-surface/50 transition-colors">
                                <td className="p-4 font-bold text-primary">{item.model}</td>
                                <td className="p-4 text-foreground/70">{item.bestFor}</td>
                                <td className="p-4 text-foreground/70">{item.duration}</td>
                                <td className="p-4 text-foreground/70 italic">{item.management}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
}
