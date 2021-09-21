import React from "react";
import TextField from "@material-ui/core/TextField";

export default ({
  validator = false,
  onChange,
  name,
  label,
  value,
  ...props
}) => (
  <TextField
    error={!!validator}
    helperText={validator}
    variant="outlined"
    onChange={onChange}
    name={name}
    label={label}
    value={value}
    {...props}
  />
);
