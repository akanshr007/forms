import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Image, Table, Confirm, Button } from "semantic-ui-react";
import ImageVideoModal from "../../../components/Modal/ImageVideoModal";

const TableRows = ({ index, data, deleteExtraType, activePage }) => {
  const [open, setOpen] = useState(false);
  const [imageId, setImageId] = useState(null);
  return (
    <>
      <Confirm
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          deleteExtraType(imageId);
        }}
      />
      <Table.Row>
        <Table.Cell colSpan="2" collapsing textAlign="left">
          {activePage * 10 - 10 + index + 1}
        </Table.Cell>
        <Table.Cell collapsing colSpan="2" textAlign="left">
          <ImageVideoModal
            fileType="image"
            logo={data.extras_image}
            isLogo={true}
          />
        </Table.Cell>
        <Table.Cell collapsing colSpan="3" textAlign="left">
          {data.extras_name}
        </Table.Cell>
        <Table.Cell collapsing colSpan="3" textAlign="left">
          <Link to={`/panel/types/edit-type/${data.id}`}>
            <Icon name="edit" />
          </Link>
          <Icon
            style={{ marginLeft: "30px" }}
            name="delete"
            onClick={() => {
              setOpen(true);
              setImageId(data.id);
            }}
          />
        </Table.Cell>
      </Table.Row>
    </>
  );
};

export default TableRows;
