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
  const addNewRow = () => {
    setTableData(tableData => tableData.concat(newRow));
  };

  const sumSelected = (rows) => {
    console.log(rows)
  }

  // Remove Table row if rows are count is more than 1
  const deleteRow = (rows) => {
    setSelectedRows(rows);
    let updatedRows = [...tableData]
    rows.forEach(element => {
      if(element.id > -1){
        updatedRows.splice((element.id), 1)
        setTableData(updatedRows);
      }
    });
  };

  const updateRow = ({ target }) => {
    // Update query onKeyPress of input box
    console.log(target.value);
    setRow({
        ...newRow,
        id: tableData.length + 1,
        [target.name]: target.value
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
    e.preventDefault()
  };

  useEffect(() => {
      (async () => {
        const result = await axios("https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json");
        setTableData(result.data);
      })();
    }, []);

  return (

    <div className="App">
      <Table columns={columns} data={tableData} handleDataChange={handleChange} deleteRow={deleteRow} />
      <AddRow updateRow={updateRow} keyPressed={keyPressed} newRow={newRow} submitHandler={submitHandler} addNewRow={addNewRow} sumSelected={sumSelected}/>
    </div>
  );
}

export default App;