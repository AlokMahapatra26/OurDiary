'use client'

import { Book, Code, X, Camera, Coffee, Heart, ExternalLink, Globe, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function AboutPage() {
    const socialLinks = [
        { name: 'GitHub', icon: Code, href: 'https://github.com/AlokMahapatra26', label: '@AlokMahapatra26' },
        { name: 'Twitter', icon: X, href: 'https://x.com/aloktwts', label: '@aloktwts' },
        { name: 'Instagram', icon: Camera, href: 'https://www.instagram.com/alok.torrent/', label: '@alok.torrent' },
    ]

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 pb-32">
            <div className="w-full max-w-md mx-auto p-4 space-y-8 animate-bouncy pt-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 rounded-3xl bg-white shadow-sm border border-gray-100 mb-2">
                        <Book className="h-10 w-10 text-primary fill-primary/10" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 font-serif">Meet The Creator</h1>
                        <p className="text-sm text-muted-foreground italic">A private sanctuary for your shared memories.</p>
                    </div>
                </div>


                {/* Connect */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <MessageCircle className="h-4 w-4 text-muted-foreground/60" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Connect with Alok</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-primary/5 transition-colors">
                                        <social.icon className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{social.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">{social.label}</span>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Support & Contribute */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Heart className="h-4 w-4 text-muted-foreground/60" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Support & Contribute</span>
                    </div>
                    <div className="space-y-3">
                        <Button asChild className="w-full h-12 rounded-2xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                            <a href="https://github.com/AlokMahapatra26" target="_blank" rel="noopener noreferrer">
                                <Code className="h-4 w-4 mr-2" />
                                Contribute on GitHub
                                <ExternalLink className="h-3 w-3 ml-2 opacity-50" />
                            </a>
                        </Button>

                        <Card className="border-border/40 shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                            <Coffee className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold">buymeacoffee.com/alokmahapatra</p>

                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">upi: 8849561649@upi</p>
                                        </div>
                                    </div>
                                    <link rel="stylesheet" href="buymeacoffee.com/alokmahapatra" />
                                    <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[10px] font-bold uppercase tracking-wider bg-white">
                                        Support
                                    </Button>

                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>


            </div>
        </div>
    )
}
