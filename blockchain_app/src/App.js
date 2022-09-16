import React, { Component, useEffect, useState } from "react";
import { initWeb3, getMyPixels, searchPixels } from "./Web3Client";

let tableDataDefault = Array(5)
  .fill()
  .map((_, col) =>
    Array(5)
      .fill()
      .map((_, i) => ({
        id: i + col * 5,
        x: col,
        y: i,
        coordId: col + "-" + i,
        color: "#color-grey",
      }))
  );

function App() {
  const [connectButtonState, setConnectButtonState] = useState({
    text: "Connect wallet",
    style: { color: "#444" },
  });
  const [tableDataState, setTableDataState] = useState({
    data: tableDataDefault,
  });

  const [searchAddressState, setAddressState] = useState('');
  const searchAddressChange = event => {
    setAddressState(event.target.value);
  }

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

  const searchPixelsHandler = async () => {
    let res = await searchPixels(searchAddressState);

    let newData = traiterPixelAAfficher(res);

    // Reset table
    console.log("tableDataDefault : ", tableDataDefault);
    setTableDataState((previousState) => {
      return { ...previousState, data: tableDataDefault };
    });
    // Set new datas
    setTableDataState((previousState) => {
      return { ...previousState, data: newData };
    });
  }
  
  const getMyPixelsHandler = async () => {
    let res = await getMyPixels();
    
    let newData = traiterPixelAAfficher(res);

    // Reset table
    setTableDataState((previousState) => {
      return { ...previousState, data: tableDataDefault };
    });
    // Set new datas
    setTableDataState((previousState) => {
      return { ...previousState, data: newData };
    });

  };


  function traiterPixelAAfficher(blockChainReturn){
    console.log("blockChainReturn: ", blockChainReturn);

    var ownedByMe = [];
    var newData = tableDataDefault;

    for (var i = 0; i < blockChainReturn.length; i++) {
      var id = blockChainReturn[i].id;
      var owner = blockChainReturn[i].owner;
      ownedByMe.push(Number(id));
    }

    console.log("Owned by me : ", ownedByMe);

    for (var i = 0; i < newData.length; i++) {
      for (var j = 0; j < newData.length; j++) {
        if (ownedByMe.indexOf(newData[i][j].id) != -1) {
          newData[i][j].color = "color-green";
        }
      }
    }
    return newData;
  }

  const getMyPixelsButton = () => {
    return (
      <button onClick={getMyPixelsHandler} className="get-pixels-button">
        Get my pixels
      </button>
    );
  };
  const searchPixelByAddress = () => {
    return (
      <div className="field">
        <input
          type={"text"}
          placeholder={"0xdF12E03849Be1f3460B5C450F5B99382Ac38E89F"}
          onChange={searchAddressChange}
        ></input>
        <button onClick={searchPixelsHandler} className="search-pixels-button">
          Search
        </button>
      </div>
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
              <TableRow key={"row-" + index} row={row} rowindex={index} />
            ))}
          </tbody>
        </table>
      );
    }
  }

  class TableRow extends Component {
    render() {
      var row = this.props.row;
      var rowKey = "row-" + this.props.rowindex;
      return (
        <tr key={rowKey}>
          {row.map((val, index) => (
            <td key={val.coordId}>
              <button
                className={"pixels-button "+val.color}
                onClick={pixelClickHandler(val.id)}
                style={{ background: val.color }}
              >
                {val.id}
              </button>
            </td>
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
        {searchPixelByAddress()}
        {pixelTable()}
      </div>
    </div>
  );
}

export default App;
