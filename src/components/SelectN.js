import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default ({ onChange, name, label, value, menuItens, ...props }) => (
  <FormControl>
    <InputLabel shrink htmlFor={name}>
      {label}
    </InputLabel>
    <Select
      variant="outlined"
      onChange={(e) => onChange(e)}
      name={name}
      label={label}
      value={value}
      style={{ minWidth: 210 }}
      {...props}
    >
      <MenuItem disabled value="">
        selecione {label}
      </MenuItem>
      {menuItens &&
        menuItens.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
    </Select>
  </FormControl>
);
