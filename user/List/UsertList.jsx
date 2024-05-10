import React, { useEffect, useMemo, useState, useCallback } from "react"; 
import "./UserList.scss";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";
import {
  Button,
  Icon,
  Pagination,
  Table,
  Image,
  Confirm,
  Input,
  Dropdown,
  Popup,
} from "semantic-ui-react";
import GlobalVariables from "../../../../_constants/GlobalVariables";
import { data } from "../../photographer/Dummy";
import { Link } from "react-router-dom";
import ImageVideoModal from "../../../../components/Modal/ImageVideoModal";
import UserDetails from "../../../../components/UserDetails/UserDetails";
import { useDispatch } from "react-redux";
import { BrandActions, UserActions } from "../../../../redux/_actions";
import "../user.scss";
import Enviroments from "../../../../_constants/Enviroment";
import debouce from "lodash.debounce";
import EditUserDetails from "../../../../components/EditUserDetails/EditUserDetails";
import AddUserDetails from "../../../../components/AddUserDetails /AddUserDetails";
import { DownloadIcon } from "../../../../Assets/SvgIcon/SvgIcon";
import { getTypeList } from "../../../../redux/_actions/addType.action";
import {
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

const UserList = ({
  getArtist,
  artist,
  brand,
  history,
  blockUser,
  setArtist,
  getAllArtist,
}) => {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [artistId, setArtistId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [activeuserstatus, setActiveuserstatus] = useState(1);
  const [userDetalisData, setUserDetalisData] = useState([]);
  const [userCategoryDetalisData, setUserCategoryDetalisData] = useState([]);
  const [edituserDetalisData, setEditUserDetalisData] = useState([]);
  const [editUserCategoryDetalisData, setEditUserCategoryDetalisData] =
    useState([]);
  const [userFilter, setUserFilter] = useState({ value: "", filter: "" });
  const [searchText, setSearchText] = useState("");
  const [userid, setUserId] = useState("");
  const [addUserModal, setAddUserModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const dispatch = useDispatch();
  const { USER_API_HOST } = Enviroments;
  const userDetails = async (id) => {
    const { userList } = BrandActions;

    const data = await dispatch(userList(id));
    const details = data?.data?.data?.userDetails[0];
    const UserCategoryDetails = data?.data?.data?.UserCategoryDetails;
    details && setUserCategoryDetalisData(UserCategoryDetails);
    details && setUserDetalisData(details);
    details && setShowDetail(true);
  };
  const editUserDetails = async (id) => {
    try {
      setUserId(id);
      const { userList } = BrandActions;
      const data = await dispatch(userList(id));
      const Details = data?.data?.data?.userDetails[0];
      const UserCategoryDetails = data?.data?.data?.UserCategoryDetails;
      Details && setEditUserDetalisData(Details);
      Details && setEditUserCategoryDetalisData(UserCategoryDetails);
      Details && setEditModal(true);
    } catch (error) {
      console.log(error, "Error");
    }
  };
  const downLoadUsers = useCallback(async () => {
    getAllArtist({ page: 0, limit: artist?.totalRecords });
  }, [getAllArtist, artist?.totalRecords]);

  const AddNewArtist = () => {
    history.push("/panel/artist/create-artist");
  };
  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActiveIndex(page);
    getArtist({
      page: page,
      limit: GlobalVariables.PAGE_LIMIT,
      role: selectedOption,
    });
  };
  let status = activeuserstatus == 0 ? "Block" : "Unblock";

  let modelcontent =
    "Are you sure you want to " + status.toLowerCase() + " user?";
  let payload = {
    userid: artistId,
    isActive: activeuserstatus,
  };

  const userFilters = async (search, typeSearch) => {
    const data = {
      limit: 10,
      offset: 0,
      fullname: "",
      email: "",
      role_type: "",
    };

    const uploadData = { ...data, [typeSearch]: search };

    const { searchBar } = UserActions;
    await dispatch(
      searchBar(uploadData).then((res) => {
        setArtist(res);
      })
    );
  };

  useEffect(() => {
    const filterId = setTimeout(() => {
      if (userFilter.value) userFilters(userFilter.value, userFilter.filter);
    }, 500);
    return () => clearTimeout(filterId);
  }, [userFilter]);

  const options = [
    { key: "user", text: "User", value: "user" },
    { key: "Photographer", text: "Photographer", value: "photographer" },
  ];

  const handleSearchChange = (e) => {
    let val = searchText;
    // if (val.length > 3) {
    setActiveIndex(1);
    getArtist({
      page: 0,
      limit: GlobalVariables.PAGE_LIMIT,
      searchText: searchText,
      role: selectedOption,
    });

    // }
    if (val.length === 0) {
      setSearchText("");
    }
  };
  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearchChange();
    }, 1000);

    return () => clearTimeout(getData);
  }, [searchText, selectedOption]);

  // const debouncedResults = useMemo(() => {
  //   return debouce(handleSearchChange, 300);
  // }, []);
  // useEffect(() => {
  //   return () => {
  //     debouncedResults.cancel();
  //   };
  // });

  const clearSearch = () => {
    // getArtist({
    //   page: 0,
    //   limit: GlobalVariables.PAGE_LIMIT,
    //   search: "",
    // });
    setSearchText("");
  };
  const filterOptions = [
    { key: 1, text: "All", value: "ALL" },
    { key: 2, text: "Photographer", value: 2 },
    { key: 3, text: "Musician", value: 3 },
    { key: 4, text: "User", value: 1 },
  ];

  return (
    <>
      <Confirm
        header={status + " User"}
        content={modelcontent}
        open={open}
        confirmButton="Yes"
        cancelButton="No"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          blockUser(payload);
          setSearchText("")
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Users</h3>
      </div>
      <div className="filterComponent">
        <p className="alignleft">List of all registered users</p>
      </div>

      {/* <div className="filltersUser"> */}
      {/*   <div className="filltersTop">
          <Input
            label="Full Name"
            icon={<Icon name="search" inverted circular link />}
            value={userFilter.filter === "fullname" ? userFilter.value : ""}
            onChange={(e) =>
              setUserFilter({ value: e.target.value, filter: "fullname" })
            }
            placeholder="Search..."
          />{" "} */}
          <div className="d-flex">
  <div className="seacrhboxTop">
    <Input
      label="Search"
      // icon={<Icon name="search" inverted circular link />}
      value={searchText}
      type="text"
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Search"
    />
    {searchText && (  // Render the clear button only when sechText is not empty
      <button className="closebtn" onClick={clearSearch}>
        x
      </button>
    )}
  </div>
        <div className="dropdown-container" style={{ width: '11%' }}>
          <Dropdown
            placeholder="Select Filter"
            fluid
            selection
            options={filterOptions}
            onChange={(e, { value }) => {
              setActiveIndex(1);
              setSelectedOption(value);
            }}
            trigger={
              <div>
                <Icon name="filter" color="grey" />
                <span>
                  {filterOptions.find(
                    (option) => option.value === selectedOption
                  )?.text || "Filter"}
                </span>
              </div>
            }
            style={{
              backgroundColor: "#f5f5f5",
              color: "#333",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button className="addButton" onClick={() => setAddUserModal(true)}>
            Add User
          </Button>
        </div>

        <div>
          <a
            href="#"
            onClick={downLoadUsers}
            style={{
              display: "flex",
              alignItems: "center", // Align items vertically
              marginLeft: "20px", // Add some space between buttons
            }}
          >
            <DownloadIcon style={{ marginRight: "5px" }} />{" "}
            {/* Adjust icon margin */}
            <p style={{ margin: "0" }}>Export</p>
          </a>
        </div>
      </div>
      {/* </div> */}
      {/* <div className="filltersBottom">
          <Dropdown
            placeholder="User Role.."
            fluid
            selection
            options={options}
            value={userFilter.filter === "role_type" ? userFilter.value : ""}
            onChange={(e, data) =>
              setUserFilter({ value: data.value, filter: "role_type" })
            }
          /> */}
      {/* <Button
            primary
            onClick={() => {
              getArtist({
                page: activeIndex,
                limit: GlobalVariables.PAGE_LIMIT,
              });

              setUserFilter({ value: "", filter: "" });
            }}
          >
            Reset
          </Button>
        </div> */}
      {/* </div> */}

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">#</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Full Name</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">User Name</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Email</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Mobile No.</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">Active</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">Type</Table.HeaderCell>
            <Table.HeaderCell colSpan="3">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {artist && artist?.data && artist?.data.length > 0 ? (
            artist?.data?.map((row, i) => (
              <Table.Row key={i}>
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {activeIndex * 10 - 10 + i + 1}
                </Table.Cell>
                <Table.Cell collapsing colSpan="3" textAlign="left">
                  {row?.role_type === 2 ? (
                    <a
                      style={{ color: "rgba(0,0,0,.87)" }}
                      href={`${USER_API_HOST}/photographersProfile/${row?.userId}`}
                      target="_blank"
                    >
                      {row.fullname}
                    </a>
                  ) : (
                    row.fullname
                  )}
                </Table.Cell>
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {/* <a
                style={{ color: "rgba(0,0,0,.87)" }}
                href={`https://qa-stage.cupchairs.com/photographersProfile/${row?.userId}`}
                target="_blank"
              >*/}
                  {row.username ? row.username : "NA"}
                  {/* </a> */}
                </Table.Cell>
                <Table.Cell collapsing colSpan="3" textAlign="left">
                  {row.email}
                  {/* <ReactTooltip multiline={true} id={`${i}`}>
                    <span style={{ width: '60px', whiteSpace: 'pre-wrap' }}>
                      {row?.description}
                    </span>
                  </ReactTooltip> */}
                </Table.Cell>
                <Table.Cell collapsing colSpan="3" textAlign="left">
                  {row.mobile_no ? row.dial_code : ""}{" "}
                  {row.mobile_no ? row.mobile_no : "NA"}
                </Table.Cell>
                {/* <Table.Cell collapsing colSpan='2' textAlign='left'>
                  <ImageVideoModal
                    fileType={'Artis Logo'}
                    logo={row.profileImage}
                  />
                </Table.Cell> */}
                {/* <Table.Cell collapsing colSpan='2' textAlign='left'>
                  <ImageVideoModal
                    fileType={'Cover Image'}
                    logo={row.coverImage}
                  />
                </Table.Cell> */}
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {row?.isActive == 1 ? "Yes" : "No"}
                </Table.Cell>
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {row?.role_type == 1
                    ? "User"
                    : row?.role_type == 2
                    ? "Photographer"
                    : "Musician"}
                </Table.Cell>
                <Table.Cell collapsing colSpan="2" textAlign="left">
                  {/* <Link to={`/panel/user/edit-user/${row?.userId}`}>
                    <Icon name='edit' />
                  </Link> */}

                  <span>
                    {/* <Button
                      className="ui primary button"
                      onClick={() => {
                        setArtistId(row?.userId);
                        setActiveuserstatus(row?.isActive == 1 ? 0 : 1);
                        setOpen(true);
                      }}
                    >
                      {row?.isActive == 1 ? "Block" : "Unblock"} User
                    </Button> */}
                    <Popup
                      trigger={
                        <Button
                          className={row?.isActive == 1 ? "" : "red_btn"}
                          icon
                          onClick={() => {
                            setArtistId(row?.userId);
                            setActiveuserstatus(row?.isActive == 1 ? 0 : 1);
                            setOpen(true);
                          }}
                        >
                          {row?.isActive == 1 ? (
                            <UnlockOutlined />
                          ) : (
                            <LockOutlined />
                          )}
                        </Button>
                      }
                      content={row?.isActive == 1 ? "Active" : "Block"}
                      basic
                    />

                    {row?.role_type !== 1 && (
                      <>
                        {/* <Button
                          className="ui primary button"
                          onClick={() => userDetails(row?.userId)}
                        >
                          Details
                        </Button> */}
                        <Popup
                          trigger={
                            <Button
                              icon
                              onClick={() => editUserDetails(row?.userId)}
                            >
                              <EyeOutlined />
                            </Button>
                          }
                          content={"View"}
                          basic
                        />
                      </>
                    )}
                    {row?.role_type !== 1 && (
                      <Popup
                        trigger={
                          <Button
                            icon
                            onClick={() => editUserDetails(row?.userId)}
                          >
                            <EditOutlined />
                          </Button>
                        }
                        content={"Edit"}
                        basic
                      />

                      // <Button
                      //   className="ui primary button"
                      //   onClick={() => editUserDetails(row?.userId)}
                      // >
                      //   Edit
                      // </Button>
                    )}
                    {/* <Icon
                      style={{ marginLeft: '30px' }}
                      onClick={() => {
                        setArtistId(row?.userId);
                        setOpen(true);
                      }}
                      name='delete'
                    /> */}
                  </span>
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

      {artist?.totalRecords &&
      artist?.totalRecords > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          defaultActivePage={1}
          activePage={activeIndex}
          totalPages={
            Math.ceil(
              parseInt(artist?.totalRecords) / GlobalVariables.PAGE_LIMIT
            ) || 1
          }
        />
      ) : (
        ""
      )}
      {/* FOR USER DETAILS MODAL */}
      {showDetail && (
        <UserDetails
          setOpen={setShowDetail}
          open={showDetail}
          userDetalisData={userDetalisData}
          userCategoryDetalisData={userCategoryDetalisData}
        />
      )}
      {/* FOR EDIT USER MODAL */}
      {editModal && (
        <EditUserDetails
          setOpen={setEditModal}
          open={editModal}
          userDetalisData={edituserDetalisData}
          userCategoryDetalisData={editUserCategoryDetalisData}
          userId={userid}
        />
      )}
      {/* FOR ADD USER MODAL */}
      {addUserModal && (
        <AddUserDetails
          setOpen={setAddUserModal}
          open={addUserModal}
          getArtist={getArtist}
        />
      )}
    </>
  );
};

export default withRouter(UserList);
