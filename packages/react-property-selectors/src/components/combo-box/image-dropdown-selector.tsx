/* eslint-disable functional/no-this-expression */
import React from "react";
import { ComboBoxImageOptionElementRow, ComboBoxImageOptionElementRowProps } from "./combo-box-image-element-row";
import { ComboBoxImageElement, ComboBoxImageElementProps } from "./combo-box-image-button-element";

export interface ImageDropdownSelectorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: ReadonlyArray<DropdownOption>;
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
}

export interface DropdownOption {
  readonly value: string;
  readonly label: string;
  readonly isItemValid?: boolean;
  readonly tooltip?: string;
  readonly imageUrl?: string;
}

export interface State {
  readonly isOpen: boolean;
}

export type ImageDropdownSelector = React.ComponentClass<ImageDropdownSelectorProps>;

export interface CreateImageDropdownSelectorProps {
  readonly OptionImage?: React.ComponentType<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >;
  readonly OptionImageElementRow?: React.ComponentType<ComboBoxImageOptionElementRowProps>;
  readonly DropdownOptionsElement?: React.ComponentType<
    React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >;
  readonly DropdownSelectElement?: React.ComponentType<
    React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >;
  readonly ComboBoxImageButtonElement?: React.ComponentType<ComboBoxImageElementProps>;
}

export const defaultOptionImageElement = (
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
): JSX.Element => (
  <img
    {...props}
    style={{
      maxWidth: "2em",
      maxHeight: "2em",
    }}
  />
);

// export const defaultOptionImageElementRow = styled(
//   ComboBoxImageOptionElementRow
// )`
//   color: rgb(131, 131, 131);
//   min-height: 18px;
//   align-self: center;
//   border: 0px none rgb(131, 131, 131);
//   font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
//   outline: rgb(131, 131, 131) none 0px;

//   padding: 0.2em 0.5em;
//   cursor: default;

//   &:hover {
//     background-color: blue;
//     color: white;
//   }

//   ${props => (props.isItemValid === false ? "color: red;" : "")};
// `;

export const defaultOptionImageElementRow = (props: ComboBoxImageOptionElementRowProps): JSX.Element => (
  <ComboBoxImageOptionElementRow
    {...props}
    style={{
      color: props.isItemValid === false ? "color: red;" : "rgb(131, 131, 131)",
      minHeight: "18px",
      alignSelf: "center",
      border: "0px none rgb(131, 131, 131)",
      font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
      outline: "rgb(131, 131, 131) none 0px",
      padding: "0.2em 0.5em",
      cursor: "default",

      // &:hover {
      //   background-color: blue;
      //   color: white;
      // }
    }}
  />
);

export const defaultDropdownOptionsElement = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => (
  <div
    {...props}
    style={{
      position: "absolute",
      display: "block",
      background: "white",
      border: "1px solid #bbb",
      listStyle: "none",
      margin: 0,
      padding: 0,
      zIndex: 100,
    }}
  />
);

// export const defaultDropdownSelectElement = styled.div`
//   user-select: none;

//   img {
//     vertical-align: middle;
//   }
// `;

export const defaultDropdownSelectElement = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => (
  <div
    {...props}
    style={{
      userSelect: "none",
      // img {
      //   vertical-align: middle;
      // }
    }}
  />
);

export const DefaultBackgroundElement = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => (
  <div
    {...props}
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }}
  />
);

export const defaultComboBoxImageButtonElement = (props: ComboBoxImageElementProps): JSX.Element => (
  <ComboBoxImageElement
    {...props}
    style={{
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

      // i {
      //   margin-left: 10px;
      // }

      // img {
      //   max-width: 1em;
      //   max-height: 1em;
      // }

      ...buttonElementStyles(props),
    }}
  />
);

export function createImageDropdownSelector({
  OptionImage = defaultOptionImageElement,
  OptionImageElementRow = defaultOptionImageElementRow,
  DropdownOptionsElement = defaultDropdownOptionsElement,
  DropdownSelectElement = defaultDropdownSelectElement,
  ComboBoxImageButtonElement = defaultComboBoxImageButtonElement,
}: CreateImageDropdownSelectorProps): ImageDropdownSelector {
  // eslint-disable-next-line functional/no-class
  return class extends React.Component<ImageDropdownSelectorProps, State> {
    constructor(props: ImageDropdownSelectorProps) {
      super(props);
      this.state = {
        isOpen: false,
      };
    }

    render(): JSX.Element {
      const { value, onChange, options, isSelectedItemValid, locked }: ImageDropdownSelectorProps = this.props;

      const selected = options.find((o) => o.value === value);

      const background = this.state.isOpen ? (
        <DefaultBackgroundElement onClick={() => this.setState({ isOpen: false })} />
      ) : undefined;

      const optionsList = this.state.isOpen ? (
        <DropdownOptionsElement>
          {options.map((o) => {
            return (
              <OptionImageElementRow
                key={o.value}
                isItemValid={o.isItemValid}
                title={o.tooltip}
                onClick={() => {
                  onChange(o.value);
                  this.setState({ isOpen: false });
                }}
              >
                {this._renderItem(o)}
              </OptionImageElementRow>
            );
          })}
        </DropdownOptionsElement>
      ) : undefined;

      return (
        <DropdownSelectElement>
          {background}
          <ComboBoxImageButtonElement
            isSelectedItemValid={isSelectedItemValid}
            locked={locked}
            title={selected !== undefined ? selected.tooltip : undefined}
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          >
            {this._renderItem(selected)}
            <i className="fa fa-caret-down" />
          </ComboBoxImageButtonElement>
          {optionsList}
        </DropdownSelectElement>
      );
    }

    // eslint-disable-next-line class-methods-use-this
    _renderItem(item: DropdownOption | undefined): React.ReactElement<{}> {
      if (item === undefined) {
        return <span />;
      }

      const image = item.imageUrl ? <OptionImage src={item.imageUrl} /> : <span />;

      return (
        <span>
          {image}
          {" " + item.label + " "}
        </span>
      );
    }
  };
}

function buttonElementStyles(props: ComboBoxImageElementProps): {} {
  if (props.isSelectedItemValid === false && props.locked) {
    return {
      background: "lightgray",
      color: "red",
      border: "none",
    };
  } else if (props.isSelectedItemValid === false) {
    return { color: "red" };
  } else if (props.locked) {
    return {
      background: "lightgray",
      color: "darkgray",
      border: "none",
    };
  }

  return {};
}
