import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Icon, Input, Popup, Table } from "semantic-ui-react";
import { AdminFees } from "../../../redux/_actions";
import AddFee from "./AddFee";
import { EditOutlined } from "@ant-design/icons";

function AdminList({ feeData, getNftFeeList }) {
  const [feeInput, setFeeInput] = useState(false);
  const [feeValue, setFeeValue] = useState({ types: "", fees: "" });
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();

  const setNftFees = async (data) => {
    let nftFee = null;
    if (isEdit === false) {
      const { setNftFee } = AdminFees;
      nftFee = await dispatch(setNftFee(data));
    } else {
      const { updateNftFee } = AdminFees;
      nftFee = await dispatch(updateNftFee(data));
    }
    if (nftFee) {
      setFeeInput(false);
      getNftFeeList();
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
        <AddFee
          open={open}
          setOpen={() => setOpen(false)}
          setNftFees={setNftFees}
          data={feeValue}
        />
      )}
      <h4>Admin Commission</h4>
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
            feeData.map(({ nft_fees_id, fees, types }) => (
              <Table.Row>
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {nft_fees_id}
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
                        onClick={setNftFees}
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

export default AdminList;
