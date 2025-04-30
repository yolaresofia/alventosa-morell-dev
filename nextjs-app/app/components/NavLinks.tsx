"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = {
  navLinks: { href: string; label: string }[];
};

export default function NavLinks({ navLinks }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex fixed bottom-4 left-4 z-40 text-sm">
      {navLinks.map((link, idx) => {
        const isActive = pathname === link.href;

        return (
          <span key={idx} className="flex items-center">
            <Link
              href={link.href}
              className={`hover:underline ${isActive ? "text-red-500" : ""}`}
            >
              {link.label}
            </Link>
            {idx !== navLinks.length - 1 && <span>,&nbsp;</span>}
          </span>
        );
      })}
    </nav>
  );
}
