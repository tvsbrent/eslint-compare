import React from 'react';
import styled from 'styled-components';

const GeneratedIcon = styled.button`
  border-width: 0;
  background-color: ${props => props.color};
  color: #fff;
  height: 40px;
  width: 40px;
  font-family: 'Roboto', sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
`;

const getIconText = name => {
  const split = name.split(/-|\s/);
  if (split.length === 1) {
    return name.substring(0, 2);
  }
  return split
    .reduce((prev, curr) => {
      return prev + curr[0];
    }, '')
    .substring(0, 2);
};

const RuleSetIcon = ({ name, icon, disableConfig }) => {
  if (icon.startsWith('data:')) {
    return (
      <img
        data-tip={name}
        onClick={() => disableConfig && disableConfig(name)}
        src={icon}
        height="30"
      />
    );
  }
  return (
    <GeneratedIcon
      color={icon}
      data-tip={name}
      onClick={() => disableConfig && disableConfig(name)}
    >
      {getIconText(name)}
    </GeneratedIcon>
  );
};

export default RuleSetIcon;
