import React, { useState } from "react";
import { Accordion, Icon, Table } from "semantic-ui-react";
import * as moment from "moment";

function ErrorLogs(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  return (
    <div className="errorLogs">
      <Accordion styled style={{ width: "100%" }}>
        {Array.isArray(props.records) &&
          props.records?.map((data, index) => (
            <>
              <Accordion.Title
                active={activeIndex === index}
                index={index}
                onClick={handleClick}
              >
                <Icon name="dropdown" />
                Error log generated at{" "}
                {moment(data?.updatedAt).format("YYYY-MM-DD HH:MM:SS")}
                {" - "}
                <span
                  style={{
                    color:
                      data?.status === "PENDING"
                        ? "red"
                        : data.status === "COMPLETED"
                        ? "green"
                        : "red",
                  }}
                >
                  {data?.status}
                </span>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index}>
                <Table celled striped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan="3">NFT Title</Table.HeaderCell>
                      <Table.HeaderCell colSpan="3">Message</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Array.isArray(data?.response) &&
                      data?.response?.map((detail, _index) => (
                        <Table.Row key={_index}>
                          <Table.Cell colSpan="3">{detail?.title}</Table.Cell>
                          <Table.Cell colSpan="3">{detail?.message}</Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
              </Accordion.Content>
            </>
          ))}
      </Accordion>
    </div>
  );
}

export default ErrorLogs;
