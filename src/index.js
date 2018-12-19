import React from "react";
import ReactDOM from "react-dom";
import PainterComponent from "./PainterComponent";

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
    return <PainterComponent {...conf} />;
  };
}

ReactDOM.render(<App />, document.getElementById("root"));
