import React from 'react';

class MenuItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: true,
			opening: false,
		};

		this.menuItemClicked = this.menuItemClicked.bind(this);
		this.closeButtonClicked = this.closeButtonClicked.bind(this);
		this.switcherClicked = this.switcherClicked.bind(this);
	}

	menuItemClicked() {
		this.setState({
			opening: true,
		});
	}

	closeButtonClicked() {
		this.setState({
			opening: false,
		});
	}

	switcherClicked() {
		const currentState = this.state.active;
		this.setState({
			active: !currentState,
		});
	}

	render() {

		return (
			<div className="menuItemWrapper">
				<div onClick={this.menuItemClicked} className="menuItemOverview">Menu Item</div>
				<span onClick={this.switcherClicked} className={`switcher ${this.state.active ? 'active' : ''}`}></span>
				<div className={`menuItemContent ${this.state.opening ? 'opening' : ''}`}>
					<span>Some information</span>
					<button onClick={this.closeButtonClicked} className="close">Close</button>
				</div>
			</div>
		);
	}
}

export default class FixedMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		}

		this.toggleMenu = this.toggleMenu.bind(this);
	}

	toggleMenu() {
		const currentState = this.state.open;
		this.setState({
			open: !currentState,
		})
	}

	render() {

		return (
			<div className={`fixed-menu ${this.state.open ? 'opened' : ''}`}>
				<div onClick={this.toggleMenu} className="menuHeader">
					ITEM
				</div>
				<ul className="menuContent">
					<li className="menuItem">
						<MenuItem />
					</li>
					<li className="menuItem">
						<MenuItem />
					</li>
					<li className="menuItem">
						<MenuItem />
					</li>
				</ul>
			</div>
		);
	}
}

