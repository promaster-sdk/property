import * as React from "react";
import styled, * as StyledExports from "styled-components";
import { comboBoxImageOptionElementRow, ComboBoxImageOptionElementRowProps } from "./combo-box-image-element-row";
import { comboBoxImageElement, ComboBoxImageButtonElementProps } from "./combo-box-image-button-element";

export interface ImageDropdownSelectorProps {
  readonly value: string,
  readonly onChange: (value: string) => void,
  readonly options: Array<DropdownOption>,
  readonly isSelectedItemValid?: boolean,
  readonly locked: boolean,
}

export interface DropdownOption {
  readonly value: string,
  readonly label: string,
  readonly isItemValid?: boolean,
  readonly tooltip?: string,
  readonly imageUrl?: string,
}

export interface State {
  readonly isOpen: boolean,
}

export type ImageDropdownSelector = React.ComponentClass<ImageDropdownSelectorProps>;

export interface CreateImageDropdownSelectorProps {
  readonly OptionImage?: React.ComponentType<React.HTMLProps<HTMLImageElement>>,
  readonly OptionImageElementRow?: React.ComponentType<ComboBoxImageOptionElementRowProps>,
  readonly DropdownOptionsElement?: React.ComponentType<HTMLDivElement>,
  readonly DropdownSelectElement?: React.ComponentType<HTMLDivElement>,
  readonly ComboBoxImageButtonElement?: React.ComponentType<ComboBoxImageButtonElementProps>,

}

const defaultOptionImageElement = styled.img`
  max-width: 2em;
  max-height: 2em;
`;

const defaultOptionImageElementRow = styled(comboBoxImageOptionElementRow) `
  color: rgb(131, 131, 131);
  min-height: 18px;
  align-self: center;
  border: 0px none rgb(131, 131, 131);
  font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
  outline: rgb(131, 131, 131) none 0px;

  padding: 0.2em 0.5em;
  cursor: default;

  &:hover {
    background-color: blue;
    color: white;
  }

  ${(props) => props.isItemValid === false ? "color: red;" : ""}
`;

const defaultDropdownOptionsElement = styled.div`
  position: absolute;
  display: block;
  background: white;
  border: 1px solid #bbb;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 100;
`;

const defaultDropdownSelectElement = styled.div`
  user-select: none;

  img {
    vertical-align: middle;
  }
`;

// tslint:disable-next-line:variable-name
const DefaultBackgroundElement = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

const defaultComboBoxImageButtonElement = styled(comboBoxImageElement) `
  width: 162px;
  align-items: center;
  background: white;
  color: black;
  height: 30px;
  white-space: nowrap;
  border: 1px solid #b4b4b4;
  border-radius: 3px;
  font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
  outline: rgb(131, 131, 131) none 0px;
  padding: 1px 5px 0px 14px;
  text-align: right;

  i {
    margin-left: 10px;
  }

  img {
    max-width: 1em;
    max-height: 1em;
  }

  ${buttonElementStyles}
`;

export function createImageDropdownSelector({
  OptionImage = defaultOptionImageElement,
  OptionImageElementRow = defaultOptionImageElementRow,
  DropdownOptionsElement = defaultDropdownOptionsElement,
  DropdownSelectElement = defaultDropdownSelectElement,
  ComboBoxImageButtonElement = defaultComboBoxImageButtonElement
}: CreateImageDropdownSelectorProps): ImageDropdownSelector {
  //tslint:disable no-this
  return class extends React.Component<ImageDropdownSelectorProps, State> {

    constructor(props: ImageDropdownSelectorProps) {
      super(props);
      this.state = {
        isOpen: false,
      };
    }

    render(): JSX.Element {
      const {
      value,
        onChange,
        options,
        isSelectedItemValid,
        locked,
    }: ImageDropdownSelectorProps = this.props;

      const selected = options.find((o) => o.value === value);

      const background = this.state.isOpen ? (
        <DefaultBackgroundElement onClick={() => this.setState({ isOpen: false })}></DefaultBackgroundElement>
      ) : undefined;

      const optionsList = this.state.isOpen
        ? (
          <DropdownOptionsElement>
            {options.map((o) => {
              return (
                <OptionImageElementRow key={o.value}
                  isItemValid={o.isItemValid}
                  title={o.tooltip}
                  onClick={() => {
                    onChange(o.value);
                    this.setState({ isOpen: false });
                  }}>{this._renderItem(o)}</OptionImageElementRow>
              );
            })}
          </DropdownOptionsElement>
        )
        : undefined;

      return (
        <DropdownSelectElement>
          {background}
          <ComboBoxImageButtonElement
            isSelectedItemValid={isSelectedItemValid}
            locked={locked}
            title={selected !== undefined ? selected.tooltip : undefined}
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
            {this._renderItem(selected)}
            <i className="fa fa-caret-down" />
          </ComboBoxImageButtonElement>
          {optionsList}
        </DropdownSelectElement>
      );
    }

    _renderItem(item: DropdownOption | undefined): React.ReactElement<{}> {
      if (item === undefined) {
        return (<span />);
      }

      const image = item.imageUrl ? (<OptionImage src={item.imageUrl} />) : (<span />);

      return (<span>{image}{" " + item.label + " "}</span>);
    }
  };
}

function buttonElementStyles(props: ComboBoxImageButtonElementProps): Array<StyledExports.InterpolationValue> {
  if (props.isSelectedItemValid === false && props.locked) {
    return StyledExports.css`
      background: lightgray;
      color: red;
      border: none;    
    `;
  } else if (props.isSelectedItemValid === false) {
    return StyledExports.css`color: red;`;
  } else if (props.locked) {
    return StyledExports.css`
      background: lightgray;
      color: darkgray;
      border: none;
    `;
  }

  return StyledExports.css``;
}