import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";

import {
  Button,
  Icon,
  Pagination,
  Table,
  Image,
  Confirm,
} from "semantic-ui-react";
import GlobalVariables from "../../../../_constants/GlobalVariables";
import { Link } from "react-router-dom";
import ViewSellReport from "./ViewSellReport";
import moment from "moment";
import ImageVideoModal from "../../../../components/Modal/ImageVideoModal";

const SellReportList = ({
  getSellReportData,
  sellReport,
  brand,
  history,
  deleteArtist,
  sellReportActionsData,
}) => {
  const [open, setOpen] = useState(false);
  const [artistId, setArtistId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    // console.log('dksjhfsdkjfhksjdf : ', sellReport)
  }, [JSON.stringify(sellReport)]);

  const AddNewArtist = () => {
    history.push("/panel/artist/create-artist");
  };
  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActiveIndex(page);
    getSellReportData({ page: page, limit: GlobalVariables.PAGE_LIMIT });
  };

  const mySellActions = () => {
    sellReportActionsData();
  };
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
        <h3>Sales Report</h3>
      </div>
      <p>Overall Sales Report</p>
      <div className="outtable mb-4">
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">Serial no.</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">NFT Id</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">NFT Image/Video</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">NFT Title</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Seller</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Price</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Buyer</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Admin Fee</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">transaction Fee</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Date</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">View Detail</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body style={{ "text-transform": "capitalize" }}>
            {sellReport?.rows && sellReport?.rows.length > 0 ? (
              sellReport?.rows.map((row, i) => (
                <Table.Row key={i}>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {activeIndex * 10 - 10 + i + 1}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                  {row.nftId ? row.nftId : "N/A"}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    <ImageVideoModal fileType={row.fileType} logo={row.Image} thumbnail={row?.thumbnail}/>
                    </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row?.editionTitle !== undefined
                      ? row?.editionTitle
                      : row.title}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row?.sellerName === "admin"
                      ? "Cupchairs"
                      : row?.sellerName || "N/A"}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row.amount ? row.amount + " XTZ" : "N/A"}
                  </Table.Cell>

                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row.buyerName ? row.buyerName : "N/A"}
                  </Table.Cell>

                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {/* {row.adminFee ? row.adminFee : "N/A"}xtz */}
                    {row.adminFeeType === "fixed"
                      ? row?.adminFee || 0
                      : `${(
                          (row.nftOriginalPrice * row?.adminFee || 0) / 100
                        ).toFixed(2)}`}{" "}
                    XTZ
                  </Table.Cell>

                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row.txnFeeType === "fixed"
                      ? row?.txnFee || 0
                      : `${(
                          (row.nftOriginalPrice * row?.txnFee || 0) / 100
                        ).toFixed(2)}`}{" "}
                    XTZ
                  </Table.Cell>

                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row.createdAt
                      ? moment(row.createdAt).format("DD-MM-YYYY HH:MM:SS")
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    <div className="modalData">
                      <ViewSellReport
                        sellReportDetail={row}
                        mySellActions={mySellActions}
                      />
                    </div>
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

      {sellReport?.count && sellReport?.count > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          defaultActivePage={1}
          totalPages={Math.ceil(
            parseInt(sellReport.count) / GlobalVariables.PAGE_LIMIT
          )}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default withRouter(SellReportList);
