"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function HeaderNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const links = useMemo(() => (
        [
            { href: "/", label: "Inicio" },
            { href: "/perdidos", label: "Extraviados" },
            { href: "/adopciones", label: "Adopciones" },
        ]
    ), []);

    const desktopLinkClass = (href: string) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return [
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-blue-700",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
        ].join(" ");
    };

    const mobileLinkClass = (href: string) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return [
            "py-2 px-3 rounded-lg",
            active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-blue-700",
        ].join(" ");
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    🐾 Mi Amigo Fiel
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-2">
                    {links.map((l) => (
                        <Link key={l.href} className={desktopLinkClass(l.href)} href={l.href}>
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <div className="md:hidden">
                    <button
                        aria-label={open ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-gray-200">
                    <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                onClick={() => setOpen(false)}
                                href={l.href}
                                className={mobileLinkClass(l.href)}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
