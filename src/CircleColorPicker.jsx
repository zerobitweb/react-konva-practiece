import React from "react";
import { Button, Glyphicon, OverlayTrigger, Popover } from "react-bootstrap";
import { bootstrapUtils } from "react-bootstrap/lib/utils";
import { CirclePicker } from "react-color";

class CircleColorPicker extends React.Component {
  constructor(props) {
    super(props);

    const default_colors = ["#000000", "#ff0000", "#0000ff"];

    this.state = {
      show: false,
      width: props.width ? props.width : 200,
      colors: props.colors ? props.colors : default_colors,
      color: props.color ? props.color : default_colors[0],
      callback: props.callback
    };

    bootstrapUtils.addStyle(Button, "circle");
  }

  popoverClickRootClose = params => {
    return (
      <Popover
        id="popover-trigger-click-root-close"
        //title="Popover bottom"
        ref="Popover"
      >
        <CirclePicker {...params} ref="CirclePicker" />;
      </Popover>
    );
  };

  onChange = ev => {
    this.setState({ color: ev.hex });
    if (this.state.callback) this.state.callback(ev);
  };

  render = () => {
    let params = {
      width: this.state.width,
      colors: this.state.colors,
      onChange: this.onChange,
      color: this.state.color
    };
    return (
      <div>
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="bottom"
          overlay={this.popoverClickRootClose(params)}
          ref="OverlayTrigger"
        >
          <Button
            bsStyle="circle"
            style={{ backgroundColor: this.state.color }}
            ref="Button"
          >
            <Glyphicon glyph="tint" ref="Glyphicon" style={{ color: "#fff" }} />
          </Button>
        </OverlayTrigger>
      </div>
    );
  };
}
export default CircleColorPicker;
