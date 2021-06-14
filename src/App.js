import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import Table from "./tableComponents/Table";
import AddRow from "./tableComponents/AddRow";
import "./App.css";

function App() {
  const columns = useMemo(
    () => [
      {
        Header: "Banking Sheet",
        Footer: "Totals",
        columns: [
          {
            Header: "Creditor",
            accessor: "creditorName",
            Footer: 'Creditor',
          },
          {
            Header: "First Name",
            accessor: "firstName",
            Footer: 'First Name',
          },
          {
            Header: "Last Name",
            accessor: "lastName",
            Footer: 'Last Name',
          },
          {
            Header: "Min Pay %",
            accessor: "minPaymentPercentage",
            Cell: props => parseFloat(props.value),
            Footer: 'Min Pay %',
          },
          {
            Header: "Balance",
            accessor: "balance",
            Cell: props => <div> ${parseFloat(props.value)} </div>,
            Footer: info => {
              // Only calculate total visits if rows change
              const total = useMemo(
                () => {
                  let sum = 0;
                  let counter = 0;
                  let totalRows = 0;
                  info.rows.forEach(e => {
                    totalRows += 1;
                    if(e.isSelected) {
                      sum += parseFloat(e.original.balance);
                      counter += 1;
                    }
                  })
                  return {
                    "sum": sum,
                    "counter": counter,
                    "totalRows": totalRows
                  }
                }
              )
              return <>Total: ${total.sum} <div className="footer-total-text"><b>{total.counter}/{total.totalRows} selected</b></div>  </>
            },
          }
        ]
      }
    ],
    []
  );

  // Set state for table data and new Row
  const [tableData, setTableData] = useState([]);
  const [errorState, setErrorState] = useState("");
  const [buttonState, setButtonState] = useState(true);
  const [newRow, setRow] = useState({
    id: "",
    firstName: "",
    lastName: "",
    creditorName: "",
    minPaymentPercentage: "",
    balance: 0
  });

  const checkFields = (obj) => {
    for(var i in obj)
      if(!obj[i]) {
        setButtonState( true);
        return;
      }
    setButtonState(false);
    return;
  }

  // Receive data from TableRow
  const handleChange = data => {
    tableData[data.index] = data
  };

  // Add New Table Row
  const addNewRow = async (e) => {
    try {
      let result = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", {
        "functionName": "addRow",
        "data": newRow
      });
      setTableData(result.data.data);
      let resetRow = {
        id: "",
        firstName: "",
        lastName: "",
        creditorName: "",
        minPaymentPercentage: "",
        balance: 0
      }
      setRow(resetRow);
      checkFields(resetRow);
    } catch (err) {
      if (err.response) {
        setErrorState(err.response.data.message);
        alert(err.response.data.message);
      } else {
        setErrorState('server error');
        alert('server error');
      };
    };
  };

  // Reset table data to original state
  const resetDebtTable = async () => {
    let result = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", {
      "functionName": "resetData"
    });
    setTableData(result.data.data);
  };

  // Remove Table rows from S3 version
  const deleteRow = async (rows) => {
    let deleteRows = [];
    rows.forEach(e => {
      deleteRows.push(e.original);
    })
    let reqData = {
      "functionName": "removeRow",
      "data": deleteRows
    };
    let updatedDAta = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", reqData);
    setTableData(updatedDAta.data.data);
  };

  // Update row objt on change
  const updateRow = ({ target }) => {
    // Update query onKeyPress of input box
    let value = target.value;
    if (target.type === "text") value = value.charAt(0).toUpperCase() + value.slice(1);
    setRow({
        ...newRow,
        id: tableData.length + 1,
        [target.name]: value
      }
    );
    checkFields(newRow);
  };

  const keyPressed = ({ key }) => {
    // Capture search on Enter key
    if (key === "Enter") {
      addNewRow()
    };
  };

  const submitHandler = e => {
    // Prevent form submission on Enter key
    console.log(e)
    e.preventDefault()
  };

  useEffect(() => {
      (async () => {
        const result = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", {
          "functionName": "queryData"
        });
        setTableData(result.data.data);
      })();
    }, []);

  return (

    <div className="App">
      <Table columns={columns} data={tableData} handleDataChange={handleChange} deleteRow={deleteRow} resetDebtTable={resetDebtTable}/>
      <AddRow buttonState={buttonState} updateRow={updateRow} keyPressed={keyPressed} newRow={newRow} submitHandler={submitHandler} addNewRow={addNewRow} />
    </div>
  );
}

export default App;