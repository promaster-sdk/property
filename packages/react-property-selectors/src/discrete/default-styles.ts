import { DiscretePropertySelector } from "./use-discrete-property-selector";

export function getDefaultOptionStyle<TItem>(sel: DiscretePropertySelector<TItem>, item: TItem): {} {
  return {
    color: sel.isItemValid(item) ? "rgb(131, 131, 131)" : "red",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
  };
}

export function getDefaultSelectStyle<TItem>(sel: DiscretePropertySelector<TItem>): {} {
  const always = {
    color: "black",
    height: "30px",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 30px 0px 10px",
  };

  const isSelectedItemValid = sel.isItemValid(sel.selectedItem);
  if (!isSelectedItemValid && sel.disabled) {
    return {
      ...always,
      background: "lightgray",
      color: "red",
      border: "none",
    };
  } else if (!isSelectedItemValid) {
    return { ...always, color: "red" };
  } else if (sel.disabled) {
    return {
      ...always,
      background: "lightgray",
      color: "darkgray",
      border: "none",
    };
  }
  return { ...always };
}

export function getDefaultToggleButtonStyle<TItem>(selector: DiscretePropertySelector<TItem>): {} {
  return {
    width: "162px",
    alignItems: "center",
    background: "white",
    color: "black",
    height: "30px",
    whiteSpace: "nowrap",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 5px 0px 14px",
    textAlign: "right",

    ...buttonElementStyles({
      isSelectedItemValid: selector.isItemValid(selector.selectedItem),
      locked: selector.disabled,
    }),
  };
}

export function getDefaultMenuStyle(): {} {
  return {
    position: "absolute",
    display: "block",
    background: "white",
    border: "1px solid #bbb",
    listStyle: "none",
    margin: 0,
    padding: 0,
    zIndex: 100,
  };
}

export function getDefaultListItemStyle<TItem>(sel: DiscretePropertySelector<TItem>, item: TItem): {} {
  return {
    color: !sel.isItemValid(item) ? "color: red" : "rgb(131, 131, 131)",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "0.2em 0.5em",
    cursor: "default",
  };
}

export function getDefaultRadioItemStyle<TItem>(sel: DiscretePropertySelector<TItem>, item: TItem): {} {
  const isItemValid = sel.isItemValid(item);
  return {
    cursor: isItemValid ? "pointer" : "not-allowed",
    display: "inline-block",
    marginRight: "10px",
    padding: "10px",
    border: sel.selectedItem === item ? "2px solid " + (isItemValid ? "#39f" : "red") : "2px solid transparent",
    color: isItemValid ? "black" : "grey",
    // ${(p: RadioGroupItemProps) =>
    //   p.isItemValid ? "&:hover { background: #39f; color: white;" : ""}
  };
}

function buttonElementStyles({
  isSelectedItemValid,
  locked,
}: {
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
}): {} {
  if (isSelectedItemValid === false && locked) {
    return {
      background: "lightgray",
      color: "red",
      border: "none",
    };
  } else if (isSelectedItemValid === false) {
    return { color: "red" };
  } else if (locked) {
    return {
      background: "lightgray",
      color: "darkgray",
      border: "none",
    };
  }

  return {};
}

export function getDefaultCheckboxStyle<TItem>(selector: DiscretePropertySelector<TItem>): {} {
  return {
    marginTop: "6px",
    position: "relative",
    backgroundColor: "#ccc",
    width: "22px",
    height: "22px",
    background: selector.isTrueItem ? "red" : "green",
  };
}

export function getDefaultCheckboxContainerStyle(): {} {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  };
}
