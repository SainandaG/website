'use client';

import { Section } from '@/components/ui/Section';
import { CaseStudyCard } from '@/components/sections/case-studies/CaseStudyCard';

const caseStudies = [
    {
        id: 'energy-platform',
        title: 'AI-Powered Energy Monetization Platform',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        client: 'Energy & Utilities Sector',
        challenge: 'Energy provider needed to build real-time energy trading and optimization platform but lacked in-house AI and cloud expertise.',
        solution: 'Deployed managed team of 5 engineers to build the core forecasting engine and scalable infrastructure.',
        team: ['2 AI/ML engineers', '2 Cloud architects', '1 Data engineer'],
        outcomes: [
            'Platform deployed in 4 months vs. 12-month estimate',
            '35% improvement in energy price prediction accuracy',
            'Real-time processing of 50,000+ data points/second',
            '$2M+ annual energy cost optimization'
        ],
        techStack: ['Python', 'TensorFlow', 'Kubernetes', 'Apache Kafka', 'PostgreSQL', 'GCP'],
        duration: '6 months (ongoing support)',
    },
    {
        id: 'ev-bms',
        title: 'EV Battery Management System Development',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200',
        client: 'Automotive Manufacturing',
        challenge: 'Automotive OEM transitioning to EV needed experienced BMS engineers but couldn\'t find talent with automotive-grade embedded Linux experience.',
        solution: 'Provided 3 dedicated embedded engineers focused on thermal management, state-of-charge, and safety systems.',
        team: ['2 Linux embedded developers (Yocto)', '1 BMS algorithm specialist'],
        outcomes: [
            'BMS software ready for production testing in 7 months',
            '15% improvement in battery life prediction accuracy',
            'Achieved automotive safety standards (ISO 26262)',
            'Knowledge transfer enabled client team independence'
        ],
        techStack: ['C/C++', 'Embedded Linux (Yocto)', 'CAN protocol', 'AUTOSAR'],
        duration: '9 months',
    },
    {
        id: 'cloud-migration',
        title: 'Cloud-Native Microservices Migration',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        client: 'Financial Services',
        challenge: 'Legacy monolithic application causing scalability bottlenecks; needed modernization to cloud-native architecture.',
        solution: 'Managed team of 6 engineers implementing the Strangler Fig pattern for incremental migration.',
        team: ['2 Backend architects', '2 DevOps engineers', '1 Cloud security specialist', '1 Frontend developer'],
        outcomes: [
            '70% reduction in deployment time',
            '40% infrastructure cost reduction',
            '99.9% uptime SLA achievement',
            'Zero-downtime migration execution'
        ],
        techStack: ['Java Spring Boot', 'Kubernetes', 'Docker', 'AWS (EKS, RDS)', 'Terraform'],
        duration: '8 months',
    }
];

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

export default function CaseStudiesPage() {
    return (
        <div className="pt-20">
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
                    alt="Actionable Results"
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
                            Engineering <br />
                            <span className="text-primary">Impact.</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
                            Real-world results delivered for industry leaders <br />
                            in automotive, energy, and finance.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <Section>
                {caseStudies.map((study) => (
                    <CaseStudyCard key={study.id} {...study} />
                ))}
            </Section>

            <Section variant="surface" className="text-center">
                <h3 className="text-3xl font-bold text-primary mb-6">Have a similar engineering challenge?</h3>
                <p className="text-foreground/60 mb-10 max-w-2xl mx-auto">
                    Our specialized teams have seen—and solved—the complex architectural hurdles you're facing.
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-lg font-semibold text-white transition-all active:scale-95"
                    >
                        Solve Similar Challenges
                    </a>
                    <a
                        href="/services"
                        className="inline-flex items-center justify-center rounded-md border border-primary px-8 py-3.5 text-lg font-semibold text-primary transition-all hover:bg-surface active:scale-95"
                    >
                        Explore Capabilities
                    </a>
                </div>
            </Section>
        </div>
    );
}
