import React, { useCallback, useEffect, useState } from "react";
import { Pagination, Table, Dropdown, Icon, Checkbox, Confirm, Popup, Radio } from "semantic-ui-react";
import ImageVideoModal from "../../../components/Modal/ImageVideoModal";
import moment from "moment";
import GlobalVariables from "../../../_constants/GlobalVariables";
import { useDispatch } from "react-redux";
import { SellReportActions } from "../../../redux/_actions";
import { getSocialEarning } from "../../../redux/_actions/sellReport.action";
import { updateSocialCredit } from "../../../redux/_actions/sellReport.action";

const SocialEarning = () => {
  const [earning, setEarning] = useState();
  const [activeIndex, setActiveIndex] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [socialCredit, setSocialCredit] = useState("");
  const [open, setOpen] = useState(false);
  const [currentToggleState, setCurrentToggleState] = useState(false);
  const [modalData, setModalData] = useState({});
  const [action, setAction] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(null);

  const dispatch = useDispatch();

  const getSocialEarningData = useCallback(
    async (data) => {
      const { getSocialEarning } = SellReportActions;
      const res = await dispatch(getSocialEarning(data));
      if (res) {
        const {
          data: { data },
        } = res;
        setEarning(data);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const { PAGE_LIMIT } = GlobalVariables;
    getSocialEarningData({
      id: 3,
      page: 1,
      limit: PAGE_LIMIT,
      status: statusFilter,
    });
  }, [getSocialEarningData, statusFilter]);

  const handlePageClick = (e, pageInfo) => {
    let page = pageInfo.activePage;
    setActiveIndex(page);
    getSocialEarningData({
      page: page,
      limit: GlobalVariables.PAGE_LIMIT,
      status: statusFilter,
      role: selectedOption,
    });
  };
  const handleFilterChange = (e, { value }) => {
    setStatusFilter(value);
    setActiveIndex(1); // Reset to first page
    getSocialEarningData({
      page: 1,
      limit: GlobalVariables.PAGE_LIMIT,
      status: value,
      role: selectedOption,
    });
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      handleFilterChange();
    }, 1000);

    return () => clearTimeout(getData);
  }, [selectedOption, statusFilter, getSocialEarningData]);

  const handleToggle = async (idx) => {
    // setCurrentToggleState(!currentToggleState)
    setConfirmOpen(false);
    try {
      // let allData = [...earning?.rows];
      let { id, credit } = earning?.rows[idx];

      console.log(idx, "datatatata", id, credit)
      const payload = {
        id: id,
        credit: credit === "1" ? false : true,
      }
      const socialEarnings = await dispatch(updateSocialCredit(payload));
      //  allData[idx].credit = credit === "1" ? "0" : "1";
      //  console.log(allData,"socialEarnings")
      setEarning({
        ...earning,
        rows: earning?.rows.map((row, index) => (index === idx ? { ...row, credit: credit === "1" ? "0" : "1" } : row)),
      });
    } catch (error) {
      console.log(error, "error")

    }
  };
  const openConfirm = (idx) => {
    setToggleIndex(idx);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    handleToggle(toggleIndex);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };
  console.log(earning?.rows, "socialEarnings11111")
  const filterOptions = [
    { key: "PENDING", text: "Pending", value: "PENDING" },
    { key: "SETTLED", text: "Settled", value: "SETTLED" },
    { key: "ALL", text: "All", value: "ALL" },

  ];
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
        <h3>Social Earnings</h3>
        <div className="dropdown-container" style={{ width: '13%' }}>
          <Dropdown
            placeholder="Select Status"
            fluid
            selection
            options={filterOptions}
            onChange={handleFilterChange}
            value={statusFilter}
            style={{
              backgroundColor: "#f5f5f5",
              color: "#333",
              borderRadius: "4px",
              height: "30px",
              // width: "200px"|
            }}
          />
        </div>
      </div>
      <p>Social Earning Report</p>

      <div className="outtable mb-4">
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">Serial no.</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">NFT Image/Video</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">NFT Title</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Owner</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Earning($)</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Earning(ꜩ)</Table.HeaderCell>
              {/* <Table.HeaderCell colSpan="2">Currency</Table.HeaderCell> */}
              <Table.HeaderCell colSpan="2">Platform</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Date</Table.HeaderCell>
              <Table.HeaderCell colSpan="2">Status</Table.HeaderCell>
              <Table.HeaderCell colSpan="3">Credits</Table.HeaderCell>

            </Table.Row>
          </Table.Header>


          <Table.Body style={{ "text-transform": "capitalize" }}>
            {earning?.rows && earning?.rows.length > 0 ? (
              earning?.rows.map((row, index) => (
                <Table.Row key={index}>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {activeIndex * 10 - 10 + index + 1}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    <ImageVideoModal
                      fileType={"video"}
                      logo={row?.nfts?.socialLink}
                      thumbnail={row?.nfts?.thumbnail}
                    />
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row?.nfts?.title}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row?.owners?.name}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {JSON.parse(row?.earning).toFixed(4) + " $"}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {JSON.parse(row?.tezos_earning).toFixed(4) + " ꜩ"}
                  </Table.Cell>
                  {/* <Table.Cell collapsing colSpan="2" textAlign="left">
                  ꜩ
                </Table.Cell> */}
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row?.platforms?.name}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row.createdAt
                      ? moment(row.createdAt).format("DD-MM-YYYY HH:mm:ss")
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="2" textAlign="left">
                    {row?.status === "PENDING" ? "Pending" : "Settled"}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="3" textAlign="center">
                    {row.status === "PENDING" ? (
                      <span onClick={() => openConfirm(index)}>
                        <Popup
                          trigger={
                            <Radio
                              toggle
                              // defaultChecked={Number(row?.credit)}
                              checked={Number(row?.credit)}
                            />
                          }
                          content={currentToggleState ? "Enable" : "Disable"}
                          basic
                        />
                      </span>
                    ) : "-"}
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
                <Table.Cell collapsing colSpan="3" textAlign="left">
                  {/* <span onClick={() => handleToggleClick(data)}> 
                  trigger={
                    <Radio
                      toggle
                      checked={}
                    />
                  }
                  content={} 
                  basic
                />
              </span> */}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {earning?.count && earning?.count > GlobalVariables.PAGE_LIMIT ? (
        <Pagination
          onPageChange={handlePageClick}
          defaultActivePage={1}
          totalPages={Math.ceil(
            parseInt(earning.count) / GlobalVariables.PAGE_LIMIT
          )}
        />
      ) : (
        ""
      )}
      <Confirm
        header="Social Credits"
        open={confirmOpen}
        confirmButton="Yes"
        cancelButton="No"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        content="Are you sure you want to change the credit status?"
      />

    </>
  );
};

export default SocialEarning;
