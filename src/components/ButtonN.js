import React from "react";
import Button from "@material-ui/core/Button";

export default ({
  disabled = false,
  color = "primary",
  onClick,
  buttonText,
  ...props
}) => (
  <Button
    disabled={disabled}
    variant="contained"
    color={color}
    onClick={onClick}
    {...props}
  >
    {buttonText}
  </Button>
);
