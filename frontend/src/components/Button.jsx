// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = ({ variant, children, className, ...rest }) => {
  const baseClasses = "py-2 px-4 rounded font-bold focus:outline-none focus:ring-2 transition-colors duration-200";
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  // Define variant-based classes using your theme colors
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary-dark",
    secondary: "bg-secondary text-white hover:bg-secondary-light focus:ring-secondary-dark",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-700",
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-600 text-gray-800 hover:bg-gray-800 hover:text-white',
    ghost: 'text-white hover:bg-gray-800',
  };

  return (
    <button
      {...rest}
      className={classNames(baseStyles,baseClasses, variantClasses[variant] || variantClasses.primary, className)}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  className: '',
};

export default Button;
