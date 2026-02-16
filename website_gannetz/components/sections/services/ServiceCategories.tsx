'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Cpu, Cloud, Zap, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const categories = [
    {
        id: 'ai',
        title: 'AI & Data Engineering Talent',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        icon: <Cpu className="text-secondary" />,
        roles: [
            'Machine Learning Engineers',
            'Data Scientists & Analysts',
            'MLOps & AI Infrastructure Engineers',
            'GenAI Application Developers',
            'AI Governance & Ethics Specialists',
            'Computer Vision Engineers',
        ],
        skills: 'Python, TensorFlow, PyTorch, LangChain, Hugging Face, MLflow, Kubeflow, Snowflake, Databricks',
    },
    {
        id: 'cloud',
        title: 'Cloud & DevOps Engineering',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        icon: <Cloud className="text-secondary" />,
        roles: [
            'AWS/GCP/Azure Solution Architects',
            'Kubernetes & Container Orchestration Experts',
            'CI/CD Automation Engineers',
            'Infrastructure-as-Code Specialists',
            'Site Reliability Engineers (SRE)',
            'Cloud Security Engineers',
        ],
        skills: 'Kubernetes, Docker, Terraform, Ansible, Jenkins, GitLab CI, AWS/GCP/Azure services, Prometheus, Grafana',
    },
    {
        id: 'embedded',
        title: 'Embedded & EV Systems Engineering',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        icon: <Zap className="text-secondary" />,
        roles: [
            'Linux Embedded Developers (Yocto, Buildroot)',
            'Battery Management System (BMS) Engineers',
            'Vehicle HMI & OpenGL ES Developers',
            'AUTOSAR & Automotive Software Engineers',
            'Real-Time Operating Systems (RTOS) Experts',
            'CAN/LIN Protocol Specialists',
        ],
        skills: 'C/C++, Linux Kernel, Yocto, Qt/QML, OpenGL ES, AUTOSAR, CAN, Embedded Linux',
    },
    {
        id: 'enterprise',
        title: 'Enterprise Application Development',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
        icon: <Laptop className="text-secondary" />,
        roles: [
            'Python/Java Backend Architects',
            'React/Angular Frontend Engineers',
            'Flutter/React Native Mobile Developers',
            'ERP Integration Specialists (SAP/Oracle)',
            'API & Microservices Architects',
            'Database Engineers (PostgreSQL, MongoDB, Oracle)',
        ],
        skills: 'Python, Java, Spring Boot, React, Node.js, Flutter, PostgreSQL, MongoDB, Redis, Kafka',
    },
];

import Image from 'next/image';

export function ServiceCategories() {
    const [openId, setOpenId] = React.useState<string | null>('ai');

    return (
        <div className="space-y-4">
            {categories.map((cat) => (
                <Card key={cat.id} className="p-0 overflow-hidden">
                    <button
                        onClick={() => setOpenId(openId === cat.id ? null : cat.id)}
                        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-surface"
                    >
                        <div className="flex items-center gap-4">
                            {cat.icon}
                            <h3 className="text-xl font-bold text-primary">{cat.title}</h3>
                        </div>
                        {openId === cat.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {openId === cat.id && (
                        <div className="border-t border-border p-8 bg-white">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="relative h-64 lg:h-auto rounded-xl overflow-hidden shadow-lg">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
                                </div>
                                <div className="lg:col-span-1">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Key Roles</h4>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {cat.roles.map((role) => (
                                            <li key={role} className="flex items-center gap-2 text-foreground/70 text-sm font-medium">
                                                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                                                {role}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="lg:col-span-1">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Core Skills</h4>
                                    <p className="text-foreground/70 leading-relaxed bg-surface p-6 rounded-xl font-mono text-sm border border-border">
                                        {cat.skills}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
