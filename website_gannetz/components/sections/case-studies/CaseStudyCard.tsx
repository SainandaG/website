'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';

interface CaseStudyProps {
    id: string;
    title: string;
    image?: string;
    client: string;
    challenge: string;
    solution: string;
    team: string[];
    outcomes: string[];
    techStack: string[];
    duration: string;
}

export function CaseStudyCard({
    title, image, client, challenge, solution, team, outcomes, techStack, duration
}: CaseStudyProps) {
    return (
        <Card className="mb-12 overflow-hidden border-border/60 group hover:border-primary/50 transition-all shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="relative h-64 lg:h-auto overflow-hidden border-r border-border/60">
                    {image && (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 to-transparent" />
                </div>
                <div className="lg:col-span-1 p-8 lg:p-12">
                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Case Study</p>
                        <h3 className="text-3xl font-bold text-primary">{title}</h3>
                        <p className="text-foreground/40 text-sm">{client}</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">The Challenge</h4>
                                <p className="text-foreground/70 text-sm leading-relaxed">{challenge}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">GANNETZ Solution</h4>
                                <p className="text-foreground/70 text-sm leading-relaxed">{solution}</p>
                                <ul className="mt-3 space-y-1">
                                    {team.map((m, i) => (
                                        <li key={i} className="text-xs font-medium text-primary">• {m}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">The Outcomes</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                {outcomes.map((outcome, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-foreground/70 text-sm">
                                        <CheckCircle2 size={16} className="mt-0.5 text-success shrink-0" />
                                        <span>{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface p-8 lg:p-12 border-l border-border">
                    <div className="mb-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-white border border-border rounded text-xs font-medium text-primary">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Duration</h4>
                        <p className="text-sm text-foreground/60">{duration}</p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border/50">
                        <p className="text-xs text-foreground/40 leading-relaxed">
                            * Architecture diagrams and detailed technical documentation available upon request with a Capability Deck.
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
