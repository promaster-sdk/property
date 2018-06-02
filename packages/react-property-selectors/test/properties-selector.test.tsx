import * as React from "react";
import * as renderer from "react-test-renderer";

test("Link changes the class when hovered", () => {
  const component = renderer.create(
    // <PropertiesSelector />
    <div>Facebook</div>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseEnter();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseLeave();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
});
