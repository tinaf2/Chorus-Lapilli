import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
let removed = false
let temp = null
function Board({xIsNext, squares, onPlay, currMove}) {

  let adjacentMap = new Map([
    [0, [1,3,4]],
    [1, [0,2,3,4,5]],
    [2, [1,4,5]],
    [3, [0,1,4,6,7]],
    [4, [0,1,2,3,5,6,7,8]],
    [5, [1,2,4,7,8]],
    [6, [3,4,7]],
    [7, [3,4,5,6,8]],
    [8, [4,5,7]]
  ]);

  let repeat = false


  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (currMove < 6) {  
      if (nextSquares[i]){
        return;
      }
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      onPlay(nextSquares, repeat);
    }
    else{
      if(xIsNext && nextSquares[4] === 'X')
      {
        if(i === 4){
          nextSquares[4] = null
          temp = 4
          repeat = true
          removed = true
          onPlay(nextSquares, repeat);
        }
      }
      else if(!xIsNext && nextSquares[4] === 'O')
      {
        if(i === 4){
          nextSquares[4] = null
          repeat = true
          removed = true
          temp = 4
          onPlay(nextSquares, repeat);
        }
      }
      else if(xIsNext && nextSquares[4] != 'X' && nextSquares[i] === 'X' && removed === false )
      {
        nextSquares[i] = null
        repeat = true
        removed = true
        temp = i
        onPlay(nextSquares, repeat);
      }
      else if(xIsNext && nextSquares[4] != 'X' && !nextSquares[i] && removed === true )
      {
        let b = true
        for(let j = 0; j < adjacentMap.get(temp).length; j++)
        {
          if(adjacentMap.get(temp)[j] === i) {b = false}
        }
        if (b === false){
        nextSquares[i] = 'X'
        repeat = false
        removed = false
        onPlay(nextSquares, repeat);}
      }
      else if(!xIsNext && nextSquares[4] != 'O' && nextSquares[i] === 'O' && removed === false )
      {
        nextSquares[i] = null
        repeat = true
        removed = true
        temp = i
        onPlay(nextSquares, repeat);
      }
      else if(!xIsNext && nextSquares[4] != 'O' && !nextSquares[i] && removed === true)
      {
        let b = true
        for(let j = 0; j < adjacentMap.get(temp).length; j++)
        {
          if(adjacentMap.get(temp)[j] === i) {b = false}
        }
        if (b === false){
        nextSquares[i] = 'O'
        repeat = false
        removed = false
        adjacentMap.get(temp)
        onPlay(nextSquares, repeat);}
      }
      else if (removed === true) {  
        if (nextSquares[i]){
          return;
        }
        if (xIsNext) {
          nextSquares[i] = 'X';
        } else {
          nextSquares[i] = 'O';
        }
        onPlay(nextSquares, repeat);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  let currentSquares = history[currentMove];

  function handlePlay(nextSquares, repeat) {
    if(repeat === false)
    {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }
    if(repeat === true){
      const nextHistory = [...history.slice(0, currentMove), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1); //maybe -1
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currMove = {currentMove} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


