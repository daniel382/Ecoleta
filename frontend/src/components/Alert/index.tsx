import React from 'react';
import { FiCheckCircle, FiXOctagon } from 'react-icons/fi'

import './styles.css'

interface AlertComponent {
  message: string;
  isHiden: boolean;
  hasError?: boolean;
}

function Alert(props: AlertComponent) {
  const { message, isHiden, hasError } = props;
  const display = isHiden ? 'none' : 'flex'
  const color = hasError ? '#fae1e1' : '#E1FAEC'

  return (
    <div className="mask" style={{ display }}>
      <div className="box-message">
        <div className="icon">
          {
            hasError
              ? <FiXOctagon size={60} color="#fd4949" />
              : <FiCheckCircle size={60} color="#34CB79" />
          }
        </div>

        <div className="message" style={{ color }}>
          {
            message
          }
        </div>
      </div>
    </div>
  );
}

export default Alert;
