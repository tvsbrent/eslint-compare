import React, { Component } from 'react';
import Modal from 'react-modal';
import rulesCategories from './data/rules.json';
import _ from 'lodash';
import { StickyContainer } from 'react-sticky';
import Category from './modules/Category';
import ReactTooltip from 'react-tooltip';
import FixedHeader from './modules/FixedHeader';

const allRules = _.flatten(
  rulesCategories.map(cat => cat.rules.map(rule => rule.name))
);

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);
    const configs = [
      {
        name: 'airbnb',
        icon: require('./img/airbnb-icon.png'),
        rules: require('./data/configs/airbnb-base.json'),
        enabled: false
      },
      {
        name: 'eslint-recommended',
        icon: require('./img/eslint-recommended-icon.png'),
        rules: require('./data/configs/eslint-recommended.json'),
        enabled: false
      },
      {
        name: 'google',
        icon: require('./img/google-icon.png'),
        rules: require('./data/configs/google.json'),
        enabled: false
      },
      {
        name: 'standard',
        icon: require('./img/standard-icon.png'),
        rules: require('./data/configs/standard.json'),
        enabled: false
      },
      {
        name: 'Account',
        icon: '#008000',
        rules: require('./data/configs/oreilly-account.json'),
        enabled: false
      },
      {
        name: 'Case Studies',
        icon: '#008b8b',
        rules: require('./data/configs/oreilly-case-studies.json'),
        enabled: false
      },
      {
        name: 'Chassis',
        icon: '#dc143c',
        rules: require('./data/configs/oreilly-chassis.json'),
        enabled: true
      },
      {
        name: 'Heron',
        icon: '#0000cd',
        rules: require('./data/configs/oreilly-heron.json'),
        enabled: true
      },
      {
        name: 'Home',
        icon: '#4b0082',
        rules: require('./data/configs/oreilly-home.json'),
        enabled: false
      },
      {
        name: 'Learning Paths',
        icon: '#ffd700',
        rules: require('./data/configs/oreilly-learning-paths.json'),
        enabled: false
      },
      {
        name: 'Playlists',
        icon: '#00ced1',
        rules: require('./data/configs/oreilly-playlists.json'),
        enabled: true
      },
      {
        name: 'Playlists Core',
        icon: '#1e90ff',
        rules: require('./data/configs/oreilly-playlists-core.json'),
        enabled: true
      },
      {
        name: 'Training',
        icon: '#8b008b',
        rules: require('./data/configs/oreilly-training.json'),
        enabled: false
      },
      {
        name: 'Video Client',
        icon: '#3cb371',
        rules: require('./data/configs/oreilly-video-client.json'),
        enabled: false
      },
      {
        name: 'custom',
        icon: require('./img/add-icon.png'),
        rules: {},
        enabled: false
      }
    ];

    this.state = {
      configs,
      editorContents: '',
      isEditorVisible: false,
      isEditorInvalid: false,
      rulesCategories
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onChangeEditor = evt => {
    this.setState({
      editorContents: evt.target.value
    });
  };

  onClickSave = () => {
    try {
      const customConfig = _.find(this.state.configs, { name: 'custom' });
      const contents = JSON.parse(this.state.editorContents);
      customConfig.rules = _.get(contents, 'rules', contents);

      const customRuleNames = Object.keys(customConfig.rules).filter(
        rule => !allRules.includes(rule)
      );

      const customRuleNamesWithCategory = customRuleNames.filter(name =>
        name.includes('/')
      );

      const customCategories = customRuleNamesWithCategory.reduce(
        (memo, ruleName) => {
          const categoryTitle = ruleName.split('/')[0];
          const category = memo.find(
            categories => categories.title === categoryTitle
          );
          if (!category) {
            memo.push({
              title: categoryTitle,
              rules: [{ name: ruleName }]
            });
            return memo;
          }

          category.rules.push({ name: ruleName });
          return memo;
        },
        []
      );

      this.setState({
        rulesCategories: [...this.state.rulesCategories, ...customCategories],
        configs: this.state.configs,
        isEditorVisible: false,
        isEditorInvalid: false
      });
    } catch (e) {
      console.error(e);
      this.setState({
        isEditorInvalid: true
      });
    }
  };

  enableConfig = name => {
    const config = _.find(this.state.configs, { name });
    config.enabled = true;
    this.setState({ configs: this.state.configs });
  };

  disableConfig = name => {
    const config = _.find(this.state.configs, { name });
    config.enabled = false;
    this.setState({ configs: this.state.configs });
  };

  showEditor = () => {
    this.setState({
      isEditorVisible: true
    });
  };

  hideEditor = () => {
    this.setState({
      isEditorVisible: false
    });
  };

  render() {
    const categoryNodes = this.state.rulesCategories.map((category, index) => {
      return (
        <Category
          key={category.title}
          index={index}
          title={category.title}
          urlPattern={category.urlPattern}
          rules={category.rules}
          configs={this.state.configs}
          enableConfig={this.enableConfig}
          disableConfig={this.disableConfig}
          showEditor={this.showEditor}
        />
      );
    });

    return (
      <div>
        <ReactTooltip multiline />
        <Modal
          className="modal-outer"
          style={modalStyles}
          isOpen={this.state.isEditorVisible}
          onRequestClose={this.hideEditor}
        >
          <div className="modal-inner">
            <div className="header">
              <p>
                If you are extending other configs, you can use the following to
                generate the resulting config:
                <code>node_modules/eslint/bin/eslint.js --print-config ./</code>
              </p>
            </div>
            <textarea
              onChange={this.onChangeEditor}
              placeholder="Paste ESLint rules and hit Save"
              value={this.state.editorContents}
            />
            <div className="footer">
              <button onClick={this.onClickSave}>Save</button>
              {this.state.isEditorInvalid
                ? <span className="editor-invalid">
                    The config is invalid and cannot be saved
                  </span>
                : null}
            </div>
          </div>
        </Modal>
        <StickyContainer>
          <FixedHeader
            configs={this.state.configs}
            enableConfig={this.enableConfig}
            disableConfig={this.disableConfig}
            showEditor={this.showEditor}
          />
          {categoryNodes}
        </StickyContainer>
      </div>
    );
  }
}
