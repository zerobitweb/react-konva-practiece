import React from "react";
import ReactDOM from "react-dom";
import PainterComponent from "./PainterComponent";
import "./styles.css";

class App extends React.Component {
  render = () => {
    let conf = {
      width: 500,
      height: 300,
      pen: {
        size: 10,
        color: "#000"
      },
      eraser: {
        size: 50
      }
    };
    return (
      <div>
        <PainterComponent {...conf} ref="painter" />
        <input
          type="button"
          value="get image base64 data"
          onClick={ev => {
            //console.log(this.refs.painter.refs.stage.getStage().toDataURL());
            this.refs.txta.value = this.refs.painter.toDataURL();
          }}
        />
        <br />
        <textarea style={{ width: 500, height: 300 }} ref="txta" />
      </div>
    );
  };
}

ReactDOM.render(<App />, document.getElementById("root"));
