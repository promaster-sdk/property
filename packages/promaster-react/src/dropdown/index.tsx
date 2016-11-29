import * as React from "react";
import {csjs} from "csjs";
import {insertCss} from "insert-css";

export interface DropdownStyles {
  readonly dropdown: string,
  readonly dropdownButton: string,
  readonly dropdownBackground: string,
  readonly dropdownOptions: string,
  readonly dropdownOption: string,
}

const defaultStyles: DropdownStyles = csjs`
  .dropdown {
    user-select: none;
  }

  .dropdown img {
    vertical-align: middle;
  }
  
  .dropdownButton {
    display: flex;
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
  }
  
  .dropdownButton i {
    margin-left: 10px;
  }
  
  .dropdownButton img {
    max-width: 1em;
    max-height: 1em;
  }
  
  .dropdownBackground {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .dropdownOptions {
    position: absolute;
    display: block;
    background: white;
    border: 1px solid #bbb;    
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .dropdownOption {
    padding: 0.2em 0.5em;
    cursor: default;
  }

  .dropdownOption img {
    max-width: 2em;
    max-height: 2em;
  }
  
  .dropdownOptions .dropdownOption:hover {
    background-color: blue;
    color: white;
  }
`;

// tslint:disable-next-line
insertCss(csjs.getCss(defaultStyles));

export interface Props {
  readonly value: string,
  readonly onChange: (value: string) => void,
  readonly options: Array<DropdownOption>,
  readonly styles?: DropdownStyles,
  readonly className?: string,
}

export interface DropdownOption {
  readonly value: string,
  readonly label: string,
  readonly tooltip?: string,
  readonly imageUrl?: string,
  readonly className?: string,
}

export interface State {
  readonly isOpen: boolean,
}

//tslint:disable
export class Dropdown extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const {value, onChange, options, styles = defaultStyles, className}: Props = this.props;

    const selected = options.find((o) => o.value === value);

    const background = this.state.isOpen ? (<div className={styles.dropdownBackground} onClick={() => this.setState({isOpen: false})}></div>) : undefined;

    const optionsList = this.state.isOpen ? (
      <div className={styles.dropdownOptions}>
        {options.map((o) => {
          const optionClassNames = o.className ? [styles.dropdownOption, o.className] : [styles.dropdownOption];
          return (
            <div key={o.value}
                 className={optionClassNames.join(' ')}
                 title={o.tooltip}
                 onClick={() => {
                   onChange(o.value);
                   this.setState({isOpen: false});
                 }}>{this._renderItem(o)}</div>
          );
        })}
      </div>) : undefined;

    const classNames = className ? [styles.dropdownButton, className] : [styles.dropdownButton];

    return (
      <div className={styles.dropdown}>
        {background}
        <button className={classNames.join(' ')} title={selected !== undefined ? selected.tooltip : undefined}
                onClick={() => this.setState({isOpen: !this.state.isOpen})}>
          {this._renderItem(selected)}
          <i className="fa fa-caret-down"/>
        </button>
        {optionsList}
      </div>
    );
  }

  _renderItem(item: DropdownOption | undefined): React.ReactElement<{}> {
    if (item === undefined) {
      return (<span />);
    }

    const image = item.imageUrl ? (<img src={item.imageUrl} />) : (<span />);

    return (<span>{image}{" " + item.label + " "}</span>);
  }
}
