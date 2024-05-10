import React, { useEffect, useState } from "react";
import { Button, Confirm, Table, Pagination, Popup } from "semantic-ui-react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ContactUsModal from "./contactUsModal";
import MainLayout from "../../../components/HOC/MainLayout";
import { useDispatch } from "react-redux";
import {
  getContactLabel,
  editOptions,
  removeOptions,
} from "../../../redux/_actions/user.action";
import cogoToast from "cogo-toast";
import GlobalVariables from "../../../_constants/GlobalVariables";
import { toast } from "../../../components/Toast/Toast";

const ContactPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ rows: [], count: "" });
  const [optionDetails, setOptionDetails] = useState("");
  const [type, setType] = useState("add");
  const [open, setOpen] = useState(false);
  const [deleteData, setdeleteData] = useState();
  const [page, setPage] = useState(1);

  // GET OPTIONS
  const getDetails = async () => {
    const getResponse = await dispatch(
      getContactLabel({ limit: 10, offset: page })
    );
    setData({
      rows: getResponse?.data?.data?.rows,
      count: getResponse?.data?.data?.count,
    });
  };
  const handlePageChange = async (e, data) => {
    let page = data.activePage;
    setPage(page);
  };
  useEffect(() => {
    getDetails();
  }, [page]);
  // OPEN MODAL
  const openModal = () => {
    setIsModalOpen(true);
  };
  // CLOSE MODAL
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // SUBMIT
  const handleSubmit = (option, id) => {
    closeModal();
  };
  const handleChange = (data) => {
    setType("edit");
    setOptionDetails(data);
    setIsModalOpen(true);
  };
  // EDIT
  const handleEdit = async (updateValue) => {
    try {
      const editPayload = {
        labelId: optionDetails?.id,
        user_label: updateValue,
      };
      const editResponse = await dispatch(editOptions(editPayload));
      if (editResponse?.status == 200) {
        toast.success("Edited Successfully");
      }
      editResponse && getDetails();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };
  // DELETE
  const handleDelete = async (data) => {
    try {
      const deleteResponse = await dispatch(removeOptions(data?.id));
      if (deleteResponse?.status == 200) {
        toast.success("Deleted Successfully");
      }
      deleteResponse && getDetails();
    } catch (error) {
      console.log(error);
    }
  };
  let modelcontent = "Are you sure you want to " + "delete this option?";

  const handleAddoption = () => {
    setType("add");
    openModal();
  };
  const payload = deleteData;

  return (
    <MainLayout>
      <Confirm
        header={"Delete Option"}
        content={modelcontent}
        open={open}
        confirmButton="Yes"
        cancelButton="No"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          handleDelete(payload);
        }}
      />
      <div className="contacts">
        <h2>Contact Options</h2>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            content="Add Option"
            color="blue"
            onClick={handleAddoption}
            style={{ marginBottom: "20px" }}
          />
        </div>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>#</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
              <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data && data?.rows?.length > 0 ? (
              data?.rows?.map((data, index) => (
                <Table.Row key={data?.id}>
                  <Table.Cell>{page * 10 - 10 + index + 1}</Table.Cell>
                  <Table.Cell>{data?.user_label}</Table.Cell>
                  <Table.Cell>
                    <Popup
                      trigger={
                        <Button icon onClick={() => handleChange(data)}>
                          <EditOutlined />
                        </Button>
                      }
                      content="Edit"
                      basic
                    />
                    <Popup
                      trigger={
                        <Button
                          icon
                          onClick={() => {
                            setdeleteData(data);
                            setOpen(true);
                          }}
                        >
                          <DeleteOutlined />
                        </Button>
                      }
                      content="Delete"
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
                      fontSize: "10x",
                    }}
                  >
                    No Record Found
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {data?.count && data?.count > GlobalVariables.PAGE_LIMIT ? (
          <Pagination
            onPageChange={handlePageChange}
            defaultActivePage={1}
            totalPages={
              Math.ceil(parseInt(data?.count) / GlobalVariables.PAGE_LIMIT) || 1
            }
          />
        ) : (
          ""
        )}

        {isModalOpen && (
          <ContactUsModal
            isOpen={isModalOpen}
            onClose={closeModal}
            optionDetails={optionDetails}
            handleEditSubmit={handleSubmit}
            type={type}
            handleEdit={handleEdit}
            getDetails={getDetails}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ContactPage;
  
