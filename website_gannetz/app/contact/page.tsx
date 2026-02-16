'use client';

import { Mail, Phone, MapPin, Download, Calendar, Linkedin, ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
    return (
        <div className="pt-20">
            <Section variant="dark" className="py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Let's Discuss Your Talent Needs</h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                    Request a consultation with our technology leads to map your requirements to our senior engineering pool.
                </p>
            </Section>

            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-primary mb-8">Enterprise Inquiry</h2>
                        <Card className="p-8">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Full Name*</label>
                                    <input type="text" className="w-full p-2.5 rounded border border-border focus:border-primary outline-none transition-colors text-secondary font-medium" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Company Name*</label>
                                    <input type="text" className="w-full p-2.5 rounded border border-border focus:border-primary outline-none transition-colors text-secondary font-medium" placeholder="Hinduja Group" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Corporate Email*</label>
                                    <input type="email" className="w-full p-2.5 rounded border border-border focus:border-primary outline-none transition-colors text-secondary font-medium" placeholder="john@company.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Industry Sector*</label>
                                    <select className="w-full p-2.5 rounded border border-border focus:border-primary outline-none transition-colors bg-white text-secondary font-medium">
                                        <option>Automotive</option>
                                        <option>Energy</option>
                                        <option>Financial Services</option>
                                        <option>Healthcare</option>
                                        <option>IT Services</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-secondary">Required Expertise*</label>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {['AI/ML', 'Cloud/DevOps', 'Embedded/EV', 'Enterprise Apps'].map(skill => (
                                            <label key={skill} className="flex items-center gap-2 text-sm text-secondary font-bold">
                                                <input type="checkbox" className="accent-primary h-4 w-4" />
                                                {skill}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-secondary">Project Details</label>
                                    <textarea className="w-full p-2.5 rounded border border-border focus:border-primary outline-none transition-colors h-32 text-secondary font-medium" placeholder="Briefly describe your talent gaps or project timelines" />
                                </div>
                                <div className="md:col-span-2">
                                    <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold">
                                        Request Consultation
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-black text-secondary mb-8 tracking-tight">Direct Contact</h3>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="shrink-0 p-3 bg-surface rounded-xl text-primary border border-border"><Mail size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-1">Inquiries</p>
                                        <a href="mailto:info@gannetz.com" className="text-lg font-bold text-secondary hover:text-primary transition-colors">info@gannetz.com</a>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 p-3 bg-surface rounded-xl text-primary border border-border"><Phone size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-1">Direct Line</p>
                                        <a href="tel:+917013988235" className="text-lg font-bold text-secondary hover:text-primary transition-colors">+91-7013988235</a>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 p-3 bg-surface rounded-xl text-primary border border-border"><MapPin size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-secondary/40 mb-1">Office Address</p>
                                        <p className="text-lg font-bold text-secondary leading-relaxed">Hyderabad, Telangana, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-secondary mb-8 tracking-tight">Quick Links</h3>
                            <div className="space-y-4">
                                <a href="/documents/Gannetz_Company_Profile.pdf" download className="flex items-center justify-between p-5 bg-white rounded-xl border border-border hover:border-primary transition-all text-base font-bold text-secondary group shadow-sm hover:shadow-md">
                                    <span className="flex items-center gap-3"><Download size={20} className="text-primary" /> Company Profile (PDF)</span>
                                    <ExternalLink size={16} className="text-secondary/40 group-hover:text-primary transition-colors" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-5 bg-white rounded-xl border border-border hover:border-primary transition-all text-base font-bold text-secondary group shadow-sm hover:shadow-md">
                                    <span className="flex items-center gap-3"><Calendar size={20} className="text-primary" /> Schedule Video Call</span>
                                    <ExternalLink size={16} className="text-secondary/40 group-hover:text-primary transition-colors" />
                                </a>
                                <a href="https://www.linkedin.com/in/mohan-rao-pachava?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white rounded-xl border border-border hover:border-primary transition-all text-base font-bold text-secondary group shadow-sm hover:shadow-md">
                                    <span className="flex items-center gap-3"><Linkedin size={20} className="text-primary" /> View LinkedIn</span>
                                    <ExternalLink size={16} className="text-secondary/40 group-hover:text-primary transition-colors" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
