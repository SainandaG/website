import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const footerLinks = [
    {
        title: 'Services',
        links: [
            { name: 'Staff Augmentation', href: '/services' },
            { name: 'AI & Data Engineering', href: '/services#ai' },
            { name: 'Cloud & DevOps', href: '/services#cloud' },
            { name: 'Embedded & EV', href: '/services#embedded' },
        ],
    },
    {
        title: 'Industries',
        links: [
            { name: 'Automotive & EV', href: '/industries#automotive' },
            { name: 'Energy & Utilities', href: '/industries#energy' },
            { name: 'Financial Services', href: '/industries#finance' },
            { name: 'Healthcare Technology', href: '/industries#healthcare' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About Us', href: '/about' },
            { name: 'Compliance & Security', href: '/compliance' },
            { name: 'Case Studies', href: '/case-studies' },
            { name: 'Contact', href: '/contact' },
        ],
    },
];

import { Logo } from '@/components/ui/Logo';

export function Footer() {
    return (
        <footer className="border-t border-border bg-white py-16 lg:py-24">
            <Container>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="mb-6 block">
                            <Logo className="!items-start" />
                        </Link>
                        <p className="mb-6 text-sm leading-relaxed text-foreground/60 max-w-xs">
                            Enterprise engineering talent on demand. Specialized in AI, EV systems, and cloud-native infrastructure. Headquartered in Hyderabad, Telangana.
                        </p>
                    </div>
                    <div className="grid col-span-1 grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
                        {footerLinks.map((group) => (
                            <div key={group.title}>
                                <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-black">
                                    {group.title}
                                </h4>
                                <ul className="space-y-4">
                                    {group.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-black transition-colors hover:text-black"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-black">
                        © {new Date().getFullYear()} GANNETZ Technologies Private Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-black">
                        <Link href="#" className="hover:text-black">Privacy Policy</Link>
                        <Link href="#" className="hover:text-black">Terms of Service</Link>
                        <Link href="#" className="hover:text-black">Cookie Policy</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
