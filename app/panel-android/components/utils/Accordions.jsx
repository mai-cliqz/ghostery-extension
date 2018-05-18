import React from 'react';
import PropTypes from 'prop-types';

class TrackerItem extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	showMenu: false,
    };
  }

	toggleMenu = () => {
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

    this.state = {
    	isActive: false,
    	items: this.props.data.trackers.slice(0, 40),
    }
  }

  toggleContent = () => {
    this.props.toggleAccordion(this.props.index);

    const currentState = this.state.isActive;
    this.setState({
    	isActive: !currentState,
    });
  }

  componentDidMount() {
	  window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
	  window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = (event) => {
		if (!this.state.isActive) {
			return;
		}

	  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	  const accordionContentNode = this.myRef.current;
	  const boundingRect = accordionContentNode.getBoundingClientRect();
	  // If the content bottom is in the viewport, we try to load more, if possible
	  if (boundingRect.top + boundingRect.height < scrollTop + window.innerHeight &&
	  	this.state.items.length < this.props.data.trackers.length) {
	  	const nextIndex = this.state.items.length + 40;
	  	this.setState({
	  		items: this.props.data.trackers.slice(0, nextIndex),
	  	})
	  }
	}

  render() {
  	const itemHeight = 30;
  	const titleStyle = { backgroundImage: `url(/app/images/panel/${this.props.data.img_name}.svg)` };
  	const contentStyle = { '--trackers-length': `${this.props.open ? (this.state.items.length * itemHeight) + 30 : 0}px` };

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
        	{this.state.items.map((tracker, index) =>
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
  }

  toggleAccordion = (index) => {
    if(this.state.openAccordionIndex === index) {
      this.setState({ openAccordionIndex: -1 });
    } else {
      this.setState({ openAccordionIndex: index });
    }
  }

  getOpenStatus = (index) => {
  	return index === this.state.openAccordionIndex;
  }

  render() {
    return (
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
    );
  }
}

export default Accordions;
