import React from 'react';
import _ from 'lodash';

function getRuleCode(rule) {
  const ruleValue = _.isArray(rule) ? _.first(rule) : rule;

  if (_.isNumber(ruleValue)) {
    return ruleValue;
  }

  switch (ruleValue) {
    case 'warning':
      return 1;
    case 'error':
      return 2;
    default:
      return 0;
  }
}

function getRuleLabel(ruleCode) {
  switch (ruleCode) {
    case 1:
      return 'warn';
    case 2:
      return 'error';
    default:
      return 'off';
  }
}

function formatRule(rule) {
  if (!_.isObject(rule)) {
    return rule;
  }

  return JSON.stringify(rule, null, 4);
}

function getTitleText(rule) {
  if (_.isArray(rule)) {
    const rules = rule.slice(1);
    if (rules.length === 1) {
      return formatRule(rules[0]);
    }
    return formatRule(rules);
  }
}

const getUrl = (() => {
  const expressionRegExp = /\$\{(.*)\}/g;
  const regExpType = /^\/.+\/[a-z]*$/g;
  return (urlPattern, name) => {
    if (!urlPattern) {
      return `http://eslint.org/docs/rules/${name}`;
    }
    return urlPattern.replace(expressionRegExp, (match, ...args) => {
      if (args.slice(0, -2).length === 0) {
        return match;
      }

      let capture = args[0];

      if (regExpType.test(capture)) {
        // split it into the pattern and the flags
        const closingSlash = capture.lastIndexOf('/');
        const flags = capture.substring(closingSlash + 1);
        capture = capture.substring(1, closingSlash);

        const exp = new RegExp(capture, flags);
        const result = exp.exec(name);
        if (result) {
          return result[result.length - 1];
        }
        return result;
      }
    });
  };
})();

const Rule = ({ name, urlPattern, description, configs }) => {
  const ruleNodes = configs.filter(config => config.enabled).map(config => {
    const titleText = getTitleText(config.rules[name]);
    const ruleCode = getRuleCode(config.rules[name]);
    return (
      <td
        data-tip={titleText}
        key={config.name}
        className={`rule code-${ruleCode}`}
      >
        {getRuleLabel(ruleCode)}
        {titleText ? '*' : null}
      </td>
    );
  });

  return (
    <tr>
      {ruleNodes}
      <td>
        <a href={getUrl(urlPattern, name)}>
          {name}
        </a>
      </td>
      <td>
        {description}
      </td>
    </tr>
  );
};

export default Rule;
