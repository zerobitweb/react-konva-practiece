import React, { Component } from "react";
import { render } from "react-dom";
import { Stage, Layer, Image } from "react-konva";
import ColorPicker from "./ColorPicker";
//import Konva from "konva";
import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Glyphicon
} from "react-bootstrap";

var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 250;
var context = canvas.getContext("2d");
context.strokeStyle = "#DF4B26";
context.lineJoin = "round";
context.lineWidth = 5;

var isPaint = false;
var lastPointerPosition;
var mode = "brush";

class App extends Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onClick2 = this.onClick2.bind(this);

    this.callbackColorPicker = this.callbackColorPicker.bind(this);
  }

  onMouseDown = ev => {
    isPaint = true;
    lastPointerPosition = this.refs.stage.getPointerPosition();
    if (mode === "brush") {
      context.lineWidth = 5;
    }
    if (mode === "eraser") {
      context.lineWidth = 50;
    }
  };
  onMouseUp = ev => {
    isPaint = false;
    if (mode === "brush") {
      context.lineWidth = 5;
    }
    if (mode === "eraser") {
      context.lineWidth = 50;
    }
  };
  onClick = ev => {
    mode = ev.target.value;
  };
  onClick2 = ev => {
    canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 250;
    context = canvas.getContext("2d");
    context.strokeStyle = "#DF4B26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    this.setState({ clear: true });
  };

  // and core function - drawing
  onMouseMove = ev => {
    if (!isPaint) {
      return;
    }

    if (mode === "brush") {
      context.globalCompositeOperation = "source-over";
    }
    if (mode === "eraser") {
      context.globalCompositeOperation = "destination-out";
    }
    context.beginPath();

    var localPos = {
      x: lastPointerPosition.x - this.refs.image.x(),
      y: lastPointerPosition.y - this.refs.image.y()
    };
    context.moveTo(localPos.x, localPos.y);
    var pos = this.refs.stage.getPointerPosition();

    localPos = {
      x: pos.x - this.refs.image.x(),
      y: pos.y - this.refs.image.y()
    };
    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();

    lastPointerPosition = pos;
    this.refs.layer.batchDraw();
  };

  callbackColorPicker = color => {
    context.strokeStyle = color;
  };

  render() {
    return (
      <div>
        <div>
          <ButtonToolbar>
            <ToggleButtonGroup
              type="radio"
              name="options"
              defaultValue={"brush"}
            >
              <ToggleButton value={"brush"} onClick={this.onClick}>
                <Glyphicon glyph="pencil" />
                書く
              </ToggleButton>
              <ToggleButton value={"eraser"} onClick={this.onClick}>
                <Glyphicon glyph="erase" />
                消す
              </ToggleButton>
            </ToggleButtonGroup>
            <Button onClick={this.onClick2}>
              <Glyphicon glyph="trash" />
              捨てる
            </Button>
            <ColorPicker callback={this.callbackColorPicker} />
          </ButtonToolbar>
        </div>
        <div>
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseUp={this.onMouseUp}
            onTouchEnd={this.onMouseUp}
            onMouseMove={this.onMouseMove}
            onTouchMove={this.onMouseMove}
            ref="stage"
          >
            <Layer ref="layer">
              <Image
                image={canvas}
                //x={window.innerWidth / 4}
                //y={window.innerHeight / 4}
                y={10}
                stroke={"black"}
                //shadowBlur={5}
                onTouchStart={this.onMouseDown}
                onMouseDown={this.onMouseDown}
                ref="image"
              />
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
