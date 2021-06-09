import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import Table from "./Table";
import AddRow from "./AddRow";
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
            Footer: 'Min Pay %',
          },
          {
            Header: "Balance",
            accessor: "balance",
            Footer: info => {
              // Only calculate total visits if rows change
              const total = useMemo(
                () => {
                  let sum = 0;
                  info.rows.forEach(e => {
                    if(e.isSelected) {
                      sum += parseFloat(e.original.balance)
                    }
                  })
                  return sum;
                }
              )
              return <>Total: {total}</>
            },
          }
        ]
      }
    ],
    []
  );
  const [tableData, setTableData] = useState([]);
  const [newRow, setRow] = useState({
    id: "",
    firstName: "",
    lastName: "",
    creditorName: "",
    minPaymentPercentage: "",
    balance: 0
  });
  const [selectedRows, setSelectedRows] = useState({});

  // Receive data from TableRow
  const handleChange = data => {
    tableData[data.index] = data
  };

  // Add New Table Row
  const addNewRow = async (e) => {
    let result = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", {
      "functionName": "addRow",
      "data": newRow
    });
    setTableData(result.data.data);
    setRow({
      id: "",
      firstName: "",
      lastName: "",
      creditorName: "",
      minPaymentPercentage: "",
      balance: 0
    })
  };

  const resetDebtTable = async () => {
    let result = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", {
      "functionName": "resetData"
    });
    setTableData(result.data.data);
  };

  // Remove Table row if rows are count is more than 1
  const deleteRow = async (rows) => {
    let deleteRows = [];
    rows.forEach(e => {
      deleteRows.push(e.original);
    })
    let reqData = {
      "functionName": "removeRow",
      "data": deleteRows
    };
    console.log(reqData);
    let updatedDAta = await axios.post("https://uugye13j63.execute-api.us-east-1.amazonaws.com/debt-table", reqData);
    setTableData(updatedDAta.data.data);
  };

  const updateRow = ({ target }) => {
    // Update query onKeyPress of input box
    let value = target.value;
    if (target.type == "text") value = value.charAt(0).toUpperCase() + value.slice(1);
    setRow({
        ...newRow,
        id: tableData.length + 1,
        [target.name]: value
      }
    );
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
      <AddRow updateRow={updateRow} keyPressed={keyPressed} newRow={newRow} submitHandler={submitHandler} addNewRow={addNewRow} />
    </div>
  );
}

export default App;