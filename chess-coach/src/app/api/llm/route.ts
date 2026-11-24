import { Chess } from 'chess.js';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (typeof body?.fen !== 'string' || typeof body?.question !== 'string' || !body.question.trim() || body.question.length > 500) {
    return Response.json({ error: 'Send a board position and a question of up to 500 characters.' }, { status: 400 });
  }

  let boardContext;
  let suggestedMove: {
    piece: string;
    side: string;
    from: string;
    to: string;
    notation: string;
  } | null = null;
  try {
    const game = new Chess(body.fen);

    const pieceNames = {
      p: 'pawn',
      n: 'knight',
      b: 'bishop',
      r: 'rook',
      q: 'queen',
      k: 'king',
    };

    boardContext = {
      sideToMove: game.turn() === 'w' ? 'White' : 'Black',
      pieces: game
        .board()
        .flat()
        .flatMap(piece => {
          if (!piece) return [];

          const side = piece.color === 'w' ? 'White' : 'Black';
          return [`${side} ${pieceNames[piece.type]} on ${piece.square}`];
        }),
    };

    if (body.recommendedMove != null) {
      const move = body.recommendedMove;

      if (typeof move !== 'string' || !/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) {
        throw new Error('Invalid recommended move');
      }

      const played = game.move({
        from: move.slice(0, 2),
        to: move.slice(2, 4),
        promotion: move[4],
      });

      suggestedMove = {
        piece: pieceNames[played.piece],
        side: played.color === 'w' ? 'White' : 'Black',
        from: played.from,
        to: played.to,
        notation: played.san,
      };
    }
  } catch {
    return Response.json({ error: 'Invalid board position or recommended move.' }, { status: 400 });
  }

  try {
    const response = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
        stream: false,
        messages: [
          {
            role: 'system',
            content:
              'You are Move Explainer, a chess tutor for beginners. ' +
              "When the user asks about 'this move', refer to suggestedMove." +
              "Answer the player's latest question about the current board." +
              'Lead with the chess idea in two or three short sentences.' +
              'Use the supplied move facts for piece names, sides, and squares.' +
              'Say when there is too little evidence to explain a threat or outcome.' +
              JSON.stringify({
                currentPosition: body.fen,
                boardContext,
                suggestedMove,
              }),
          },
          { role: 'user', content: body.question.trim() },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);

    const data = await response.json();
    const explanation = data.message?.content;

    if (typeof explanation !== 'string' || !explanation.trim()) {
      throw new Error('Ollama returned an empty reply.');
    }

    return Response.json({ explanation: explanation.trim() });
  } catch (error) {
    console.error('Move Explainer:', error);

    return Response.json({ error: 'Could not get a reply. Check that Ollama is running.' }, { status: 502 });
  }
}
