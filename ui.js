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
		}

		return(
			<div className="square" style={bgStyle}>
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
	}

	render(){

		var cells = [];
		this.amazons.board.forEach(row => {
			row.forEach(e => {
				cells.push(<Cell value={e} />);
			})
		});

		return(
			<div className="grid-container">
				{cells}
			</div>
		);
	}
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
