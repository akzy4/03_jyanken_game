import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-orange-600 dark:text-orange-400"
              >
                じゃんけんゲーム
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                ホーム
              </Link>
              <Link
                href="/about"
                className="border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                概要
              </Link>
              <Link
                href="/game"
                className="border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                じゃんけんゲーム
              </Link>
              <Link
                href="/contact"
                className="border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                お問い合わせ
              </Link>
              <Link
                href="/devboard"
                className="border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                DevBoard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <div className="px-3 py-2 flex justify-end">
            <ThemeToggle />
          </div>
          <Link
            href="/"
            className="bg-gray-50 dark:bg-black border-orange-500 dark:border-orange-400 text-orange-700 dark:text-orange-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            ホーム
          </Link>
          <Link
            href="/about"
            className="border-transparent text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            概要
          </Link>
          <Link
            href="/game"
            className="border-transparent text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            じゃんけんゲーム
          </Link>
          <Link
            href="/contact"
            className="border-transparent text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            お問い合わせ
          </Link>
          <Link
            href="/devboard"
            className="border-transparent text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black hover:border-gray-300 dark:hover:border-gray-800 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            DevBoard
          </Link>
        </div>
      </div>
    </nav>
  );
}
