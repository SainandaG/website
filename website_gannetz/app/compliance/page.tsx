'use client';

import { Shield, Lock, FileCheck, Users, Search, Code, CheckCircle } from 'lucide-react';

import { Section } from '@/components/ui/Section';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

export default function CompliancePage() {
    return (
        <div className="pt-20">
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1600"
                    alt="Secure Infrastructure"
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
                            Enterprise <br />
                            <span className="text-primary">Trust.</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
                            Built on rigor. Sustained by world-class standards <br />
                            in security and governance.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <Section>
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-secondary mb-8 tracking-tight">Security Framework</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Card className="border-secondary/10 shadow-lg p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-secondary/5 rounded-xl text-secondary border border-secondary/10"><Lock size={28} /></div>
                                <CardTitle className="m-0 text-2xl font-black text-secondary">Data Protection</CardTitle>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'ISO 27001 principles implementation',
                                    'End-to-end encryption for data in transit and at rest',
                                    'Secure development lifecycle (SDLC) practices',
                                    'Regular security audits and vulnerability assessments'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-secondary/80 text-base font-semibold">
                                        <CheckCircle size={18} className="mt-1 text-primary shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card className="border-secondary/10 shadow-lg p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-secondary/5 rounded-xl text-secondary border border-secondary/10"><Shield size={28} /></div>
                                <CardTitle className="m-0 text-2xl font-black text-secondary">Access Control</CardTitle>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Role-based access control (RBAC)',
                                    'Multi-factor authentication (MFA)',
                                    'VPN and secure communication channels',
                                    'Device management and monitoring'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-secondary/80 text-base font-semibold">
                                        <CheckCircle size={18} className="mt-1 text-primary shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-4xl font-black text-secondary mb-8 tracking-tight">Intellectual Property Protection</h2>
                    <div className="bg-white rounded-3xl p-10 border-2 border-secondary/5 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: 'NDA & IP Assignment', desc: 'Comprehensive non-disclosure and intellectual property assignment agreements with all engineers.' },
                                { title: 'Code Access Control', desc: 'Granular repository access controls with multi-layered authentication.' },
                                { title: 'Clean-Room Protocols', desc: 'Isolated development environments for highly sensitive enterprise projects.' }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <h4 className="font-black text-primary text-xl mb-4">{item.title}</h4>
                                    <p className="text-secondary/70 text-base font-semibold leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h2 className="text-2xl font-black text-secondary mb-8 flex items-center gap-3 tracking-tight">
                            <FileCheck className="text-primary" size={28} /> Compliance
                        </h2>
                        <div className="space-y-6">
                            <div className="p-6 border-2 border-secondary/5 rounded-2xl bg-white shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-2">Current Status</p>
                                <p className="text-base text-secondary font-black">GST Registered, MSME Certified, Financial Transparency</p>
                            </div>
                            <div className="p-6 border-2 border-secondary/5 rounded-2xl bg-white border-dashed">
                                <p className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-2">Roadmap</p>
                                <p className="text-base text-secondary/60 font-black">ISO 27001:2013, ISO 9001:2015</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-secondary mb-8 flex items-center gap-3 tracking-tight">
                            <Users className="text-primary" size={28} /> Vetting
                        </h2>
                        <ul className="space-y-4">
                            {[
                                'Criminal background checks',
                                'Employment history verification',
                                'Educational credential verification',
                                'Reference checks from previous employers'
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-secondary/80 text-base font-semibold">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-secondary mb-8 flex items-center gap-3 tracking-tight">
                            <Code className="text-primary" size={28} /> Code Governance
                        </h2>
                        <ul className="space-y-4">
                            {[
                                'Peer code review requirements',
                                'Automated testing standards',
                                'Documentation requirements',
                                'Version control protocols'
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-secondary/80 text-base font-semibold">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>
        </div>
    );
}
