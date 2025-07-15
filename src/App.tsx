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

// --- App コンポーネント (スマホ表示最適化) ---
function App() {
  return (
    // 画面全体の高さを使い、Flexboxで3つのセクションを縦に均等配置します。
    // text-centerで中のテキストを中央揃えにしています。
    <main className="h-screen flex flex-col items-center justify-around bg-slate-900 text-white font-sans p-6 text-center">
      {/* 1. 挨拶セクション */}
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-300">
          おはようございます
        </h1>
      </div>

      {/* 2. 日付と時計セクション */}
      <div className="flex flex-col items-center gap-4">
        <DateDisplay className="text-lg sm:text-xl font-semibold text-slate-400" />
        <Clock className="text-6xl sm:text-7xl font-mono font-bold tracking-wider text-slate-100" />
      </div>

      {/* 3. ボタンセクション */}
      <div>
        {/* ボタンを大きく、タップしやすく設定 */}
        <button className="w-full max-w-xs px-8 py-4 bg-sky-500 text-white text-2xl font-bold rounded-xl shadow-lg transition-transform duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300/50">
          起床
        </button>
      </div>
    </main>
  );
}

export default App;
