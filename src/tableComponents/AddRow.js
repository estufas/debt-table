import React , { useState }from "react";

export default function AddRow({submitHandler, newRow, updateRow, keyPressed, addNewRow, buttonState}) {

  return (
    <form id="add-row-form-id" className="add-row-form" onSubmit={submitHandler}>
      <div>
        <input
          className="creditorName"
          placeholder="Creditor"
          type="text"
          name="creditorName"
          value={newRow.creditorName}
          onChange={updateRow}
          onKeyPress={keyPressed}
        />
        <input
          className="firstName"
          placeholder="First Name"
          type="text"
          name="firstName"
          value={newRow.firstName}
          onChange={updateRow}
          onKeyPress={keyPressed}
        />
        <input
          className="lastName"
          placeholder="Last Name"
          name="lastName"
          type="text"
          value={newRow.lastName}
          onChange={updateRow}
          onKeyPress={keyPressed}
        />
        <input
          className="minPaymentPercentage"
          placeholder="Min Payment %"
          type="number"
          name="minPaymentPercentage"
          value={newRow.minPaymentPercentage}
          onChange={updateRow}
          onKeyPress={keyPressed}
        />
        <input
          className="balance"
          placeholder="Balance"
          type="number"
          name="balance"
          value={newRow.balance}
          onChange={updateRow}
          onKeyPress={keyPressed}
        />
        <button
          className="add-row-button"
          type="button"
          disabled={buttonState}
          onClick={addNewRow}
        >
          Add Row
        </button>
      </div>
    </form>
  );
}