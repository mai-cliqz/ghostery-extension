/**
 * Ghostery React App Init
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2018 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */
/**
 * @namespace  PanelAndroidUIClasses
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Path extends React.Component {
	constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

	componentDidMount() {
		const node = this.myRef.current;
		node.style.setProperty('--stroke-length', `${node.getTotalLength()}`);
	}

	render() {
		let radius = this.props.radius;
		let start = this.props.path.start;
		let end = this.props.path.end;
		let color = this.props.path.color;
		const d = `M ${start[0]},${start[1]} A ${radius},${radius} 0 0,1 ${end[0]},${end[1]}`;

		return (
			<path
				d={d}
				stroke={color}
				className="path"
				ref={this.myRef}
				onAnimationEnd={this.props.handler}
			>
			</path>
		)
	}
}

class SVG extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nItem: 1,
		}

		this.increaseN = this.increaseN.bind(this);
	}

	increaseN() {
		let currentN = this.state.nItem;
		if (currentN < this.props.paths.length) {
			this.setState({
      	nItem: currentN += 1
      });
		}
	}

	render() {
		const radius = this.props.radius;
		let paths = this.props.paths.slice(0, this.state.nItem).map((element, index) => {
			return (
				<Path
					key={index}
					path={element}
					radius={radius}
					handler = {this.increaseN}
				/>
			)
		});

		return (
			<svg id="circle" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="-10 -10 220 220">
			  <g fill="none" strokeWidth="15" transform="translate(100,100)">
			    {paths}
			  </g>
			</svg>
		);
	}
}

let paths = [
  { 'start': [0,-100], 'end': [41,-90], color: 'red' },
  { 'start': [41,-90], 'end': [10,99], color: 'yellow' },
  { 'start': [10,99], 'end': [-88,-46], color: 'green' },
  { 'start': [-88,-46], 'end': [0,-100], color: 'blue' },
];

const radius = 100;

ReactDOM.render(
	(
		<SVG paths={paths} radius={radius} />
	), document.getElementById('ghostery-content'),
);
