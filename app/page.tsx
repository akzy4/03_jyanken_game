import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-black dark:to-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl p-8 md:p-12 border dark:border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-600 dark:text-orange-400 mb-4">
            じゃんけんゲームへようこそ！
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
            吉田くんが作った最初のゲームです！
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link
              href="/game"
              className="bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-lg p-6 hover:from-orange-500 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold mb-2">🎮 ゲームを始める</h2>
              <p className="text-orange-50">
                コンピューターとじゃんけん対戦を楽しもう！
              </p>
            </Link>

            <Link
              href="/about"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white rounded-lg p-6 hover:from-yellow-500 hover:to-yellow-700 dark:hover:from-yellow-700 dark:hover:to-yellow-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold mb-2">📖 ゲームについて</h2>
              <p className="text-yellow-50">
                じゃんけんゲームの遊び方を確認しよう
              </p>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
