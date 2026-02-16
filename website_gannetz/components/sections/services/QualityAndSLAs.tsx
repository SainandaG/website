import { CheckCircle2, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

export function QualityAndSLAs() {
    return (
        <Section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-3xl font-bold text-primary mb-8">Quality Assurance Framework</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="shrink-0 text-secondary mt-1"><CheckCircle2 size={24} /></div>
                            <div>
                                <h4 className="font-bold text-primary mb-1">Technical Vetting</h4>
                                <p className="text-foreground/60 text-sm">Multi-stage technical assessment including live coding and system design evaluation.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 text-secondary mt-1"><ShieldCheck size={24} /></div>
                            <div>
                                <h4 className="font-bold text-primary mb-1">Operational Standards</h4>
                                <p className="text-foreground/60 text-sm">Background verification, NDA/IP protection, and constant performance monitoring.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-primary mb-8">SLA Commitments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-surface border-secondary/20">
                            <Clock className="text-secondary mb-4" size={24} />
                            <h4 className="font-bold text-primary mb-2">14-Day Onboarding</h4>
                            <p className="text-xs text-foreground/60">First resource deployed within 14 days of requirement finalization.</p>
                        </Card>
                        <Card className="bg-surface border-secondary/20">
                            <Zap className="text-secondary mb-4" size={24} />
                            <h4 className="font-bold text-primary mb-2">30-Day Replacement</h4>
                            <p className="text-xs text-foreground/60">No-cost replacement within 30 days if fitment issues arise.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </Section>
    );
}
