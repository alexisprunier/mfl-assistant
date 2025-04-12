import React from 'react';

interface UtilConditionalRenderProps {
	value: Object;
	renderOk: Object;
	renderEmpty: Object;
	renderUndefined: Object;
}

const UtilConditionalRender: React.FC<UtilConditionalRenderProps> = ({ value, renderOk, renderEmpty, renderUndefined }) => {
  if (value) {
  	if (value.length === 0) {
  		return renderEmpty();
  	}

  	return renderOk();
  }

  return renderUndefined();
};

export default UtilConditionalRender;