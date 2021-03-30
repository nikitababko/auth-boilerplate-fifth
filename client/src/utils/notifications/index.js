import React from 'react';
import './index.scss';

export const showErrMsg = (msg) => {
  return <div className="err-msg">{msg}</div>;
};

export const showSuccessMsg = (msg) => {
  return <div className="success-msg">{msg}</div>;
};
