import "./hoja-de-estilos/TresEnRaya.css";
import React, { useState, useEffect } from "react";

const TresEnRaya = () => {
  const [board, setBoard] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [player1Symbol, setPlayer1Symbol] = useState("🌟"); // Símbolo del jugador 1
  const [player2Symbol, setPlayer2Symbol] = useState("❤️"); // Símbolo del jugador 2
  const [bombs, setBombs] = useState([]); // Ubicaciones de las bombas
  const [revealedBombs, setRevealedBombs] = useState([]); // Bombas reveladas
  const [player1Bombs, setPlayer1Bombs] = useState(0); // Bombas recibidas por el jugador 1
  const [player2Bombs, setPlayer2Bombs] = useState(0); // Bombas recibidas por el jugador 2
  const [player1Wins, setPlayer1Wins] = useState(0); // Partidas ganadas por el jugador 1
  const [player2Wins, setPlayer2Wins] = useState(0); // Partidas ganadas por el jugador 2

  // Efecto para inicializar el tablero con bombas
  useEffect(() => {
    const initialBoard = initializeBoard();
    setBoard(initialBoard);
  }, []);

  const initializeBoard = () => {
    const bombLocations = getRandomBombLocations();
    const newBoard = Array(16).fill(null); // Tablero de 4x4 (16 casillas)
    setBombs(bombLocations);

    return newBoard;
  };

  const getRandomBombLocations = () => {
    // Genera ubicaciones aleatorias para las bombas
    const bombLocations = [];
    while (bombLocations.length < 4) {
      const randomIndex = Math.floor(Math.random() * 16);
      if (!bombLocations.includes(randomIndex)) {
        bombLocations.push(randomIndex);
      }
    }
    return bombLocations;
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [1, 2, 3],
      [4, 5, 6],
      [5, 6, 7],
      [8, 9, 10],
      [9, 10, 11],
      [12, 13, 14],
      [13, 14, 15],
      [0, 4, 8],
      [4, 8, 12],
      [1, 5, 9],
      [5, 9, 13],
      [2, 6, 10],
      [6, 10, 14],
      [3, 7, 11],
      [7, 11, 15],
      [0, 5, 10],
      [5, 10, 15],
      [3, 6, 9],
      [6, 9, 12],
      [3, 5, 7],
      [0, 6, 12],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const handleClick = (index) => {
    if (
      calculateWinner(board) ||
      board[index] ||
      revealedBombs.includes(index)
    ) {
      return;
    }
    if (bombs.includes(index)) {
      // El jugador hizo clic en una bomba, muestra el emoticono de la bomba y cuenta la bomba recibida
      const newRevealedBombs = revealedBombs.slice();
      newRevealedBombs.push(index);

      if (xIsNext) {
        setPlayer1Bombs(player1Bombs + 1);
        if (player1Bombs + 1 >= 2) {
          setPlayer2Wins(player2Wins + 1); // Punto para el jugador 2
          alert("¡El jugador 1 ha perdido por recibir 2 bombas!");
          setBoard(Array(16).fill(null)); // Reiniciar el tablero
          setRevealedBombs([]);
          setPlayer1Bombs(0);
          setPlayer2Bombs(0);
          return;
        }
        setXIsNext(false); // Pasa el turno al jugador 2
      } else {
        setPlayer2Bombs(player2Bombs + 1);
        if (player2Bombs + 1 >= 2) {
          setPlayer1Wins(player1Wins + 1); // Punto para el jugador 1
          alert("¡El jugador 2 ha perdido por recibir 2 bombas!");
          setBoard(Array(16).fill(null)); // Reiniciar el tablero
          setRevealedBombs([]);
          setPlayer1Bombs(0);
          setPlayer2Bombs(0);
          return;
        }
        setXIsNext(true); // Pasa el turno al jugador 1
      }

      setRevealedBombs(newRevealedBombs);
    } else {
      // El jugador hace clic en una casilla normal
      const newBoard = board.slice();
      newBoard[index] = xIsNext ? player1Symbol : player2Symbol;

      setBoard(newBoard);
      const winner = calculateWinner(newBoard);
      if (winner) {
        if (winner === player1Symbol) {
          setPlayer1Wins(player1Wins + 1);
        } else if (winner === player2Symbol) {
          setPlayer2Wins(player2Wins + 1);
        }
      }
      setXIsNext(!xIsNext); // Cambia el turno aquí
    }
  };

  const handleRestart = () => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setXIsNext(true);
    setRevealedBombs([]);
    setPlayer1Bombs(0);
    setPlayer2Bombs(0);
  };

  const handleResetScore = () => {
    setPlayer1Wins(0);
    setPlayer2Wins(0);
  };

  const renderSquare = (index) => {
    let squareContent = board[index];
    if (revealedBombs.includes(index)) {
      squareContent = "💣";
    }

    return (
      <button className="square" onClick={() => handleClick(index)}>
        {squareContent}
      </button>
    );
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Ganador: ${winner}`;
  } else if (board.every((square) => square) || revealedBombs.length === 4) {
    status = "Es un...empate!!";
  } else {
    status = `Siguiente Jugador: ${xIsNext ? player1Symbol : player2Symbol}`;
  }

  return (
    <div className="tres-en-raya">
      <div className="status">{status}</div>
      <div className="scoreboard">
        <div className="player-score">
          <p>Jugador 1</p>
          <p>{player1Wins}</p>
        </div>
        <div className="player-score">
          <p>Jugador 2</p>
          <p>{player2Wins}</p>
        </div>
      </div>
      <div className="board">
        {Array.from({ length: 4 }, (_, row) => (
          <div className="board-row" key={row}>
            {Array.from({ length: 4 }, (_, col) => renderSquare(row * 4 + col))}
          </div>
        ))}
      </div>
      <br />
      <div className="symbol-selection">
        <label className="label">Jugador 1:</label>
        <select
          value={player1Symbol}
          onChange={(e) => setPlayer1Symbol(e.target.value)}
        >
          {["🌟", "❤️", "😎", "🐱", "🐶"].map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>{" "}
        <br />
        <label className="label">Jugador 2:</label>
        <select
          value={player2Symbol}
          onChange={(e) => setPlayer2Symbol(e.target.value)}
        >
          {["🌟", "❤️", "😎", "🐱", "🐶"].map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div className="restart-buttons-container">
        <button className="restart-button" onClick={handleRestart}>
          Reiniciar
        </button>
        <button className="reset-score-button" onClick={handleResetScore}>
          Reiniciar Marcadores
        </button>
      </div>
    </div>
  );
};

export default TresEnRaya;
