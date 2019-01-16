import React, { Component } from 'react';
import { Sticky } from 'react-sticky';
import RuleSetIcon from './RuleSetIcon';

class FixedHeader extends Component {
  state = {
    titles: []
  };

  componentDidMount() {
    document.addEventListener('push-title', this.pushTitle);
    document.addEventListener('pop-title', this.popTitle);
  }

  componentWillUnmount() {
    document.removeEventListener('push-title');
    document.removeEventListener('pop-title');
  }

  getCurrentTitle = () => {
    if (this.state.titles.length) {
      const filtered = this.state.titles.filter(title => title);
      return filtered[filtered.length - 1];
    }
    return '  ';
  };

  popTitle = ({ detail }) => {
    this.setState({ titles: this.state.titles.slice(0, detail.index) });
  };

  pushTitle = ({ detail }) => {
    const titles = [...this.state.titles];
    titles[detail.index] = detail.title;
    this.setState({ titles });
  };

  render() {
    const { configs, disableConfig, enableConfig, showEditor } = this.props;

    const editLink = (
      <a onClick={showEditor} className="edit">
        Edit
      </a>
    );
    const enabledConfigs = configs
      .filter(config => config.enabled)
      .map(config => {
        return (
          <td key={config.name} className="rule">
            <div className="icon-container">
              <RuleSetIcon
                name={config.name}
                icon={config.icon}
                disableConfig={disableConfig}
              />
              {config.name === 'custom' ? editLink : null}
            </div>
          </td>
        );
      });

    function enableAndEditConfig(name) {
      enableConfig.call(this, name);
      if (name === 'custom') {
        showEditor();
      }
    }

    const disabledConfigs = configs
      .filter(config => !config.enabled)
      .map(config => {
        return (
          <div
            key={config.name}
            onClick={() => enableAndEditConfig(config.name)}
          >
            <RuleSetIcon name={config.name} icon={config.icon} />
          </div>
        );
      });

    return (
      <Sticky className="header">
        <table>
          <thead>
            <tr>
              {enabledConfigs}
              <td>
                <h2>
                  {this.getCurrentTitle()}
                </h2>
              </td>
              <td className="disabled-configs">
                {disabledConfigs}
              </td>
            </tr>
          </thead>
        </table>
      </Sticky>
    );
  }
}

export default FixedHeader;
