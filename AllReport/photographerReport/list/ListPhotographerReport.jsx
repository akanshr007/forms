import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { Button, Pagination, Table, Input, Popup } from "semantic-ui-react";
import TableRows from "../../../../../components/TableRows";
import { NftActions } from "../../../../../redux/_actions";
import GlobalVariables from "../../../../../_constants/GlobalVariables";
import ResonModal from "./ResonModal";
import { EyeIcon } from "../../../../../Assets/SvgIcon/SvgIcon";
import { EyeOutlined } from "@ant-design/icons";

const ListPhotographerReport = ({
  getPhotoGrapherReports,
  history,
  photoGrapher,
  changeNftStatus,
  handleSearchChange,
  loading,
}) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {}, [photoGrapher]);
  const goToAddNftpage = () => {
    history.push("/panel/nfts/create-nft");
  };
  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActiveIndex(page);
    getPhotoGrapherReports({ page: page, limit: GlobalVariables.PAGE_LIMIT });
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
        <h3 className="pb-2">Artist Report</h3>
      </div>
      <p>List of all Artist Report</p>
      {open && (
        <ResonModal setOpen={() => setOpen(false)} open={open} data={data} />
      )}
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="1" textAlign="center">
              Serial no.
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="3" textAlign="center">
              Artist name
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="2" textAlign="center">
              User ID
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="2" textAlign="center">
              Report Count
            </Table.HeaderCell>
            {/* <Table.HeaderCell colSpan="4" textAlign="center">
              Comment
            </Table.HeaderCell> */}
            <Table.HeaderCell colSpan="2" textAlign="center">
              Action
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {photoGrapher.rows[0] ? (
            photoGrapher.rows.map((data, i) => (
              <Table.Row>
                <Table.Cell collapsing colSpan="1" textAlign="center">
                  {i + 1}
                </Table.Cell>
                <Table.Cell collapsing colSpan="3" textAlign="center">
                  {data.fullname}
                </Table.Cell>
                <Table.Cell collapsing colSpan="2" textAlign="center">
                  {data.photographerId}
                </Table.Cell>
                <Table.Cell collapsing colSpan="2" textAlign="center">
                  {data.count}
                </Table.Cell>
                {/* <Table.Cell collapsing colSpan="4" textAlign="center">
                  {data.comment}
                </Table.Cell> */}
                <Table.Cell collapsing colSpan="2" textAlign="center">
                  {/* <Button
                    onClick={() => {
                      setData(data.reason);
                      setOpen(true);
                    }}
                    primary
                  >
                    Show Reason
                  </Button> */}
                  <Popup
                    trigger={
                      <Button
                        icon
                        onClick={() => {
                          setData(data.reason);
                          setOpen(true);
                        }}
                      >
                        <EyeOutlined />
                      </Button>
                    }
                    content="View"
                    basic
                  />
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
      {photoGrapher.rows && photoGrapher.count > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          defaultActivePage={1}
          totalPages={
            Math.ceil(
              parseInt(photoGrapher.count) / GlobalVariables.PAGE_LIMIT
            ) || 1
          }
        />
      ) : (
        ""
      )}
    </>
  );
};
export default withRouter(ListPhotographerReport);
