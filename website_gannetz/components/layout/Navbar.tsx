'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Industries', href: '/industries' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'About Us', href: '/about' },
];

import { Logo } from '@/components/ui/Logo';

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
            <Container>
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Logo orientation="horizontal" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    'text-sm font-bold transition-colors hover:text-primary',
                                    pathname === link.href ? 'text-primary' : 'text-secondary'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button variant="primary" size="sm" asChild>
                            <Link href="/contact" className="flex items-center gap-2">
                                Request Deck <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="rounded-md p-2 text-primary lg:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </Container>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="border-b border-border bg-white lg:hidden">
                    <nav className="flex flex-col space-y-4 p-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    'text-lg font-medium transition-colors',
                                    pathname === link.href ? 'text-secondary' : 'text-primary'
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button variant="primary" className="w-full" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/contact">Request Capability Deck</Link>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
