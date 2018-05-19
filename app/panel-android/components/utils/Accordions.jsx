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
		this.props.toggleMenu(this.props.index);
	}

	render() {
		return (
			<div className={`tracker ${this.props.showMenu ? 'show-menu' : ''}`}>
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

TrackerItem.propTypes = {
	toggleMenu: PropTypes.func,
	index: PropTypes.number,
	showMenu: PropTypes.bool,
	tracker: PropTypes.object,
};

class Accordion extends React.Component {
	constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
    	isActive: false,
    	openMenuIndex: -1,
    	items: this.props.data.trackers.slice(0, 40),
    }

    this.isWaiting = false;
    this.unMounted = false;
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
		this.unMounted = true;
	  window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = (event) => {
		// Don't call the checkAndUpdateData function so many times. Use throttle
		if (this.isWaiting) {
			return;
		}

		this.isWaiting = true;

		setTimeout(() => {
			this.isWaiting = false;
			this.checkAndUpdateData();
		}, 200);
	}

	checkAndUpdateData = () => {
		if (this.unMounted || !this.state.isActive || this.state.items.length >= this.props.data.trackers.length) {
			return;
		}

		const needToUpdateHeight = 40 * 30; // Update even before the bottom is visible
		const nExtraItems = 40;

	  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	  const accordionContentNode = this.myRef.current;
	  const boundingRect = accordionContentNode.getBoundingClientRect();
	  // Try lo load more when needed
	  if (scrollTop + window.innerHeight - (accordionContentNode.offsetTop + boundingRect.height) > -needToUpdateHeight) {
	  	this.setState({
	  		items: this.props.data.trackers.slice(0, this.state.items.length + nExtraItems),
	  	})
	  }
	}

	toggleMenu = (index) => {
    if(this.state.openMenuIndex === index) {
      this.setState({ openMenuIndex: -1 });
    } else {
      this.setState({ openMenuIndex: index });
    }
  }

	getMenuOpenStatus = (index) => {
  	return index === this.state.openMenuIndex;
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
        	<ul className="trackers-list">
        	{this.state.items.map((tracker, index) =>
						<li key={index}>
							<TrackerItem
								index={index}
								tracker={tracker}
								showMenu={this.getMenuOpenStatus(index)}
								toggleMenu={this.toggleMenu}
							/>
						</li>
					)}
					</ul>
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
	toggleAccordion: PropTypes.func,
	open: PropTypes.bool,
	data: PropTypes.object,
	index: PropTypes.number,
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

Accordions.propTypes = {
	accordions: PropTypes.array,
};

export default Accordions;
