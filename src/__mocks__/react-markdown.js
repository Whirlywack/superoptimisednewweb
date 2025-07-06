import React from "react";

// Mock react-markdown for tests
const ReactMarkdown = ({ children, ...props }) => {
  return React.createElement("div", { "data-testid": "markdown-content", ...props }, children);
};

export default ReactMarkdown;
