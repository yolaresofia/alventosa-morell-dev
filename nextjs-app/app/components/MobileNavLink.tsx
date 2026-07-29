import Link from "next/link";

type Props = {
  href: string;
  label: string;
  isActive: boolean;
};

/**
 * Single mobile nav link rendered server-side so the active-state class is in
 * the initial HTML for crawlers and the link text is indexable.
 * The MobileNavShell wrapper handles the "close on click" interaction.
 */
export default function MobileNavLink({ href, label, isActive }: Props) {
  return (
    <Link
      href={href}
      className={`transition-colors ${isActive ? "text-red-500" : "hover:text-red-500"}`}
    >
      {label}
    </Link>
  );
}
