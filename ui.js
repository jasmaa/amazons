// React UI

// Main game
class Game extends React.Component {

	state = {
		height: 10,
		width: 10,
	};
	
    render() {
		const { height, width, mines } = this.state;
        return (
			<div className="game">
				<Board height={height} width={width} />
			</div>
		);
    }
}

// Cell
class Cell extends React.Component {

	render(){
		var iconClass = "";
		var style = {};
		var bgStyle = {};

		style["font-size"] = "3vw";

		switch(this.props.value){
			case cellState.BLACK:
				iconClass = "fas fa-chess-queen";
				style["color"] = 'black';
				break;
			case cellState.WHITE:
				iconClass = "fas fa-chess-queen";
				style["color"] = "white";
				break;
			case cellState.FIRE:
				iconClass = "fas fa-burn";
				style["color"] = "red";
				bgStyle["background-color"] = "lightgrey";
				break;
			case cellState.VALID:
				bgStyle["background-color"] = "green";
				break;
		}

		return(
			<div className="square" style={bgStyle} onClick={this.props.onClick}>
				<i className={iconClass} style={style}></i>
			</div>
		);
	}
}

// Board
class Board extends React.Component {

	constructor(props){
		super(props);
		this.amazons = new Amazons();

		this.setState({
			gameState: this.amazons.state,
		});
	}

	renderCell(row, col){
		return (<Cell value={this.amazons.board[row][col]} onClick={ () => {this.handleClick(row, col)} } />);
	}

	render(){
		var cells = [];
		for(var i = 0; i < this.amazons.board.length; i++){
            for(var j = 0; j < this.amazons.board[0].length; j++){
				cells.push(this.renderCell(i, j));
            }
		}

		return(
			<div className="grid-container">
				{cells}
			</div>
		);
	}

	handleClick(row, col){
		switch(this.amazons.state){
			case gameState.BLACK_IDLE:
				this.amazons.choosePiece(row, col);
				break;
			case gameState.WHITE_IDLE:
				this.amazons.choosePiece(row, col);
				break;
			case gameState.BLACK_MOVING:
				this.amazons.chooseMove(row, col);
				break;
			case gameState.WHITE_MOVING:
				this.amazons.chooseMove(row, col);
				break;
			case gameState.BLACK_FIRING:
				this.amazons.chooseFire(row, col);
				break;
			case gameState.WHITE_FIRING:
				this.amazons.chooseFire(row, col);
				break;
		}

		this.setState({
			gameState: this.amazons.state,
		});
	}
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
