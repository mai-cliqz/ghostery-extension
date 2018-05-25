import React from 'react';
import PropTypes from 'prop-types';

import TrackerItem from './TrackerItem';

class Accordion extends React.Component {
	constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
    	isActive: false,
    	openMenuIndex: -1,
    	items: this.props.trackers.slice(0, 40),
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

	componentDidUpdate(prevProps) {
		if (prevProps.trackers !== this.props.trackers) {
			const currentItemsLength = this.state.items.length;
			this.setState({
				items: this.props.trackers.slice(0, currentItemsLength),
			})
		}
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
		if (this.unMounted || !this.state.isActive || this.state.items.length >= this.props.trackers.length) {
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
	  		items: this.props.trackers.slice(0, this.state.items.length + nExtraItems),
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

  get blockingStatus() {
  	// TODO @mai optimize this
  	if (this.props.trackers.some(tracker => tracker.ss_allowed || tracker.ss_blocked)) {
  		return 'mixed';
  	}

  	if (this.props.numBlocked === this.props.numTotal) {
  		return 'blocked';
  	}

  	return '';
  }

  render() {
  	const itemHeight = 50;
  	const titleStyle = { backgroundImage: `url(/app/images/panel-android/categories/${this.props.logo}.svg)` };
  	const contentStyle = { '--trackers-length': `${this.props.open ? (this.state.items.length * itemHeight) + 39 : 0}px` };

    return (
      <div className={"accordion accordion" + this.props.index}>
      	<span className={`accordionSelect ${this.blockingStatus}`}></span>
        <div className={`accordionTitle ${this.state.isActive ? 'active' : ''}`} style={titleStyle} onClick={this.toggleContent}>
        	<h2>{this.props.name}</h2>
        	<p>
        		<span className="total-trackers">{this.props.numTotal} TRACKERS</span>
        		{!!this.props.numBlocked &&
        			<span className="blocked-trackers">{this.props.numBlocked} Blocked</span>
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
								callGlobalAction={this.props.callGlobalAction}
								categoryId={this.props.id}
								type={this.props.type}
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
	index: PropTypes.number,
	numBlocked: PropTypes.number,
	name: PropTypes.string,
	numTotal: PropTypes.number,
	logo: PropTypes.string,
	trackers: PropTypes.array,
	callGlobalAction: PropTypes.func,
	id: PropTypes.string,
	type: PropTypes.string,
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
        	this.props.categories.map((category, index) =>
			      <Accordion
			      	key={index}
			      	index={index}
			      	numBlocked={category.num_blocked}
			      	name={category.name}
			      	numTotal={category.num_total}
			      	logo={category.img_name}
			      	trackers={category.trackers}
			      	toggleAccordion={this.toggleAccordion}
			      	open={this.getOpenStatus(index)}
			      	id={category.id}
			      	callGlobalAction={this.props.callGlobalAction}
			      	type={this.props.type}
			      />
			    )
        }
      </div>
    );
  }
}

Accordions.propTypes = {
	categories: PropTypes.array,
	type: PropTypes.string,
	callGlobalAction: PropTypes.func,
};

export default Accordions;
