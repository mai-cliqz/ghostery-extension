import React from 'react';
import Accordions from './utils/Accordions';

export default class Overview extends React.Component {
	get categories() {
		return this.props.categories;
	}

	render() {
		return (
			<Accordions accordions={this.categories} />
		)
	}
}
