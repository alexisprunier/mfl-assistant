import React from "react";

interface PageMatches {
  yScrollPosition: number;
}

const PageMatches: React.FC<PageMatchesProps> = ({ yScrollPosition }) => {
  return <div id="PageMatches" className="w-100 h-100"></div>;
};

export default PageMatches;
