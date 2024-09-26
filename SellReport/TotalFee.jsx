import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";

import { Table } from "semantic-ui-react";
import { SellReportActions } from "../../../redux/_actions";

const TotalFee = () => {
  const dispatch = useDispatch();
  const [fee, setFee] = useState({
    adminFee: 0.0,
    transactionFee: 0.0,
  });

  const getToatalFees = useCallback(
    async (data) => {
      const { getTotalFee } = SellReportActions;
      const res = await dispatch(getTotalFee(data));
      if (res) {
        const {
          data: { data },
        } = res;
        setFee({
          adminFee: data[0].adminFee,
          transactionFee: data[0].transactionFee,
        });
      }
    },
    [dispatch]
  );
  useEffect(() => {
    getToatalFees();
  }, [getToatalFees]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Total Fee</h3>
      </div>
      <p>Overall Admin Fee and Transaction Fee </p>

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="9" textAlign="center">
              Admin Fee
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="9" textAlign="center">
              Transaction Fee
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body style={{ "text-transform": "capitalize" }}>
          <Table.Row>
            <Table.Cell collapsing colSpan="9" textAlign="center">
              <div
                style={{
                  textAlign: "center",

                  fontSize: "15px",
                }}
              >
                {fee?.adminFee } XTZ
              </div>
            </Table.Cell>
            <Table.Cell collapsing colSpan="9" textAlign="center">
              <div
                style={{
                  textAlign: "center",

                  fontSize: "15px",
                }}
              >
                {fee?.transactionFee } XTZ
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default withRouter(TotalFee);
