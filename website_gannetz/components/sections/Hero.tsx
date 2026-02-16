'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-white pt-32 pb-12 lg:pt-48 lg:pb-16">
            {/* Background Pattern - Logo Inspired Triangles */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100 L50 0 L100 100 Z" fill="url(#grad1)" />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF6600" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FF6600" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                ENTERPRISE ENGINEERING TALENT
                            </div>
                            <h1 className="mb-6 text-5xl font-black tracking-tighter text-secondary md:text-8xl leading-[0.95]">
                                Engineering <br />
                                Excellence. <br />
                                <span className="text-primary tracking-tight">On Demand.</span>
                            </h1>
                            <p className="mb-10 text-xl font-medium leading-relaxed text-secondary/80 max-w-xl">
                                Specialized AI, EV Systems, and Cloud Infrastructure engineers for conglomerates. We accelerate innovation without the overhead.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" asChild>
                                    <a href="/contact">Request Capability Deck</a>
                                </Button>
                                <Button variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary/5" asChild>
                                    <a href="/services">Explore Services</a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>


                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block flex-1 w-full max-w-[600px]"
                    >
                        <div className="aspect-[4/5] relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                            <Image
                                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200"
                                alt="Advanced Engineering Circuitry"
                                fill
                                className="object-cover hover:brightness-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                                    <span className="text-xs font-black tracking-[0.2em] uppercase text-white">Active Engagements</span>
                                </div>
                                <div className="text-3xl font-black text-white">35+ Technical Projects</div>
                                <div className="text-sm text-white/60 mt-2 font-medium">Powering the next generation of intelligent engineering</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </Container>
        </section>
    );
}
