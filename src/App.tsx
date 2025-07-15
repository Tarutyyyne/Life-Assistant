import React, { useEffect, useState } from "react";

// --- Clock コンポーネント ---
// 現在時刻を1秒ごとに更新して表示するコンポーネント
// Clockというコンポーネントが受け取る props（引数のようなもの）を定義
type ClockDisplayProps = {
  className?: string;
};
const Clock: React.FC<ClockDisplayProps> = ({ className }) => {
  // 親から受け取ったclassNameを取得
  // time: 表示する現在時刻を保持する状態 (state)
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString("ja-JP", { hour12: false })
  );

  // useEffect: コンポーネントが描画されたあとに一度だけ実行する処理を定義
  // setTime(...)を呼び出すたびに、Reactは状態の変更を検知し再レンダリングをする
  useEffect(() => {
    // setInterval: １秒（１０００ミリ秒）事に中の関数を呼び出して timeを更新
    const timerID = setInterval(() => {
      setTime(new Date().toLocaleTimeString("ja-JP", { hour12: false }));
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  return <p className={className}>{time}</p>;
};

// --- DateDisplay コンポーネント ---
type DateDisplayProps = {
  className?: string;
};
const DateDisplay: React.FC<DateDisplayProps> = ({ className }) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const today = new Date().toLocaleDateString("ja-JP", dateOptions);

  return <p className={className}>{today}</p>;
};

type CountdownTimerProps = {
  initialSeconds: number; // タイマーの初期値を秒単位で受け取る
  className?: string;
};
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  className,
}) => {
  // 残り時間をstateで管理
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    // 残り時間が0秒以下になったらタイマーを停止
    if (seconds <= 0) {
      return;
    }
    // 1秒ごとに残り時間を1ずつ減らす
    const timerId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // コンポーネントが不要になったらタイマーを解除
    return () => clearInterval(timerId);
  }, [seconds]); // secondsが変更されるたびにeffectを再実行

  // 秒数を HH:MM:SS 形式の文字列に変換する関数
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={className}>
      {seconds > 0 ? (
        // 残り時間がある場合は、フォーマットして表示
        <p>{formatTime(seconds)}</p>
      ) : (
        // 残り時間が0になったらメッセージを表示
        <p>時間です！</p>
      )}
    </div>
  );
};

// ---ページコンポーネント---

// ---起床前のホームページ---
type HomePageProps = {
  onWakeUp: () => void; // ボタンが押されたことを親に伝えるための関数
};

const HomePage: React.FC<HomePageProps> = ({ onWakeUp }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-around text-center p-6">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-300">
          おはようございます
        </h1>
      </div>
      <div className="flex flex-col items-center gap-4">
        <DateDisplay className="text-lg sm:text-xl font-semibold text-slate-400" />
        <Clock className="text-6xl sm:text-7xl font-mono font-bold tracking-wider text-slate-100" />
      </div>
      <div>
        <button
          onClick={onWakeUp} // 親から渡された関数を呼ぶ
          className="w-full max-w-xs px-8 py-4 bg-sky-500 text-white text-2xl font-bold rounded-xl shadow-lg transition-transform duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300/50"
        >
          起床
        </button>
      </div>
    </div>
  );
};

// ---起床後のダッシュボードページ---
const DashboardPage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // マウントされた直後に visible を true にしてアニメーションを開始
    const timer = setTimeout(() => setVisible(true), 10); // わずかな遅延でCSS transitionを確実に発火させる
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`h-screen flex flex-col p-6 transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <header className="mb-8">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">残り支度時間</h2>
          <CountdownTimer
            initialSeconds={3600} // 1時間 = 3600秒
            className="text-5xl font-mono font-bold text-green-400"
          />
        </div>
      </header>
      <main className="flex-grow flex flex-col gap-6">
        {/* <div className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">今日のタスク</h2>
          <ul className="list-disc list-inside text-slate-300">
            <li>メールをチェックする</li>
            <li>プロジェクトAのドキュメント作成</li>
            <li>チームミーティング (14:00)</li>
          </ul>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">天気予報</h2>
          <p className="text-slate-300">晴れ時々曇り、最高気温25℃</p>
        </div> */}
      </main>
    </div>
  );
};

// --- App コンポーネント (スマホ表示最適化) ---
function App() {
  // 'home' か 'dashboard' のどちらかを表示するかを管理
  const [view, setView] = useState<"home" | "dashboard">("home");

  // 起床ボタンが押されたらviewを'dashboard'に切り替える
  const handleWakeUp = () => {
    setView("dashboard");
  };

  return (
    <div className="bg-slate-900 text-white font-sans">
      {/* viewの状態に応じて表示するコンポーネントを切り替える */}
      {view === "home" ? (
        <HomePage onWakeUp={handleWakeUp} />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

export default App;
