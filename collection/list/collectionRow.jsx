import React from "react";
import { SortableHandle } from "react-sortable-hoc";
import styled from "styled-components";
import { Icon, Image, Table, Dropdown } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

const TrWrapper = styled.tr`
  background: blue;
  cursor: default;

  .firstElement {
    display: flex;
    flex-direction: row;
  }

  &.helperContainerClass {
    width: auto;
    border: 1px solid #efefef;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 3px;

    &:active {
      cursor: grabbing;
    }

    & > td {
      padding: 5px;
      text-align: left;
      width: 200px;
    }
  }
`;

const Handle = styled.div`
  margin-right: 10px;
  padding: 0 5px;
  cursor: grab;
`;

const RowHandler = SortableHandle(() => (
  <Handle className="handle">|==| </Handle>
));

const CollectionRow = ({
  no,
  activePage,
  index,
  logo,
  banner,
  name,
  description,
  brandName,
  isFeatured,
  collectionId,
  txId,
}) => {
  return (
    <TrWrapper className={"className"}>
      {/* <td>
        <div className="firstElement">
          <RowHandler  />
        </div>
      </td> */}
      <td>{activePage * 10 - 10 + no + 1}</td>
      <td>
        <Image src={`${logo}?tr=w-80,h-80`} width="80" height="80" />
      </td>
      <td>
        <Image src={`${banner}?tr=w-150,h-70`} width="150" height="70" />
      </td>
      <td>{name}</td>
      <td>
        <p data-tip="" data-for={`${no}`}>
          {" "}
          {description.substr(0, 20).substring(0, 60)}
          {description.substr(0, 20).length > 60 && "..."}
        </p>
        <ReactTooltip multiline={true} id={`${no}`}>
          <span style={{ whiteSpace: "pre-wrap" }}>{description}</span>
        </ReactTooltip>
      </td>
      <td>{brandName}</td>
      <td>{isFeatured ? "Yes" : "No"}</td>
      <td>
        {" "}
        <Link to={`/panel/collection/edit-collection/${collectionId}`}>
          <Icon name="edit" />
        </Link>
      </td>
    </TrWrapper>
  );
};

export default CollectionRow;
