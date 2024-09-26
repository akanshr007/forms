import React from "react";
import { Button, Modal, Table } from "semantic-ui-react";

function ResonModal({ setOpen, open, data }) {
  return (
    <Modal onClose={setOpen} open={open}>
      <Modal.Header>Report Details</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="3" textAlign="center">Serial no.</Table.HeaderCell>
                <Table.HeaderCell colSpan="3" textAlign="center">Reason</Table.HeaderCell>
                <Table.HeaderCell colSpan="3" textAlign="center">Count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((data, i) => (
                <Table.Row>
                  <Table.Cell collapsing colSpan="3" textAlign="center">
                    {i + 1}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="3" textAlign="center">
                    {data.reason}
                  </Table.Cell>
                  <Table.Cell collapsing colSpan="3" textAlign="center">
                    {data.count}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ResonModal;
