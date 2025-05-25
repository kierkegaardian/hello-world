import React from 'react';
export const Picker = ({ children, ...props }) => (
  React.createElement('Picker', props, children)
);
Picker.Item = ({ children, ...props }) => (
  React.createElement('Picker.Item', props, children)
);
export default { Picker };
