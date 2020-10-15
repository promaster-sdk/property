import { configure } from "@storybook/react";

function loadStories() {
  require("../packages/_stories/lib");
  require("../packages/_stories/lib/react-properties-selector/hooks");
  require("../packages/_stories/lib/react-properties-selector/components");
  require("../packages/_stories/lib/react-property-selectors/hooks");
  require("../packages/_stories/lib/react-property-selectors/components");
}

configure(loadStories, module);
