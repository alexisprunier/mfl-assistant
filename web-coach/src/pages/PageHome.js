import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageHome.css";

interface PageHomeProps {
  props: object;
  flowUser: Object;
  assistantUser: Object;
  updateAssistantUser: Object;
  logout: Object;
  yScrollPosition: number;
}

const PageHome: React.FC<PageHomeProps> = ({
  props,
  flowUser,
  assistantUser,
  updateAssistantUser,
  logout,
  yScrollPosition,
}) => {
  const navigate = useNavigate();

  return <div id="PageHome" className="h-100"></div>;
};

export default PageHome;
