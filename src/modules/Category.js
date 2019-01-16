import React, { Component } from 'react';
import Rule from './Rule';
import CategoryHeader from './CategoryHeader';

export default class Category extends Component {
  state = {
    isExpanded: true
  };

  handleSetExpanded = newState => {
    this.setState({ isExpanded: newState });
  };

  render() {
    const { title, index, urlPattern, rules, configs } = this.props;

    const ruleNodes = rules.map(rule =>
      <Rule
        key={rule.name}
        name={rule.name}
        urlPattern={urlPattern}
        description={rule.description}
        configs={configs}
      />
    );

    return (
      <div>
        <CategoryHeader
          title={title}
          index={index}
          isExpanded={this.state.isExpanded}
          setExpanded={this.handleSetExpanded}
        />
        <table style={{ display: this.state.isExpanded ? 'table' : 'none' }}>
          <tbody>
            {ruleNodes}
          </tbody>
        </table>
      </div>
    );
  }
}
