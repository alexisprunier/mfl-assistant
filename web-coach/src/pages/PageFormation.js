import React from "react";

interface PageFormation {
  yScrollPosition: number;
}

const PageFormation: React.FC<PageFormationProps> = ({ yScrollPosition }) => {
  return <div id="PageMaPageFormationtches" className="w-100 h-100"></div>;
};

export default PageFormation;
