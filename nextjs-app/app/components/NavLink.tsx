import Link from "next/link";

type Props = {
  href: string;
  label: string;
  isActive: boolean;
  isLast: boolean;
};

/**
 * Single desktop nav link rendered server-side so labels, hrefs and the active
 * state ship in the initial HTML for crawlers.
 */
export default function NavLink({ href, label, isActive, isLast }: Props) {
  return (
    <span className="flex items-center md:text-base text-sm monitor:text-xl">
      <Link
        href={href}
        className={`md:text-base text-sm monitor:text-xl ${isActive ? "text-red-500" : ""}`}
      >
        {label}
      </Link>
      {!isLast && <span>,&nbsp;</span>}
    </span>
  );
}
