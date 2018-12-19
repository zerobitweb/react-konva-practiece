import React from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: {
        // r: "223",
        // g: "75",
        // b: "38",
        // a: "100"
        r: "0",
        g: "0",
        b: "0",
        a: "100"
      },
      //hex: "#DF4B26"
      hex: "#000000"
    };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.props.callback(this.state.hex);
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    console.log(color);
    this.setState({ color: color.rgb, hex: color.hex });
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: 68 - 10,
          height: 34 - 10,
          borderRadius: "5px",
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${
            this.state.color.b
          }, ${this.state.color.a})`
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "5px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
          width: 68,
          height: 34
        },
        popover: {
          position: "absolute",
          left: 100,
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
export default ColorPicker;
