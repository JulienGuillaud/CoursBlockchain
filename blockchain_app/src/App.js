import React, { Component, useEffect, useState } from "react";
import { initWeb3, getMyPixels } from "./Web3Client";

let tableDataDefault = Array(5)
  .fill()
  .map((_, col) =>
    Array(5)
      .fill()
      .map((_, i) => ({ id: i + col * 5 , color : "#efefef"}))
  );

function App() {
  const [connectButtonState, setConnectButtonState] = useState({
    text: "Connect wallet",
    style: { color: "#444" },
  });
  const [tableDataState, setTableDataState] = useState({
    data: tableDataDefault,
  });
  // useEffect(() => {
  //   initWeb3();
  // }, []);

  const connectWalletHandler = () => {
    initWeb3(setConnectButtonState);
  };
  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="connect-wallet-button"
        style={connectButtonState.style}
      >
        {connectButtonState.text}
      </button>
    );
  };

  const getMyPixelsHandler = async () => {
    let res = await getMyPixels()
    console.log("Res in pixelHandler : ", res);
  
    var ownedByMe = [];
    var newData = tableDataDefault;

    for(var i = 0 ; i < res.length ; i++){
      var id = res[i].id
      var owner = res[i].owner
      ownedByMe.push(Number(id))
    }

    console.log("Owned by me : ", ownedByMe);

    for(var i = 0 ; i < newData.length ; i++){
      for(var j = 0 ; j < newData.length ; j++){
          console.log("Searching : ", newData[i][j].id)
          if(ownedByMe.indexOf(newData[i][j].id) != -1){
            console.log("Found : ", newData[i][j].id);
            newData[i][j].color = "#d2ffd1";
          }
      }
    }

    
    setTableDataState((previousState) => {
      return {...previousState, data: newData}
    });
      // .then((tx) => {
      //   console.log(tx);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
  };
  const getMyPixelsButton = () => {
    return (
      <button onClick={getMyPixelsHandler} className="get-pixels-button">
        Get my pixels
      </button>
    );
  };

  const pixelClickHandler = (id) => {
    console.log("Pixel clicked : ", id);
  };

  const pixelTable = () => {
    var body = tableDataState.data;

    console.log("body", body);
    return (
      <div>
        <Table body={body} />
      </div>
    );
  };

  class Table extends Component {
    render() {
      var body = this.props.body;
      return (
        <table className="table-visu-pixel">
          <tbody>
            {body.map((row, index) => (
              <TableRow row={row} row-index={index} />
            ))}
          </tbody>
        </table>
      );
    }
  }

  class TableRow extends Component {
    render() {
      var row = this.props.row;
      var index = this.row - index;
      return (
        <tr key={index}>
          {row.map((val) => (
            <button
              className="pixels-button"
              onClick={pixelClickHandler(val.id)}
              style={{background:val.color}}
            >
              <td key={val.id}>{val.id}</td>
            </button>
          ))}
        </tr>
      );
    }
  }

  return (
    <div className="App">
      <div className="main-div">
        {connectWalletButton()}
        {getMyPixelsButton()}
        {pixelTable()}
      </div>
    </div>
  );
}

export default App;
