# Chess Coach

 Word count: 404

Chess Coach is a browser-based prototype for beginners. Players compete against Stockfish, request move recommendations and ask an AI assistant to explain them.

## Project status

Implemented:
- Play as White or Black against Stockfish.
- Legal move validation.
- Game result messages.
- On-request recommendations with optional board highlighting.
- Move Explainer chat.
- Email sign-up and sign-in.
- Automatic saving of signed-in players’ games and conversations.
- History page showing saved moves and associated chats.

Planned: 
- Adaptive assistance
- Chess puzzles.

No features are simulated. 

## Technology stack

- Next.js, React and TypeScript: interface and server API.
- Tailwind CSS: styling.
- react-chessboard: interactive board.
- chess.js: move validation, positions and game results.
- Stockfish 19 lite: opponent moves and recommendations.
- Ollama with Qwen2.5:7b: locally generated explanations.
- Supabase: email authentication and database storage.

## Running locally

Requirements: Node.js compatible with the project’s Next.js version, npm, Ollama and a Supabase project.

Clone the repository and install dependencies:

```bash
git clone https://github.com/gfkllm1/chess-coach.git
cd chess-coach/chess-coach
npm install
```


Create .env.local in the application folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OLLAMA_MODEL=qwen2.5:7b
```


Run the SQL in history.sql using your Supabase SQL Editor. This creates the games and chat_messages tables and ownership policies. 

Install and start Ollama, then download the model:

```bash
ollama pull qwen2.5:7b
```

Start Next.js:

```bash
npm run dev
```

Open http://localhost:3000. Keep Ollama running for explanations. The API connects to Ollama on the Next.js server’s machine.


## Inspecting the prototype

Choose New Game, select a side and set highlighting. Play a legal move, request a recommendation, then open Move Explainer and ask why. Sign in to save activity automatically. Open History to inspect saved games and conversations.

## Development record

- Gameplay: connected the board to chess.js, then Stockfish. Checked legal moves, opponent turns and board orientation.
- Move recommendations: added on-request suggestions and optional board highlighting. Checked that highlighting followed the player’s chosen setting.
- Chat: supplied board context and validated move facts after explanations misidentified pieces. This improves context without guaranteeing correctness.
- Interface: adjusted dialogs, controls and chat placement to avoid covering the board.
- History and Saving: added authentication and automatic saving. Resolved missing database tables and checked that games and conversations appeared in History.


## AI assistance

I used ChatGPT for styling suggestions and debugging. It suggested Tailwind CSS classes for button sizes, spacing, dialog alignment and the chat panel layout. I adapted these suggestions to my black-and-white theme and adjusted the chat placement so it did not cover the chessboard. I checked changes through manual interaction and corrected issues found during testing. ChatGPT also helped draft this README.

## Acknowledgements

The prototype uses the libraries and models listed above. Dependency versions are recorded in package.json and package-lock.json.
