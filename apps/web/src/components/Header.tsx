import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-2 sm:p-3 md:p-4 flex gap-2 bg-white text-black justify-between shadow-sm">
      <nav className="flex flex-row">
        <div className="px-2 sm:px-3 font-bold text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
}
