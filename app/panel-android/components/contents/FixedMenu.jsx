import React from 'react';
import PropTypes from 'prop-types';
import { sendMessage } from '../../utils/msg';

class MenuItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			opening: false,
		};
	}

	componentDidMount() {
  	this.setState({
      active: this.props.active,
    });
  }

  componentDidUpdate(oldProps) {
    if(oldProps.active !== this.props.active) {
      // This triggers an unnecessary re-render
      this.setState({
        active: this.props.active,
      });
    }
  }

	menuItemClicked = () => {
		this.setState({
			opening: true,
		});

		this.props.updateHeadeText(this.props.title);
	}

	closeButtonClicked = () => {
		this.setState({
			opening: false,
		});

		this.props.updateHeadeText('');
	}

	switcherClicked = () => {
		const currentState = this.state.active;
		this.setState({
			active: !currentState,
		});

		sendMessage('setPanelData', {
			[`enable_${this.props.type}`]: !currentState,
		});
	}

	render() {

		return (
			<div className="menuItemWrapper">
				<div onClick={this.menuItemClicked} className="menuItemOverview">{this.props.title}</div>
				<span onClick={this.switcherClicked} className={`switcher ${this.state.active ? 'active' : ''}`}></span>
				<div className={`menuItemContent ${this.state.opening ? 'opening' : ''}`}>
					<p className={this.props.type}>{this.props.numData}</p>
					<p>{this.props.headline}</p>
					<p>{this.props.description}</p>
					<button onClick={this.closeButtonClicked} className="close">Close</button>
				</div>
			</div>
		);
	}
}

MenuItem.propTypes = {
	active: PropTypes.bool,
	type: PropTypes.string,
	title: PropTypes.string,
	numData: PropTypes.number,
	headline: PropTypes.string,
	description: PropTypes.string,
};

export default class FixedMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			currentMenuItemText: this.defaultHeaderText,
		}
	}

	toggleMenu = () => {
		const currentState = this.state.open;
		this.setState({
			open: !currentState,
		})
	}

	updateHeadeText = (text) => {
		if (!text) {
			text = this.defaultHeaderText;
		}

		this.setState({
			currentMenuItemText: text,
		});
	}

	get defaultHeaderText() {
		return 'Enhanced Options';
	}

	render() {

		return (
			<div className={`fixed-menu ${this.state.open ? 'opened' : ''}`}>
				<div onClick={this.toggleMenu} className="menuHeader">
					<p>{this.state.currentMenuItemText}</p>
				</div>
				<ul className="menuContent">
					<li className="menuItem">
						<MenuItem
							active={this.props.panel.enable_anti_tracking}
							updateHeadeText={this.updateHeadeText}
							type={'anti_tracking'}
							title={'Enhanced Anti-Tracking'}
							numData={3}
							headline={'Personal data points anonymized'}
							description={'Anonymize unblocked and unknown trackers for greater browsing protection.'}
						/>
					</li>
					<li className="menuItem">
						<MenuItem
							active={this.props.panel.enable_ad_block}
							updateHeadeText={this.updateHeadeText}
							type={'ad_block'}
							title={'Enhanced Ad Blocking'}
							numData={4}
							headline={'Advertisements blocked'}
							description={'Block all advertisements on websites you visit.'}
						/>
					</li>
					<li className="menuItem">
						<MenuItem
							active={this.props.panel.enable_smart_block}
							updateHeadeText={this.updateHeadeText}
							type={'smart_block'}
							title={'Smart Blocking'}
							numData={3}
							headline={'Smart Blocking'}
							description={'Automatically block and unblock trackers to optimize page performance.'}
						/>
					</li>
				</ul>
			</div>
		);
	}
}

FixedMenu.propTypes = {
	panel: PropTypes.object,
};
