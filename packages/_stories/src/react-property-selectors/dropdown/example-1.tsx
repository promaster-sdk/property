import * as React from "react";
import { createImageDropdownSelector } from "@promaster-sdk/react-property-selectors";

const ImageDropDownSelector = createImageDropdownSelector({});

export function DropdownExample1(): React.ReactElement<{}> {
  const options = [
    {
      value: "a",
      label: "Adam asd asd as das das das das das das dasd asd asd as dasd a",
      imageUrl:
        "http://vignette4.wikia.nocookie.net/mrmen/images/5/52/Small.gif/revision/latest?cb=20100731114437"
    },
    {
      value: "b",
      label: "Bertil",
      imageUrl: "http://image.flaticon.com/teams/new/1-freepik.jpg"
    },
    {
      value: "c",
      label: "Ceasar",
      tooltip: "Boop"
    }
  ];

  return (
    <div>
      <ImageDropDownSelector
        locked={false}
        isSelectedItemValid={false}
        value="a"
        options={options}
        onChange={(v: string) => console.log(v)}
      />
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
      <p>Hej</p>
    </div>
  );
}
