import React from 'react';
import PropTypes from 'prop-types';

class Accordion extends React.Component {
	constructor(props) {
    super(props);
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.props.toggleAccordion(this.props['data-id']);
  }

  getHeight() {
    if(this.props.open) {
      return `${this.props.data.trackers.length * 35}px`;
    } else {
      return "0";
    }
  }

  render() {
    const style = { height: this.getHeight() };
    return (
      <div className={"accordion accordion" + this.props['data-id']}>
        <h2 className="accordionTitle" onClick={this.toggleContent}>{this.props.data.name}</h2>
        <div className="accordionContent" style={style} >
        	{this.props.data.trackers.map((tracker, index) =>
        		<p key={index}>{tracker.name}</p>
        	)}
        </div>
      </div>
    );
  }
}

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
      <div className="accordions">
        {
        	this.props.accordions.map((accordion, index) =>
			      <Accordion
			      	key={index}
			      	data-id={index}
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
