"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Choice = "rock" | "paper" | "scissors" | null;
type Result = "win" | "lose" | "draw" | null;

export default function Game() {
  const [userChoice, setUserChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [scores, setScores] = useState({ user: 0, draw: 0, computer: 0 });
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const choices: { value: Choice; emoji: string; label: string }[] = [
    { value: "rock", emoji: "✊", label: "グー" },
    { value: "paper", emoji: "✋", label: "パー" },
    { value: "scissors", emoji: "✌️", label: "チョキ" },
  ];

  // 効果音を生成する関数
  const playSound = async (
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      // AudioContextがsuspend状態の場合はresume
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // 音声再生が失敗してもゲームは続行
      console.log("音声再生エラー:", error);
    }
  };

  // 選択肢ごとの効果音を再生
  const playChoiceSound = (choice: Choice) => {
    switch (choice) {
      case "rock":
        // グー: 低めの音、重厚な音色
        playSound(350, 0.15, "sawtooth");
        break;
      case "paper":
        // パー: 高めの音、柔らかい音色
        playSound(800, 0.12, "sine");
        break;
      case "scissors":
        // チョキ: 中くらいの音、鋭い音色
        playSound(600, 0.1, "square");
        break;
    }
  };

  const handleChoice = (choice: Choice) => {
    if (!choice) return;

    // アニメーション開始
    setIsAnimating(choice);
    // 選択肢に応じた効果音を再生
    playChoiceSound(choice);

    // アニメーション後にゲームロジックを実行
    setTimeout(() => {
      const computerRandomChoice: Choice =
        choices[Math.floor(Math.random() * choices.length)].value;

      setUserChoice(choice);
      setComputerChoice(computerRandomChoice);

      let gameResult: Result = null;
      if (choice === computerRandomChoice) {
        gameResult = "draw";
        setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
        // 引き分けの効果音
        setTimeout(() => playSound(400, 0.2, "sine"), 100);
      } else if (
        (choice === "rock" && computerRandomChoice === "scissors") ||
        (choice === "paper" && computerRandomChoice === "rock") ||
        (choice === "scissors" && computerRandomChoice === "paper")
      ) {
        gameResult = "win";
        setScores((prev) => ({ ...prev, user: prev.user + 1 }));
        // 勝利の効果音
        setTimeout(() => playSound(600, 0.3, "sine"), 100);
      } else {
        gameResult = "lose";
        setScores((prev) => ({ ...prev, computer: prev.computer + 1 }));
        // 負けの効果音
        setTimeout(() => playSound(300, 0.3, "sine"), 100);
      }

      setResult(gameResult);
      setIsAnimating(null);
    }, 200);
  };

  const resetScores = () => {
    setScores({ user: 0, draw: 0, computer: 0 });
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8">
        {/* ホームに戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 mb-6 transition-colors"
        >
          <span>🏠</span>
          <span>ホームに戻る</span>
        </Link>

        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center justify-center gap-2">
            <span>✂️</span>
            <span>ジャンケンゲーム</span>
            <span>✂️</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            吉田くんが作った最初のゲームです!
          </p>
        </div>

        {/* スコアボード */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">あなた</div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {scores.user}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">引き分け</div>
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                {scores.draw}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">コンピューター</div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {scores.computer}
              </div>
            </div>
          </div>
        </div>

        {/* 選択ボタン */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {choices.map((choice) => (
            <button
              key={choice.value}
              onClick={() => handleChoice(choice.value)}
              className={`aspect-square rounded-xl text-5xl md:text-6xl flex items-center justify-center transition-all hover:scale-105 shadow-lg relative overflow-hidden ${
                isAnimating === choice.value
                  ? "scale-110 ring-4 ring-orange-300 animate-button-press"
                  : ""
              } ${
                choice.value === "rock"
                  ? "bg-gradient-to-br from-orange-300 to-red-300 dark:from-orange-600 dark:to-red-600"
                  : choice.value === "paper"
                    ? "bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-600 dark:to-orange-600"
                    : "bg-gradient-to-br from-pink-300 to-red-300 dark:from-pink-600 dark:to-red-600"
              }`}
            >
              <span
                className={`transition-transform duration-200 ${
                  isAnimating === choice.value ? "scale-125 rotate-12" : ""
                }`}
              >
                {choice.emoji}
              </span>
            </button>
          ))}
        </div>

        {/* 結果表示 */}
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 mb-6 text-center min-h-[100px] flex items-center justify-center">
          {userChoice && computerChoice ? (
            <div className="space-y-4 animate-fade-in">
              <div className="text-lg text-gray-700 dark:text-gray-200 animate-slide-up">
                あなた: {choices.find((c) => c.value === userChoice)?.emoji}{" "}
                {choices.find((c) => c.value === userChoice)?.label}
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-200 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                コンピューター:{" "}
                {choices.find((c) => c.value === computerChoice)?.emoji}{" "}
                {choices.find((c) => c.value === computerChoice)?.label}
              </div>
              <div
                className={`text-2xl font-bold animate-bounce-in ${
                  result === "win"
                    ? "text-green-600 dark:text-green-400"
                    : result === "lose"
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-600 dark:text-yellow-400"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                {result === "win"
                  ? "あなたの勝ち！"
                  : result === "lose"
                    ? "コンピューターの勝ち！"
                    : "引き分け！"}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-lg">選択してください!</p>
          )}
        </div>

        {/* リセットボタン */}
        <div className="text-center">
          <button
            onClick={resetScores}
            className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white rounded-xl px-8 py-3 hover:from-orange-600 hover:to-red-600 dark:hover:from-orange-700 dark:hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            スコアをリセット
          </button>
        </div>
      </div>
    </div>
  );
}
