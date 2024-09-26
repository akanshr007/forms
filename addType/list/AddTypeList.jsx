import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { Breadcrumb, Button, Icon, Pagination, Table } from "semantic-ui-react";
import TableRows from "../TableRows";
import { AddTypeAction, BannerActions } from "../../../../redux/_actions";
import GlobalVariables from "../../../../_constants/GlobalVariables";
import { toast } from "../../../../components/Toast/Toast";


const AddTypeList = ({ getTypeList, extraTypes, history }) => {
  const [activePage, setActivePage] = useState(1);
  const dispatch = useDispatch();
  const goToAddNftpage = () => history.push("/panel/types/create-type");

  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActivePage(page);
    getTypeList({ page: page, limit: GlobalVariables.PAGE_LIMIT });
  };

  const deleteExtraType = async (data) => {
    let { deleteType } = AddTypeAction;
    await dispatch(deleteType(data)).then((response) => {
      if (response) {
        getTypeList({ page: activePage, limit: GlobalVariables.PAGE_LIMIT });
      }
    });
    // dataRes.then((data) => {
    //   console.log(data);
    //   toast.success(data?.message);
    // });
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
        <h3>Types</h3>

        <Button className="addButton" onClick={goToAddNftpage}>
          Add New Type
        </Button>
      </div>
      <p>List of Type's which are shown in nft detail page.</p>

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">Serial no.</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">Image</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Title</Table.HeaderCell>
            {/* <Table.HeaderCell colSpan="3">Sub Title</Table.HeaderCell> */}
            <Table.HeaderCell colSpan="3">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {extraTypes.rows && extraTypes.rows.length > 0 ? (
            extraTypes.rows.map((row, i) => (
              <TableRows
                key={i}
                data={row}
                index={i}
                deleteExtraType={deleteExtraType}
                activePage={activePage}
              />
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

      {/* {extraTypes.rows && extraTypes.count > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          defaultActivePage={activePage}
          totalPages={
            Math.ceil(
              parseInt(extraTypes.count) / GlobalVariables.PAGE_LIMIT
            ) || 1
          }
        />
      ) : (
        ""
      )} */}
    </>
  );
};

export default withRouter(AddTypeList);
