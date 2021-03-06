// React UI
import React from 'react';
import {Amazons} from './game';
import {cellState} from './game';
import {gameState} from './game';
import {AIPlayer} from './ai';

const playerState = {
	HUMAN: 0,
	AI: 1,
}

/**
 * Main game
 */
export default class Game extends React.Component {
	
	constructor(props){
		super(props);
		this.amazons = new Amazons();
		this.playerStateBlack = playerState.HUMAN;
		this.playerStateWhite = playerState.AI;
		this.aiWhite = new AIPlayer(cellState.WHITE, this.amazons);
		this.aiBlack = new AIPlayer(cellState.BLACK, this.amazons);

		// init game
		if(this.playerStateBlack == playerState.AI){
			this.aiBlack.nextMove();
			this.amazons.detectEnd(cellState.BLACK);
			this.amazons.detectEnd(cellState.WHITE);
		}

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
							<div class="row">
								<button className="col-4 btn btn-danger" onClick={
									() => {
										this.amazons.reset();
										this.setState({
											gameState: this.amazons.state,
										});
									}
								}>RESET</button>
								<PlayerToggler
									className="col-1"
									playerColor={cellState.BLACK}
									playerType={this.playerStateBlack}
									changePlayer= {(pColor, pType) => this.changePlayer(pColor, pType)}
								/>
								<PlayerToggler
									className="col-1"
									playerColor={cellState.WHITE}
									playerType={this.playerStateWhite}
									changePlayer= {(pColor, pType) => this.changePlayer(pColor, pType)}
								/>
							</div>
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
	
	/**
	 * Handles click on the board
	 */
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
				if(this.amazons.chooseFire(row, col)){
					this.amazons.detectEnd(cellState.BLACK);
					this.amazons.detectEnd(cellState.WHITE);

					// AI move
					if(this.playerStateWhite == playerState.AI && this.amazons.state == gameState.WHITE_IDLE){
						this.aiWhite.nextMove();
						this.amazons.detectEnd(cellState.BLACK);
						this.amazons.detectEnd(cellState.WHITE);
					}
				}
				break;
			case gameState.WHITE_FIRING:
				if(this.amazons.chooseFire(row, col)){
					this.amazons.detectEnd(cellState.BLACK);
					this.amazons.detectEnd(cellState.WHITE);

					// AI move
					if(this.playerStateBlack == playerState.AI && this.amazons.state == gameState.BLACK_IDLE){
						this.aiBlack.nextMove();
						this.amazons.detectEnd(cellState.BLACK);
						this.amazons.detectEnd(cellState.WHITE);
					}
				}
				break;
		}

		this.setState({
			gameState: this.amazons.state,
		});
	}

	/**
	 * Handles player change
	 * @param {*} playerColor 
	 * @param {*} playerType 
	 */
	changePlayer(playerColor, playerType){

		if(playerColor == cellState.BLACK){
			// disallow ai vs ai
			if(this.playerStateWhite == playerState.AI && playerType == playerState.AI){
				alert("AI cannot fight AI");
				return false;
			}

			this.playerStateBlack = playerType;
			return true;
		}
		else if(playerColor == cellState.WHITE){
			// disallow ai vs ai
			if(this.playerStateBlack == playerState.AI && playerType == playerState.AI){
				alert("AI cannot fight AI");
				return false;
			}

			this.playerStateWhite = playerType;
			return true;
		}

		return false;
	}
}

/**
 * Toggles human/ai player
 */
class PlayerToggler extends React.Component {

	constructor(props){
		super(props);

		var name;
		this.className;
		
		if(this.props.playerColor == cellState.BLACK){
			this.className = "btn btn-dark dropdown-toggle";
		}
		else if(this.props.playerColor == cellState.WHITE){
			this.className = "btn btn-light dropdown-toggle";
		}

		if(this.props.playerType == playerState.HUMAN){
			name = "Human";
		}
		else if(this.props.playerType == playerState.AI){
			name = "AI";
		}

		this.state = {
			text: name,
		};
	}

	changeName(name){
		this.setState({
			text: name,
		});
	}

	render(){

		return (
			<div class="dropdown">
				<button type="button" class={this.className} data-toggle="dropdown">
					{this.state.text}
				</button>
				<div class="dropdown-menu">
					<a class="dropdown-item" onClick={() => {
						if(this.props.changePlayer(this.props.playerColor, playerState.HUMAN)){
							this.changeName("Human");
						}
					}} >Human</a>
					<a class="dropdown-item" onClick={() => {
						if(this.props.changePlayer(this.props.playerColor, playerState.AI)){
							this.changeName("AI");
						}
					}} >AI</a>
				</div>
			</div> 
		);
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