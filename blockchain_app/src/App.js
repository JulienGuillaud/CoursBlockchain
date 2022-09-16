import React, { Component, useState } from "react";
import { initWeb3, getMyPixels, searchPixels, takePixel } from "./Web3Client";

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


  function resetTableData() {
    let newData = Array(5)
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
    tableDataDefault = newData;
    setTableDataState(() => {
      return { data: newData };
    });
  }

  const searchPixelsHandler = async () => {
    let res = await searchPixels(searchAddressState);

    let newData = traiterPixelAAfficher(res);

    resetTableData();
    // Set new datas
    setTableDataState(() => {
      return { data: newData };
    });
  }

  const getMyPixelsHandler = async () => {
    let res = await getMyPixels();

    let newData = traiterPixelAAfficher(res);

    resetTableData();
    // Set new datas
    setTableDataState(() => {
      return { data: newData };
    });

  };


  function traiterPixelAAfficher(blockChainReturn) {
    console.log("blockChainReturn: ", blockChainReturn);

    var ownedByMe = [];
    var newData = tableDataDefault;

    for (var row = 0; row < blockChainReturn.length; row++) {
      var id = blockChainReturn[row].id;
      // var owner = blockChainReturn[row].owner;
      ownedByMe.push(Number(id));
    }

    console.log("Owned by me : ", ownedByMe);

    for (var i = 0; i < newData.length; i++) {
      for (var j = 0; j < newData.length; j++) {
        if (ownedByMe.indexOf(newData[i][j].id) !== -1) {
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
          {row.map((td, index) => (
            <TableTdButton key={"td-" + index} td={td} tdindex={index} />
          ))}
        </tr>
      );
    }
  }

  class TableTdButton extends Component {
    pixelClickHandler = async () => {
      console.log("Pixel clicked : ", this.props.td.id);
      let res = await takePixel(this.props.td.id);
      getMyPixelsButton();
    };


    render() {
      var td = this.props.td;
      return (
        <td key={td.coordId}>
          <button
            className={"pixels-button " + td.color}
            onClick={this.pixelClickHandler}
            style={{ background: td.color }}
            id={td.id}
          >
            {td.id}
          </button>
        </td>
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
