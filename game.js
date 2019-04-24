
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

class Cell extends React.Component {
	render(){
		return(
			<p>This is the board</p>
		);
	}
}

class Board extends React.Component {

	render(){
		return(
			<p>This is the board</p>
		);
	}

}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);