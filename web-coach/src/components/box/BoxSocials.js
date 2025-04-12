import React from 'react';
import "./BoxSocials.css";

interface BoxSocialsProps {
}

const BoxSocials: React.FC<BoxSocialsProps> = () => {
  return (
    <div
      className="BoxSocials"
      style={{ zIndex: 1000 }}
    >
      <div className="position-relative border border-2 border-body rounded-3 px-5 py-2">
      	<div className="social-title text-body small">
      		Contact <i className="bi bi-emoji-smile-fill"></i>
      	</div>

        <a className="h4 me-3" href="https://app.playmfl.com/users/0xdf26376de6cba19e">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 55.541065 17.780001"
            height="14"
            version="1.1"
            className="NavMobile_logo__ws_KV"
          >
            <g transform="translate(227.49086,-63.017615)">
              <path fill="#0dcaf0" d="m -202.64966,63.017615 -3.5052,17.78 h -5.461 l 1.5748,-8.1026 -5.0038,6.5024 h -2.6416 l -2.7432,-6.4008 -1.6002,8.001 h -5.461 l 3.556,-17.78 h 4.8768 l 3.8608,9.4488 7.4422,-9.4488 z"></path>
              <path fill="#0dcaf0" d="m -194.64548,67.538815 -0.6096,3.048 h 7.4168 l -0.9144,4.5212 h -7.3914 l -1.143,5.6896 h -5.9944 l 3.556,-17.78 h 14.4526 l -0.9144,4.5212 z"></path>
              <path fill="#0dcaf0" d="m -183.35439,63.017615 h 5.9944 l -2.6162,13.1318 h 8.0264 l -0.9398,4.6482 h -14.0208 z"></path>
            </g>
          </svg>
        </a>

        <a className="h4 me-3" href="https://discord.com/users/_alexisp.">
          <i className="bi bi-discord text-info"></i>
        </a>

        <a className="text-white h5 ms-1" href="https://twitter.com/AlexisPrunier_">
          <i className="bi bi-twitter-x text-info"></i>
        </a>
      </div>
    </div>
  );
};

export default BoxSocials;