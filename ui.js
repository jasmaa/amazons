// React UI

/**
 * Main game
 */
class Game extends React.Component {
	
	constructor(props){
		super(props);
		this.amazons = new Amazons();

		this.setState({
			gameState: this.amazons.state,
		});
	}

    render() {
        return (
			<div className="container">
				<div className="row">
					<div className="col-8">
						<Board board={this.amazons.board} onClick={ (i, j) => this.handleClick(i, j) }/>
					</div>
					<div className="col-4">
						<div className="jumbotron">
							<MoveLog moves={this.amazons.moves} />
							<br />
							<button className="btn btn-primary" onClick={
								() => {
									this.amazons.reset();
									this.setState({
										gameState: this.amazons.state,
									});
								}
							}>RESET</button>
						</div>
					</div>
				</div>
				<br />
				<div className="row">
					<div className="col">
						<div className="jumbotron">
							<h3>{this.amazons.getStateName()}</h3>
						</div>
					</div>
				</div>
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
				this.amazons.detectEnd(cellState.BLACK);
				this.amazons.detectEnd(cellState.WHITE);
				break;
			case gameState.WHITE_FIRING:
				this.amazons.chooseFire(row, col);
				this.amazons.detectEnd(cellState.BLACK);
				this.amazons.detectEnd(cellState.WHITE);
				break;
		}

		this.setState({
			gameState: this.amazons.state,
		});
	}
}

/**
 * Board cell
 */
class Cell extends React.Component {

	render(){
		var iconClass = "";
		var style = {};
		var bgStyle = {};

		style["fontSize"] = "2vw";

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
				bgStyle["backgroundColor"] = "lightgrey";
				break;
			case cellState.VALID:
				bgStyle["backgroundColor"] = "green";
				break;
		}

		return(
			<div className="square" style={bgStyle} onClick={this.props.onClick}>
				<i className={iconClass} style={style}></i>
			</div>
		);
	}
}

/**
 * Game board
 */
class Board extends React.Component {

	renderCell(row, col){
		return (<Cell value={this.props.board[row][col]} onClick={ () => {this.props.onClick(row, col)} } />);
	}

	render(){
		var cells = [];
		for(var i = 0; i < this.props.board.length; i++){
            for(var j = 0; j < this.props.board[0].length; j++){
				cells.push(this.renderCell(i, j));
            }
		}

		return(
			<div className="grid-container">
				{cells}
			</div>
		);
	}
}

/**
 * Moves log component
 */
class MoveLog extends React.Component {

	renderMoves(){
		var movesLog = [];
		this.props.moves.slice(Math.max(this.props.moves.length - 5, 0)).forEach(e => {
			movesLog.push(<li className="list-group-item">{e}</li>);
		});
		return movesLog;
	}

	render(){
		return(
			<ul className="list-group">
				{this.renderMoves()}
			</ul>
		);
	}
}

// Render game
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
