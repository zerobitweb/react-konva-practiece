import React from "react";
import Konva from "react-konva";
//import ColorPicker from "./ColorPicker";
import CircleColorPicker from "./CircleColorPicker";
import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Glyphicon,
  Well
} from "react-bootstrap";

class PainterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.width ? props.width : 500,
      height: props.height ? props.height : 300,
      pen: {
        color: props.pen.color ? props.pen.color : "#000000",
        size: props.pen.size ? props.pen.size : 5
      },
      eraser: {
        size: props.eraser.size ? props.eraser.size : 50
      }
    };

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.state.width;
    this.canvas.height = this.state.height;

    let context = this.canvas.getContext("2d");
    context.lineJoin = "round";
    context.strokeStyle = this.state.pen.color;
    context.lineWidth = this.state.pen.size;

    this.savedImage = null;

    this.isPaint = false;
    this.lastPointerPosition = null;
    this.mode = "pencil";
    this.undoStack = [];
  }

  onMouseDown = ev => {
    let context = this.canvas.getContext("2d");
    this.isPaint = true;
    this.lastPointerPosition = this.refs.stage.getPointerPosition();
    if (this.mode === "pencil") {
      context.lineWidth = this.state.pen.size;
    }
    if (this.mode === "eraser") {
      context.lineWidth = this.state.eraser.size;
    }
  };
  onMouseUp = ev => {
    let context = this.canvas.getContext("2d");
    this.isPaint = false;
    if (this.mode === "pencil") {
      context.lineWidth = this.state.pen.size;
    }
    if (this.mode === "eraser") {
      context.lineWidth = this.state.eraser.size;
    }
    this.undoStack.push(
      context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    );
  };
  // and core function - drawing
  onMouseMove = ev => {
    if (!this.isPaint) {
      return;
    }
    let context = this.canvas.getContext("2d");

    if (this.mode === "pencil") {
      context.globalCompositeOperation = "source-over";
    }
    if (this.mode === "eraser") {
      context.globalCompositeOperation = "destination-out";
    }
    context.beginPath();

    var localPos = {
      x: this.lastPointerPosition.x - this.refs.image.x(),
      y: this.lastPointerPosition.y - this.refs.image.y()
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

    this.lastPointerPosition = pos;
    this.refs.layer.batchDraw();
  };

  callbackColorPicker = color => {
    let context = this.canvas.getContext("2d");
    context.strokeStyle = color;
  };

  onClick = ev => {
    this.mode = ev.target.value;
  };
  onClick2 = ev => {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.state.width;
    this.canvas.height = this.state.height;
    let context = this.canvas.getContext("2d");
    context.strokeStyle = this.state.pen.color;
    context.lineJoin = "round";
    context.lineWidth = this.state.pen.size;

    this.isPaint = false;
    this.lastPointerPosition = null;
    //this.mode = "pencil";
    this.undoStack = [];

    this.setState({ clear: true });
  };
  onClick3 = ev => {
    if (this.undoStack.length - 1 > 0) {
      //console.log("undo");
      let img = this.undoStack.pop();
      img = this.undoStack.pop();
      let context = this.canvas.getContext("2d");
      context.putImageData(img, 0, 0);
      this.undoStack.push(img);
      this.refs.layer.batchDraw();
    } else {
      //console.log("reset");
      this.onClick2();
    }
  };
  onClickSave = ev => {
    this.savedImage = this.refs.stage.getStage().toDataURL();
    //console.log(this.savedImage);
  };
  onClickOpen = ev => {
    this.onClick2();
    let img = new Image();
    img.src = this.savedImage;
    img.onload = () => {
      //context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      //context.putImageData(imgData, 0, 0);
      let ctx = this.canvas.getContext("2d");
      img.width = this.canvas.width;
      img.height = this.canvas.height;
      ctx.drawImage(img, 0, 0, 500, 300);
      let idat = ctx.getImageData(0, 0, 500, 300);
      let context = this.canvas.getContext("2d");
      context.putImageData(idat, 0, 0, 0, 0, 500, 300);
      this.refs.layer.batchDraw();
      //console.log(`load::width=${img.width}/height=${img.height}`);
    };
  };

  onChagneFile = ev => {
    let file = ev.target.files;

    var reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = file => {
      //console.log(reader.result);
      this.savedImage = reader.result;
      this.onClickOpen(ev);
    };
  };

  //外部から image base64 dataを取る場合に使う
  toDataURL = () => {
    return this.refs.stage.getStage().toDataURL();
  };

  render = () => {
    return (
      <div>
        <div>
          <ButtonToolbar>
            <ToggleButtonGroup
              type="radio"
              name="options"
              defaultValue={this.mode}
              ref="toggleButtonGroup"
            >
              <ToggleButton value={"pencil"} onClick={ev => this.onClick(ev)}>
                <Glyphicon glyph="pencil" />
                書く
              </ToggleButton>
              <ToggleButton value={"eraser"} onClick={ev => this.onClick(ev)}>
                <Glyphicon glyph="erase" />
                消す
              </ToggleButton>
            </ToggleButtonGroup>
            <Button onClick={ev => this.onClick2(ev)}>
              <Glyphicon glyph="trash" />
              捨てる
            </Button>
            <Button onClick={ev => this.onClick3(ev)}>
              <Glyphicon glyph="share-alt" className="flip-horizontal" />
              Undo
            </Button>
            <Button onClick={ev => this.onClickSave(ev)}>
              <Glyphicon glyph="save-file" />
              保存
            </Button>
            <Button onClick={ev => this.onClickOpen(ev)}>
              <Glyphicon glyph="open-file" />
              Load
            </Button>
            <input
              type="file"
              ref="Upload"
              style={{ display: "none" }}
              onChange={ev => this.onChagneFile(ev)}
            />
            <Button onClick={ev => this.refs.Upload.click()}>
              <Glyphicon glyph="open-file" />
              Upload
            </Button>
            {/*
            <ColorPicker callback={color => this.callbackColorPicker(color)} />
            */}
            <CircleColorPicker
              width={200}
              callback={ev => this.callbackColorPicker(ev.hex)}
              ref="CircleColorPicker"
            />
          </ButtonToolbar>
        </div>
        <Well
          style={{
            width: this.state.width,
            height: this.state.height,
            padding: 0,
            backgroundColor: "#fff"
          }}
          ref="well"
        >
          <Konva.Stage
            //width={window.innerWidth}
            //height={window.innerHeight}
            width={this.state.width}
            height={this.state.height}
            onMouseUp={ev => this.onMouseUp(ev)}
            onTouchEnd={ev => this.onMouseUp(ev)}
            onMouseMove={ev => this.onMouseMove(ev)}
            onTouchMove={ev => this.onMouseMove(ev)}
            ref="stage"
          >
            <Konva.Layer ref="layer">
              <Konva.Image
                image={this.canvas}
                //x={window.innerWidth / 4}
                //y={window.innerHeight / 4}
                //y={10}
                //stroke={"black"}
                //shadowBlur={5}
                onTouchStart={ev => this.onMouseDown(ev)}
                onMouseDown={ev => this.onMouseDown(ev)}
                ref="image"
              />
            </Konva.Layer>
          </Konva.Stage>
        </Well>
      </div>
    );
  };
}
export default PainterComponent;
