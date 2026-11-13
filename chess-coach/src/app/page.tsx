import ChessBoard from "./components/ChessBoard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-black">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Chess Coach</h1>
        <div className="w-full max-w-xl">
          <ChessBoard />
      </div>
    </main>
  );
}