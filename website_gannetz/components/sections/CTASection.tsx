import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export function CTASection() {
    return (
        <Section variant="dark" className="text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">Ready to scale your engineering capacity?</h2>
                <p className="text-xl text-white/70 mb-10">
                    Join leading enterprises that trust GANNETZ to deliver specialized talent for their most critical innovation projects.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button variant="secondary" size="lg" asChild>
                        <a href="/contact">Schedule a Consultation</a>
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" asChild>
                        <a href="#">Download Company Profile</a>
                    </Button>
                </div>
            </div>
        </Section>
    );
}
