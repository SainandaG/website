import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className = "", orientation = "vertical" }: { className?: string, orientation?: "vertical" | "horizontal" }) {
    return (
        <div className={cn(
            "flex items-center gap-3",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className
        )}>
            <svg width="60" height="40" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                {/* Main Triangle Background */}
                <path d="M60 5 L110 70 L10 70 Z" fill="#FF6600" opacity="0.1" />

                {/* Three Triangles Composition */}
                <path d="M60 10 L85 50 L35 50 Z" fill="#FF6600" />
                <path d="M35 50 L60 80 L10 80 Z" fill="#FF6600" opacity="0.8" />
                <path d="M85 50 L110 80 L60 80 Z" fill="#FF6600" opacity="0.6" />

                {/* Dots */}
                <circle cx="48" cy="42" r="4" fill="#00BFFF" />
                <circle cx="60" cy="30" r="4" fill="#DC143C" />
                <circle cx="72" cy="42" r="4" fill="#000000" />
            </svg>
            <div className={cn(
                "flex flex-col",
                orientation === "vertical" ? "items-center mt-1" : "items-start"
            )}>
                <span className="text-xl font-black uppercase tracking-tighter text-secondary leading-none">GANNETZ</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-secondary/80">Technologies Pvt Ltd</span>
            </div>
        </div>
    );
}
