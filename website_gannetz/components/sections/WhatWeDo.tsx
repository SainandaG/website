import { Cpu, Zap, Cloud } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import Image from 'next/image';

const services = [
    {
        title: 'AI & Intelligent Systems',
        description: 'GenAI engineers, MLOps specialists, AI governance architects who build production-grade intelligent systems for enterprise scale.',
        icon: <Cpu className="text-secondary" size={32} />,
        visual: (
            <div className="mt-8 h-48 w-full rounded-2xl border-2 border-secondary/10 overflow-hidden group-hover:border-primary/50 transition-all shadow-inner relative">
                <Image
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                    alt="AI Systems"
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
            </div>
        )
    },
    {
        title: 'EV & Embedded Excellence',
        description: 'Automotive Linux developers, BMS engineers, HMI specialists with deep expertise in vehicle software and energy systems.',
        icon: <Zap className="text-secondary" size={32} />,
        visual: (
            <div className="mt-8 h-48 w-full rounded-2xl border-2 border-secondary/10 overflow-hidden group-hover:border-primary/50 transition-all shadow-inner relative">
                <Image
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"
                    alt="EV Engineering"
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
            </div>
        )
    },
    {
        title: 'Cloud-Native Infrastructure',
        description: 'Kubernetes architects, DevOps automation experts, multi-cloud engineers who design scalable, resilient systems.',
        icon: <Cloud className="text-secondary" size={32} />,
        visual: (
            <div className="mt-8 h-48 w-full rounded-2xl border-2 border-secondary/10 overflow-hidden group-hover:border-primary/50 transition-all shadow-inner relative">
                <Image
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
                    alt="Cloud Infrastructure"
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
            </div>
        )
    },
];

export function WhatWeDo() {
    return (
        <Section variant="surface" className="pt-12 md:pt-16 pb-20 md:pb-24">
            <div className="mb-16">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">What We Do</h2>
                <h3 className="text-3xl font-bold text-secondary md:text-4xl">
                    Domain Expertise for the Future of Enterprise
                </h3>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {services.map((service, index) => (
                    <Card key={index} className="flex flex-col h-full border-secondary/10 bg-white hover:border-primary transition-all group shadow-xl hover:shadow-2xl rounded-3xl p-10">
                        <div className="mb-8 p-5 rounded-2xl bg-secondary/5 text-secondary group-hover:bg-primary group-hover:text-white transition-all w-fit">
                            {service.icon}
                        </div>
                        <CardTitle className="mb-6 text-secondary font-black text-3xl tracking-tight leading-tight">{service.title}</CardTitle>
                        <CardContent className="text-secondary/70 font-semibold leading-relaxed text-lg mb-4">{service.description}</CardContent>
                        {service.visual}
                    </Card>
                ))}
            </div>
        </Section>
    );
}
