'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ServiceCategories } from '@/components/sections/services/ServiceCategories';
import { EngagementModelsTable } from '@/components/sections/services/EngagementModelsTable';
import { QualityAndSLAs } from '@/components/sections/services/QualityAndSLAs';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ServicesPage() {
    return (
        <div className="pt-20">
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                    alt="Technology Collaboration"
                    fill
                    className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">
                            Staff Augmentation <br />
                            <span className="text-primary">Redefined.</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
                            Access Specialized Engineering Talent Without Long-Term Commitments. <br />
                            Specialized in AI, Cloud, Embedded, and Enterprise systems.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <Section>
                <div className="mb-12">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Expertise Domains</h2>
                    <h3 className="text-4xl font-black text-secondary md:text-5xl tracking-tight">Specialized Engineering Segments</h3>
                </div>
                <ServiceCategories />
            </Section>

            <EngagementModelsTable />
            <QualityAndSLAs />

            <Section variant="surface" className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-6">Ready to discuss your engineering talent needs?</h3>
                <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-lg font-semibold text-white transition-all active:scale-95"
                >
                    Discuss Your Needs
                </a>
            </Section>
        </div>
    );
}
