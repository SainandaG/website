'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Target, Users, Shield } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-20">
            <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600"
                    alt="Engineering Laboratory"
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
                        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white">
                            Engineering-First.<br />
                            <span className="text-primary">Enterprise-Ready.</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
                            We bridge the gap between complex engineering challenges and specialized talent with technical precision and process discipline.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl font-black text-secondary mb-6 tracking-tight">Who We Are</h2>
                        <div className="space-y-6 text-secondary/80 font-medium leading-relaxed text-lg">
                            <p>
                                GANNETZ Technologies Private Limited is a specialized engineering services firm that helps enterprise technology leaders scale innovation-critical teams without the friction of traditional hiring.
                            </p>
                            <p>
                                Founded by engineers who've built production systems in AI, automotive embedded systems, and cloud infrastructure, we understand the difference between coding and engineering.
                            </p>
                            <p className="text-secondary font-bold">
                                We don't compete on price. We compete on the depth of expertise, speed of deployment, and quality of engineering talent.
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface p-8 lg:p-12 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-primary mb-8">Our Core Approach</h3>
                        <ul className="space-y-8">
                            {[
                                { title: 'Specialization Over Generalization', desc: 'We serve three domains deeply: AI/ML systems, EV/embedded engineering, and cloud-native architecture.', icon: <Target className="text-secondary" /> },
                                { title: 'Senior Talent, Not Training Programs', desc: 'Average engineer experience: 5+ years. We don\'t use client projects as training grounds.', icon: <Users className="text-secondary" /> },
                                { title: 'Process Discipline', desc: 'Documented standards for security, code quality, and knowledge transfer.', icon: <Shield className="text-secondary" /> }
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <div className="shrink-0">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                                        <p className="text-sm text-foreground/60">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            <Section variant="surface">
                <div className="mb-16">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Leadership</h2>
                    <h3 className="text-3xl font-bold text-primary">Technical Visionaries</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 max-w-4xl">
                    <div className="flex flex-col bg-white p-8 rounded-lg border border-border shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-2xl font-bold text-primary">Mohan Rao P</h4>
                                <a href="https://www.linkedin.com/in/mohan-rao-pachava?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                            <p className="text-secondary font-medium mb-1">Founder & Chief Technology Officer</p>
                            <p className="text-foreground/40 text-sm mb-6">Expert in AI Agents, BESS Systems & Automotive Software</p>
                            <p className="text-foreground/70 text-sm leading-relaxed mb-6">
                                With a vision to modernize engineering staff augmentation, Mohan Rao P brings deep expertise in complex system architecture. Having worked across niche domains including GenAI and EV systems, he ensures that every engineer at GANNETZ meets the highest technical standards required by global conglomerates.
                            </p>
                            <div className="flex gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Technical Focus:</span>
                                <span className="text-xs text-foreground/60 font-mono">BESS Systems • AI Agents • Automotive Linux</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section>
                <div className="border-t border-border pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Legal Entity</h4>
                        <p className="text-sm font-medium text-primary">GANNETZ Technologies Private Limited</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">CIN</h4>
                        <p className="text-sm font-medium text-primary">[Corporate ID Number]</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Registered Office</h4>
                        <p className="text-sm font-medium text-primary">Hyderabad, Telangana, India</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Certifications</h4>
                        <p className="text-sm font-medium text-primary">MSME Registered • Startup India Recognized</p>
                    </div>
                </div>
            </Section>
        </div>
    );
}
