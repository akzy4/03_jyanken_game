import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-black dark:to-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl p-8 md:p-12 border dark:border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-600 dark:text-orange-400 mb-8">
            概要
          </h1>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                じゃんけんゲームとは
              </h2>
              <p className="text-lg leading-relaxed">
                じゃんけんゲームは、コンピューターとじゃんけんで対戦できるシンプルなゲームです。
                グー、チョキ、パーの中から選択して、コンピューターと勝負しましょう！
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                遊び方
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-lg">
                <li>「じゃんけんゲーム」ページに移動します</li>
                <li>グー、チョキ、パーのいずれかを選択します</li>
                <li>コンピューターの選択と結果が表示されます</li>
                <li>スコアが自動的に更新されます</li>
                <li>「スコアをリセット」ボタンでスコアをリセットできます</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                ルール
              </h2>
              <ul className="list-disc list-inside space-y-2 text-lg">
                <li>グーはチョキに勝ちます</li>
                <li>チョキはパーに勝ちます</li>
                <li>パーはグーに勝ちます</li>
                <li>同じ手を出した場合は引き分けです</li>
              </ul>
            </section>

            <section className="pt-8">
              <div className="text-center">
                <Link
                  href="/game"
                  className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-lg px-8 py-3 hover:from-orange-500 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ゲームを始める
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
