import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import {
  Breadcrumb,
  Button,
  Confirm,
  Icon,
  Input,
  Pagination,
  Table,
} from "semantic-ui-react";
import TableRows from "../../../../components/TableRows";
import { CollectionActions } from "../../../../redux/_actions";
import GlobalVariables from "../../../../_constants/GlobalVariables";
import InfiniteScroll from "react-infinite-scroller";

import { SortableContainer, SortableElement } from "react-sortable-hoc";
import styled from "styled-components";
import CollectionRow from "./collectionRow";
import arrayMove from "./arrayMove";
import { toast } from "../../../../components/Toast/Toast";
import { SelectOutlined } from "@ant-design/icons";

const MyTableWrapper = styled.div`
  padding: 10px;

  .fixed_header {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    & > tbody {
      // display: block;
      width: 100%;
      overflow: auto;
      // height: 400px;
      cursor: grabbing;
      background: grey;

      tr {
        td {
          background: #fff;
        }
        &:nth-child(even) {
          td {
            background: #fbf8f8;
          }
        }
      }
    }

    & > thead {
      background: #efefef;
      color: black;
      width: 100%;
      & > tr {
        // display: block;
        //width: 793px;
      }
    }
    & > thead th {
      font-size: 16px;
      padding-top: 14px;
      padding-bottom: 14px;
      text-align: left;
      padding-left: 10px;
    }
    & > tbody td {
      padding: 5px;
      text-align: left;

      border-bottom: 1px solid #ccc;
    }
  }
`;

const SortableCont = SortableContainer(({ children }) => {
  return <tbody>{children}</tbody>;
});

const SortableItem = SortableElement((props) => <CollectionRow {...props} />);

const CollectionList = ({ getCollections, collections, history }) => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);
 
  const [searchText, setSearchText] = useState("")
  const [selectedOption, setSelectedOption] = useState("ALL");

  const dispatch = useDispatch();
  useEffect(() => {}, [items]);

  // const actionCollection = async (data) => {
  //   console.log(data,"datata")
  //   const { collectionUser } = CollectionActions;
  //   const { PAGE_LIMIT } = GlobalVariables;

  //   const res = await dispatch(collectionUser(data));
  //   console.log(res,"reeeeeeeeeeee")

  //   if (res) {
  //     getCollections({ page: activeIndex, limit: PAGE_LIMIT,searchText:""});
  //   }
  //   // if(data.status.isActive){
  //   //   toast.success("Collection enable success");
  //   // }else{
  //   //   toast.info("Collection disable");
  //   // }
  // };

  useEffect(() => {
    if (Array.isArray(collections?.rows) && collections?.rows.length > 0)  {
      setItems(collections?.rows);
    }
  }, [collections.rows]);
  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    setItems((oldItems) => arrayMove(oldItems, oldIndex, newIndex));
  }, []);

  const goToAddNftpage = () =>
    history.push("/panel/collection/create-collection");

  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActiveIndex(page);
    getCollections({ page:page, limit: GlobalVariables.PAGE_LIMIT ,role:selectedOption,search:searchText});
  };
 

 
  const handleSearchChange = (e) => {
    let val = searchText;
      getCollections({
        page: 0,
        limit: GlobalVariables.PAGE_LIMIT,
        searchText:searchText,
        role:selectedOption
      });
      setItems(collections?.rows)
      if (val.length === 0) {
       setSearchText("")
      }
    };
    useEffect(() => {
      const getData = setTimeout(() => {
        handleSearchChange()
      }, 1000)
      return () => clearTimeout(getData)
    }, [searchText, selectedOption])

    const clearSearch=()=>{
      // getCollections({
      //   page: 0,
      //   limit: GlobalVariables.PAGE_LIMIT,
      //   search:""
      // });
      setSearchText("");
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
        <h3>Collections </h3>
        {/* <Button className="addButton" onClick={goToAddNftpage}>
          Add New Collection
        </Button> */}
      </div>
      <p>List of all Artists collection</p>
      <div className="d-flex">
      <div className="seacrhboxTop">
        <Input
          label="Search"
          // icon={<Icon name="search" inverted circular link />}
          value={searchText}
          type="text"
          onChange={(e)=>setSearchText(e.target.value)}
          placeholder="Search"
        />
        {searchText &&( // Render the clear button only when serachText is not empty
        <button className="closebtn" onClick={clearSearch}>
          x
        </button>
        )}
      </div>
      </div>
      <Table className="mt-4" celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">Serial no.</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">Cover Image</Table.HeaderCell>
            {/*<Table.HeaderCell colSpan='2'>Cover Image</Table.HeaderCell>*/}
            <Table.HeaderCell colSpan="3">Title</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Description</Table.HeaderCell>
            {/*<Table.HeaderCell colSpan='3'>Brand Name</Table.HeaderCell>*/}
            {/*<Table.HeaderCell colSpan='3'>Is Featured</Table.HeaderCell>*/}
            <Table.HeaderCell colSpan="3">Created by</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">No. of NFTs</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((row, i) => (
              <TableRows
                isCollection={true}
                data={row}
                index={i}
                key={i}
                activePage={activeIndex}
                // actionCollection={actionCollection}
                searchText={searchText}
              />
            ))
          ) : (
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
          )}
        </Table.Body>
      </Table>

      {collections.rows && collections.count > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          activePage={activeIndex}
          totalPages={
            Math.ceil(
              parseInt(collections.count) / GlobalVariables.PAGE_LIMIT
            ) || 1
          }
        />
      ) : (
        ""
      )}
    </>
  );
};

export default withRouter(CollectionList);
