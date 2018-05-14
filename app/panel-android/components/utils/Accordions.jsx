import React from 'react';
import PropTypes from 'prop-types';

class TrackerItem extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	showMenu: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

	toggleMenu() {
		const currentState = this.state.showMenu;
		this.setState({
			showMenu: !currentState,
		});
	}

	render() {
		return (
			<div className={`tracker ${this.state.showMenu ? 'show-menu' : ''}`}>
  			<a className="info" href={'#'}></a>
  			<div onClick={this.toggleMenu} className="trackerName">{this.props.tracker.name}</div>

  			<div className="menu">
  				<button className="trackerOption trust">Trust</button>
  				<button className="trackerOption restrict">Restrict</button>
  				<button className="trackerOption block">Block</button>
  			</div>
  			<button className="trackerSelect">select</button>
  		</div>
		);
	}
}

class Accordion extends React.Component {
	constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.toggleContent = this.toggleContent.bind(this);
    this.state = {
    	isActive: false,
    }
  }

  toggleContent() {
    this.props.toggleAccordion(this.props.index);

    const currentState = this.state.isActive;
    this.setState({
    	isActive: !currentState,
    });
  }

  render() {
  	const titleStyle = { backgroundImage: `url(/app/images/panel/${this.props.data.img_name}.svg)` };
  	const contentStyle = { '--trackers-length': `${this.props.open ? (this.props.data.num_total * 25) + 30 : 0}px` };

    return (
      <div className={"accordion accordion" + this.props.index}>
      	<button className="accordionSelect">select</button>
        <div className={`accordionTitle ${this.state.isActive ? 'active' : ''}`} style={titleStyle} onClick={this.toggleContent}>
        	<h2>{this.props.data.name}</h2>
        	<p>
        		<span>{this.props.data.num_total} TRACKERS</span>
        		{this.props.data.blocked &&
        			<span>{this.props.data.blocked} Blocked</span>
        		}
        	</p>
        	<p>
        		On this site
        	</p>
        </div>
        <div ref={this.myRef} className="accordionContent" style={contentStyle}>
        	<p>
        		<span>TRACKERS</span>
        		<span>Blocked</span>
        	</p>
        	{this.props.data.trackers.map((tracker, index) =>
        		<TrackerItem key={index} tracker={tracker}/>
        	)}
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
	toggleAccordion: PropTypes.func,
	open: PropTypes.bool,
	data: PropTypes.object,
};

class Accordions extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	openAccordionIndex: -1,
    }

    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.getOpenStatus = this.getOpenStatus.bind(this);
  }

  toggleAccordion(index) {
    if(this.state.openAccordionIndex === index) {
      this.setState({ openAccordionIndex: -1 });
    } else {
      this.setState({ openAccordionIndex: index });
    }
  }

  getOpenStatus(index) {
  	return index === this.state.openAccordionIndex;
  }

  render() {
    return (
    	<div>
	    	<h2>Trackers on this site</h2>
	      <div className="accordions">
	        {
	        	this.props.accordions.map((accordion, index) =>
				      <Accordion
				      	key={index}
				      	index={index}
				      	data={accordion}
				      	toggleAccordion={this.toggleAccordion}
				      	open={this.getOpenStatus(index)}
				      />
				    )
	        }
	      </div>
      </div>
    );
  }
}

export default Accordions;
