function Square(props) {

  const buttonClass = (props.value) ? 
                      (props.value === "red" ? "square red" : "square black") 
                      : "square"

  return (
      <button className={buttonClass} onClick={props.onClick}>
      </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(49).fill(null),
      xIsNext: true,
    };
  }

  

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || (squares[i] && squares[i%7])) {
      return;
    }
    console.log(squares, JSON.stringify(squares));
    let correctInsertionIndex = gravity(squares, i);
    console.log(correctInsertionIndex)
    squares[correctInsertionIndex] = this.state.xIsNext ? "red" : "blue";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    }, () => {
      let win = calculateWinner(squares);
      if(win) {
        alert("We have a winner", win)
      } 
    });

  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }
    
    const board = [];
    for(let i = 0; i < 7; i++) {
      let row = [];
      for(let y = i * 7; y < 7 * (i + 1); y++) {
        row.push(<div className="inline">{this.renderSquare(y)}</div>)
      }
      board.push(<div className="board-row">{row}</div>)
    }


    return (
      <div>
        <div className="status">{status}</div>
        <div className="boardCorner">
          {board}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }


// Soluzione poco elegante
function calculateWinner(squares) {
  // Trasformo l'array in una matrice
  // che rappresenta meglio il dato
  let matrix = new Array(7);
  for(let i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(7);
  }

  for(let i = 0; i < 7; i++) {
    for(let j = 0; j < 7; j++) {
      matrix[i][j] = squares[i*7+j]
    }
  }

  for(let row = 0;  row < 7; row++) {

    for(let col = 0; col < 7; col++) {
      let position = matrix[row][col];
      if(!position) {
        continue;
      }

      if (col + 3 < 7 &&
        position == matrix[row][col+1] && // look right
        position == matrix[row][col+2] &&
        position == matrix[row][col+3])
        return position;
      if (row + 3 < 7) {
        if (position == matrix[row+1][col] && // look up
            position == matrix[row+2][col] &&
            position == matrix[row+3][col])
            return position;
        if (col + 3 < 7 &&
            position == matrix[row+1][col+1] && // look up & right
            position == matrix[row+2][col+2] &&
            position == matrix[row+3][col+3])
            return position;
        if (col - 3 >= 0 &&
            position == matrix[row+1][col-1] && // look up & left
            position == matrix[row+2][col-2] &&
            position == matrix[row+3][col-3])
            return position;
      }
    }
  }
  return false

  console.log(matrix);
  
}


function gravity(squares, i) {
    console.log(squares, i)
    // Oltre i limiti del quadrato, ritorno false
    if(i < 0 || i > 48) {     
          console.log(1)

      return false;
    } 
    // // Square pieno, guardo in su
    if(squares[i]) {
      let x = i-7;
      return gravity(squares, x);
    }
    // // Se lo square sotto è vuoto
    if(!squares[i+7]) {
      // E lo square successivo non esiste (va oltre i limiti)
      // vuol dire che sto provando ad inserire in fondo e che 
      // lo square su cui voglio inserire è vuoto, in quanto 
      // con la condizione if(squares[i]) ho appena controllato 
      // se era pieno
      if(i+7 > 48) {
        return i;
      }

      // Se non è oltre i limiti vuol dire che ho spazio sotto, 
      // devo controllare quanto può cadere
      let x = i+7;
      return gravity(squares, x)
    }
    // // Se tutte queste condizioni vengono ignorate vuol dire che 
    // // ho risolto tutti i miei problemi e posso inserire 
     return i;
    
  }