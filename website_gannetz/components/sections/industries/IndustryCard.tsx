'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

import Image from 'next/image';

interface IndustryProps {
    title: string;
    image?: string;
    icon: React.ReactNode;
    challenge: string;
    solution: string;
    projects: string[];
}

export function IndustryCard({ title, image, icon, challenge, solution, projects }: IndustryProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <Card className="p-0 overflow-hidden border-border/60 hover:border-primary/50 transition-all group">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between p-8 text-left transition-colors hover:bg-surface"
            >
                <div className="flex items-center gap-6">
                    <div className="text-secondary group-hover:text-primary transition-colors">{icon}</div>
                    <h3 className="text-2xl font-bold text-primary">{title}</h3>
                </div>
                {isExpanded ? <ChevronUp size={24} className="text-primary" /> : <ChevronDown size={24} className="text-foreground/40" />}
            </button>

            {isExpanded && (
                <div className="border-t border-border p-8 bg-white space-y-12 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {image && (
                            <div className="relative h-64 lg:h-auto rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
                            </div>
                        )}
                        <div className="space-y-10">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-4">Core Challenge</h4>
                                <p className="text-secondary/80 font-bold leading-relaxed text-xl leading-snug">
                                    "{challenge}"
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-4">GANNETZ Solution</h4>
                                <p className="text-primary font-bold leading-relaxed text-lg">
                                    {solution}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-4">Relevant Projects</h4>
                                <ul className="grid grid-cols-1 gap-4">
                                    {projects.map((project, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-secondary/60 font-semibold group/item">
                                            <div className="shrink-0 h-2 w-2 rounded-full bg-primary mt-2 transition-transform group-hover/item:scale-125" />
                                            <span>{project}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
