import React from 'react';

class Path extends React.Component {
	constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

	  return {
	    x: centerX + (radius * Math.cos(angleInRadians)),
	    y: centerY + (radius * Math.sin(angleInRadians))
	  };
	}

	describeArc(x, y, radius, startAngle, endAngle){
		const start = this.polarToCartesian(x, y, radius, startAngle);
    const end = this.polarToCartesian(x, y, radius, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(' ');

    return d;
	}

	componentDidMount() {
		const node = this.myRef.current;
		node.style.setProperty('--stroke-length', `${node.getTotalLength()}`);
	}

	render() {
		let radius = this.props.radius;
		let start = this.props.path.start;
		let end = this.props.path.end;
		let category = this.props.path.category;

		const d = this.describeArc(0, 0, radius, start, end);

		return (
			<path
				d={d}
				data-category={category}
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

class TrackersChart extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="trackers-chart">
		    <SVG paths={this.props.paths} radius={this.props.radius} />
		    <p className="trackers-num">
					{this.props.num} Trackers found
				</p>
		  </div>
		);
	}
}

export default TrackersChart;
