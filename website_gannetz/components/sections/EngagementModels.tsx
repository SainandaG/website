import { Section } from '@/components/ui/Section';

const steps = [
    { id: '1', title: 'Requirements Discussion', desc: 'Understanding technical needs and domain context.' },
    { id: '2', title: 'Skill Mapping', desc: 'Identifying specific engineering roles and competencies.' },
    { id: '3', title: 'Talent Presentation', desc: 'Reviewing profiles of pre-vetted senior engineers.' },
    { id: '4', title: 'Technical Interviews', desc: 'Validating fit through client-led assessments.' },
    { id: '5', title: 'Onboarding & Integration', desc: 'Seamless integration into client workflows.' },
];

export function EngagementModelsTimeline() {
    return (
        <Section variant="surface">
            <div className="mb-16">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Our Process</h2>
                <h3 className="text-3xl font-bold text-primary md:text-4xl">Engagement Lifecycle</h3>
            </div>
            <div className="relative">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden lg:block" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col bg-white p-6 rounded-lg border border-border shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-6">
                                {step.id}
                            </div>
                            <h4 className="text-lg font-bold text-primary mb-3">{step.title}</h4>
                            <p className="text-foreground/60 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
