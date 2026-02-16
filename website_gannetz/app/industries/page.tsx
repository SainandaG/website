'use client';

import { Car, Battery, Landmark, HeartPulse, Laptop } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { IndustryCard } from '@/components/sections/industries/IndustryCard';

const industriesData = [
    {
        title: 'Automotive & Electric Vehicles',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800',
        icon: <Car size={40} />,
        challenge: 'Rapid EV adoption requires specialized embedded systems, battery management, and vehicle software talent that traditional hiring can\'t supply fast enough.',
        solution: 'Pre-vetted pool of automotive Linux developers, BMS engineers, AUTOSAR specialists, and HMI developers who\'ve built production vehicle systems.',
        projects: [
            'EV fleet energy optimization platform',
            'Battery thermal management algorithms',
            'Vehicle-to-Grid (V2G) integration systems',
        ],
    },
    {
        title: 'Energy & Utilities',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
        icon: <Battery size={40} />,
        challenge: 'Smart grid modernization, renewable energy integration, and energy trading platforms demand AI and cloud expertise.',
        solution: 'Data engineers, AI specialists, and cloud architects experienced in energy forecasting, grid optimization, and trading systems.',
        projects: [
            'AI-powered energy monetization platform',
            'Real-time grid balancing algorithms',
            'Renewable energy forecasting systems',
        ],
    },
    {
        title: 'Financial Services & Fintech',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        icon: <Landmark size={40} />,
        challenge: 'Regulatory compliance, AI governance, and secure cloud infrastructure require specialized engineering talent.',
        solution: 'Engineers experienced in building compliant AI systems, secure payment platforms, and risk management tools.',
        projects: [
            'AI governance framework for institutional finance',
            'Cloud-native banking microservices',
            'Real-time fraud detection systems',
        ],
    },
    {
        title: 'Healthcare Technology',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        icon: <HeartPulse size={40} />,
        challenge: 'Patient data security, AI-driven diagnostics, and interoperability standards require HIPAA-aware engineering.',
        solution: 'Engineers with healthcare domain knowledge in secure cloud architecture, medical AI, and HL7/FHIR integration.',
        projects: [
            'Medical diagnostics AI engine',
            'HL7/FHIR compliant data exchange',
            'Secure patient health records portal',
        ],
    },
    {
        title: 'IT Services & Digital Transformation',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
        icon: <Laptop size={40} />,
        challenge: 'Scaling delivery capacity for client projects without permanent headcount expansion.',
        solution: 'Flexible resource augmentation for AI, cloud, and application development projects.',
        projects: [
            'Enterprise application modernization',
            'Multi-cloud strategy implementation',
            'DevOps automation and CI/CD pipelines',
        ],
    },
];

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

export default function IndustriesPage() {
    return (
        <div className="pt-20">
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1600"
                    alt="Global Industry & Energy"
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
                            Deep Domain <br />
                            <span className="text-primary">Impact.</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
                            Solving innovation-critical engineering challenges <br />
                            across specialized global sectors.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <Section>
                <div className="space-y-6">
                    {industriesData.map((industry, idx) => (
                        <IndustryCard key={idx} {...industry} />
                    ))}
                </div>
            </Section>

            <Section variant="surface" className="text-center">
                <div className="max-w-2xl mx-auto">
                    <h3 className="text-4xl font-black text-secondary mb-6 tracking-tight">Partner with Domain Experts</h3>
                    <p className="text-secondary/70 mb-8 font-medium leading-relaxed">
                        Our engineers don't just write code; they understand the regulatory, safety, and architectural constraints of your specific industry.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-lg font-bold text-white transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        Request Industry-Specific Talent
                    </a>
                </div>
            </Section>
        </div>
    );
}
