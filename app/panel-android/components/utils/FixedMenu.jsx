import React from 'react';

class MenuItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
		};

		this.menuItemClicked = this.menuItemClicked.bind(this);
		this.closeButtonClicked = this.closeButtonClicked.bind(this);
	}

	menuItemClicked() {
		this.setState({
			active: true,
		});
	}

	closeButtonClicked() {
		this.setState({
			active: false,
		});
	}

	render() {

		return (
			<div>
				<span onClick={this.menuItemClicked}>Menu Item</span>
				<div className={`menuItemInfo ${this.state.active ? 'active' : ''}`}>
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

