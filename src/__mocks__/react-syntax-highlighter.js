import React from "react";

// Mock react-syntax-highlighter for tests
export const Prism = ({ children, language, ...props }) => {
  return React.createElement(
    "pre",
    {
      "data-testid": "syntax-highlighter",
      "data-language": language,
      ...props,
    },
    children
  );
};

// Export all the things that might be imported
export default Prism;
export { Prism as PrismLight };

// Mock the styles
export const oneLight = {};
export const oneDark = {};
export const prism = {};
