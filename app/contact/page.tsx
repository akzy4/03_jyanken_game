"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム送信の処理（実際の実装ではAPIエンドポイントに送信）
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-black dark:to-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl p-8 md:p-12 border dark:border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-600 dark:text-orange-400 mb-4">
            お問い合わせ
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
            ご質問やご意見をお聞かせください
          </p>

          {submitted ? (
            <div className="bg-green-50 dark:bg-black border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <p className="text-green-700 dark:text-green-300 text-lg font-semibold">
                お問い合わせありがとうございます！
              </p>
              <p className="text-green-600 dark:text-green-400 mt-2">
                内容を確認次第、ご連絡いたします。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  お名前
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none"
                  placeholder="山田 太郎"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  メッセージ
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none resize-none"
                  placeholder="ご質問やご意見をご記入ください"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-lg px-8 py-3 hover:from-orange-500 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  送信する
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2">その他のお問い合わせ方法</p>
              <p className="text-sm">
                メール: support@jyanken-game.example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
