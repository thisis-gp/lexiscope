import { Scale } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex">
            <a href="/chatbot" className="flex-shrink-0 flex items-center">
              <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Lexiscope
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
