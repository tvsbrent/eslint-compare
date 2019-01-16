import React, { Component } from 'react';

import styled from 'styled-components';

const ExpandableHeader = styled.h2`cursor: pointer;`;

const Expander = styled.button`
  border-width: 0;
  font-size: 1.5rem;
`;

class CategoryHeader extends Component {
  constructor(props) {
    super(props);
    this.isVisible = 1;
  }

  componentDidMount() {
    this.isVisible = this.calcIsVisible();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.node = null;
  }

  handleScroll = () => {
    if (!this.props.isExpanded) {
      return;
    }

    const isVisible = this.calcIsVisible();

    // -1 above-screen or obscured.
    // 0 visible
    // 1 below-screen
    if (this.isVisible !== isVisible && isVisible !== 1) {
      const detail = { title: this.props.title, index: this.props.index };
      if (this.isVisible === 0 && isVisible === -1) {
        // send push event.
        document.dispatchEvent(new CustomEvent('push-title', { detail }));
      } else if (this.isVisible === -1 && isVisible === 0) {
        // send the pop event.
        document.dispatchEvent(new CustomEvent('pop-title', { detail }));
      }
    }
    this.isVisible = isVisible;
  };

  calcIsVisible() {
    if (!this.node) {
      return 1;
    }
    const [rect] = this.node.getClientRects();
    const midX = rect.x + rect.width / 2;
    const midY = rect.y + rect.height / 2;
    if (midY < 0) {
      return -1;
    }
    if (midY > window.innerHeight) {
      return 1;
    }

    if (midY > 0 && midY < window.innerHeight) {
      let elm = document.elementFromPoint(midX, midY);
      while (elm != null) {
        if (elm === this.node) {
          return 0;
        }
        elm = elm.parentElement;
      }
    }
    return -1;
  }

  render() {
    const { title, isExpanded, setExpanded } = this.props;
    return (
      <ExpandableHeader
        onClick={e => {
          e.preventDefault();
          if (!this.isVisible) {
            return;
          }
          setExpanded(!isExpanded);
        }}
        // eslint-disable-next-line no-return-assign
        innerRef={node => (this.node = node)}
      >
        <Expander>
          {isExpanded ? '▼' : '▶︎'}
        </Expander>
        {title}
      </ExpandableHeader>
    );
  }
}

export default CategoryHeader;
