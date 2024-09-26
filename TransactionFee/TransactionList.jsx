import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input, Popup, Table } from "semantic-ui-react";
import { TransactionFeeAction } from "../../../redux/_actions";
import AddTransactionFee from "./AddTransactionFee";
import AddFee from "./AddTransactionFee";
import { EditOutlined } from "@ant-design/icons";

function TransactionList({ feeData, getTransactionFeeList }) {
  const [feeInput, setFeeInput] = useState(false);
  const [feeValue, setFeeValue] = useState({ types: "", fees: "" });
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();

  const setTransactionFees = async (data) => {
    let tranFee = null;
    if (isEdit === false) {
      const { setTransactionFee } = TransactionFeeAction;
      tranFee = await dispatch(setTransactionFee(data));
    } else {
      const { updateTransactionFee } = TransactionFeeAction;
      tranFee = await dispatch(updateTransactionFee(data));
    }
    if (tranFee) {
      setFeeInput(false);
      getTransactionFeeList();
    }
  };

  return (
    <div>
      {!feeData[0] && (
        <Button primary onClick={() => setOpen(true)}>
          Add Fees
        </Button>
      )}
      {open && (
        <AddTransactionFee
          open={open}
          setOpen={() => setOpen(false)}
          setTransactionFees={setTransactionFees}
          data={feeValue}
        />
      )}
      <h4>Transaction Fee</h4>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">Serial no.</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">Fees</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Type</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Edit Fees</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {" "}
          {feeData[0] ? (
            feeData.map(({ id, fees, types }) => (
              <Table.Row>
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {id}
                </Table.Cell>{" "}
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {feeInput ? (
                    <Input
                      value={feeValue}
                      onChange={(e) => setFeeValue(e.target.value)}
                      type="number"
                      autoFocus={true}
                    ></Input>
                  ) : (
                    fees
                  )}{" "}
                  {types === "percentage" ? "" : "XTZ"}
                </Table.Cell>{" "}
                <Table.Cell collapsing colSpan="3" textAlign="left">
                  {types}
                </Table.Cell>{" "}
                <Table.Cell collapsing colSpan="3" textAlign="left">
                  {feeInput ? (
                    <>
                      <Button
                        primary
                        disabled={!feeValue || feeValue === fees}
                        onClick={setTransactionFees}
                      >
                        Save
                      </Button>
                      <Button secondary onClick={() => setFeeInput(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    // <Button
                    //   primary
                    //   onClick={() => {
                    //     setFeeValue({ types: types, fees });
                    //     setOpen(true);
                    //     setIsEdit(true);
                    //   }}
                    // >
                    //   Edit Fee
                    // </Button>
                    <Popup
                      trigger={
                        <Button
                          icon
                          onClick={() => {
                            setFeeValue({ types: types, fees });
                            setOpen(true);
                            setIsEdit(true);
                          }}
                        >
                          <EditOutlined />
                        </Button>
                      }
                      content="Edit"
                      basic
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell collapsing colSpan="18" textAlign="center">
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bolder",
                    fontSize: "15px",
                  }}
                >
                  No Record Found.
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TransactionList;
