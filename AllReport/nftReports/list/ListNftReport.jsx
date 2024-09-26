import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { Button, Pagination, Table, Input } from "semantic-ui-react";

import GlobalVariables from "../../../../../_constants/GlobalVariables";
import ResonModal from "./ResonModal";

const ListNftReport = ({
  getNftReports,
  history,
  nfts,
  changeNftStatus,
  handleSearchChange,
  loading,
}) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {}, [nfts]);
  const goToAddNftpage = () => {
    history.push("/panel/nfts/create-nft");
  };
  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActiveIndex(page);
    getNftReports({ page: page, limit: GlobalVariables.PAGE_LIMIT });
  };
  const changeStatus = (action, values) => {
    let data = {
      action: action,
      data: values,
    };
    changeNftStatus(data);
  };
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <h3>NFTs</h3>
      </div>
      <p>List of all NFTs Reports</p>
      {open && (
        <ResonModal setOpen={() => setOpen(false)} open={open} data={data} />
      )}
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="1" textAlign="center" style={{whiteSpace:"nowrap"}}>Serial no.</Table.HeaderCell>
            <Table.HeaderCell colSpan="1" textAlign="center" style={{whiteSpace:"nowrap"}}>NFT ID</Table.HeaderCell>
            <Table.HeaderCell colSpan="1" textAlign="center" style={{whiteSpace:"nowrap"}}>Report Count</Table.HeaderCell>
            <Table.HeaderCell colSpan="2" textAlign="center">Title</Table.HeaderCell>
            {/* <Table.HeaderCell colSpan="3" textAlign="center">Comment</Table.HeaderCell> */}
            <Table.HeaderCell colSpan="1" textAlign="center">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {nfts.rows[0] ? (
            nfts.rows.map((data, i) => (
              <Table.Row>
                <Table.Cell collapsing colSpan="1" textAlign="center">{i + 1}</Table.Cell>
                <Table.Cell collapsing colSpan="1" textAlign="center">{data.nftId}</Table.Cell>
                <Table.Cell collapsing colSpan="1" textAlign="center">{data.count}</Table.Cell>
                <Table.Cell collapsing colSpan="2" textAlign="center">{data.title}</Table.Cell>
                {/* <Table.Cell collapsing colSpan="3" textAlign="center" style={{whiteSpace:"normal"}}>{data.comment}</Table.Cell> */}
                <Table.Cell collapsing colSpan="1" textAlign="center">
                  <Button onClick={() => {setData(data.reason);setOpen(true);}} primary style={{whiteSpace:"nowrap"}}>Show Report</Button>
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
      {nfts.rows && nfts.count > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          defaultActivePage={1}
          totalPages={
            Math.ceil(parseInt(nfts.count) / GlobalVariables.PAGE_LIMIT) || 1
          }
        />
      ) : (
        ""
      )}
    </>
  );
};
export default withRouter(ListNftReport);
