import React, { useState, useEffect } from "react";
import { Button, Modal, Confirm } from "semantic-ui-react";
import { KycActions } from "../../../../redux/_actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import ImageVideoModal from "../../../../components/Modal/ImageVideoModal";
import { getImageKitUrl } from "../../../../_utils";
import ReactPlayer from "react-player";
import {
  EyeOutlined,
} from "@ant-design/icons";

export default function ViewSellReport({ sellReportDetail, mySellActions }) {
  const [open, setOpen] = useState(false);
  const [reject, setReject] = useState(false);
  const [userId, setUserId] = useState("");
  const [remark, setRemark] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {}, [JSON.stringify(sellReportDetail)]);

  const splitfun = () => {
    //   console.log(
    //   (  (sellReportDetail?.editionTitle !== undefined? sellReportDetail?.editionTitle : sellReportDetail.title)
    //   .indexOf("#")),"testt")
    const idx = (
      sellReportDetail?.editionTitle !== undefined
        ? sellReportDetail?.editionTitle
        : sellReportDetail.title
    ).indexOf("#");

    let a =
      sellReportDetail?.editionTitle !== undefined
        ? sellReportDetail?.editionTitle
        : sellReportDetail.title;
    a.split("");
    // console.log(Number(a[idx+1]) >10 ?"1":"90","testt")
    return Number(a[idx + 1]) < 10 ? a[idx + 2] : a[idx + 1] + a[idx + 2];
  };

  const modalElements = (
    <>
      <ul>
        {/* <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Brand Name:</b>{" "}
          {sellReportDetail?.brandName}
        </li> */}
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Title:</b>{" "}
          {sellReportDetail?.editionTitle !== undefined
            ? sellReportDetail?.editionTitle
            : sellReportDetail.title}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Amount:</b>
          {sellReportDetail?.amount} xtz
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>No of Editions:</b>
          {sellReportDetail?.copies}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Sold Edition:</b>
          {(sellReportDetail?.editionTitle !== undefined
            ? sellReportDetail?.editionTitle
            : sellReportDetail.title
          ).includes("#")
            ? splitfun()
            : "N/A"}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Remarks:</b>{" "}
          {sellReportDetail?.remarks}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Buyer:</b>{" "}
          {sellReportDetail?.buyerName ? sellReportDetail?.buyerName : "N/A"}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>NFT Type:</b>{" "}
          {sellReportDetail?.fileType}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Seller:</b>
          {sellReportDetail?.sellerName ? sellReportDetail?.sellerName : "N/A"}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Payment By:</b>{" "}
          {sellReportDetail?.paymentGateway}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Txid:</b>{" "}
          {sellReportDetail?.orderId}
        </li>

        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>status:</b>{" "}
          {sellReportDetail?.status}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Date:</b>{" "}
          {sellReportDetail.createdAt
            ? moment(sellReportDetail.createdAt).format("MMMM Do YYYY, h:mm A")
            : "N/A"}
        </li>
        <li style={{ marginBottom: 12 }}>
          <b style={{ marginRight: 20, width: "100px" }}>Document:</b>{" "}
          {sellReportDetail.Image && (
            <a href={sellReportDetail.Image} target="_blank">
              {sellReportDetail.fileType === "video" ? (
                <ReactPlayer
                  url={sellReportDetail.Image}
                  width="100"
                  height="100"
                  loop={true}
                  muted={true}
                />
              ) : (
                // <video width="100" height="100" boxShadow="4px 6px #ebe7e7">
                //   <source src={sellReportDetail.Image} type="video/mp4" />
                // </video>
                <img
                  style={{
                    height: 100,
                    width: 100,
                    boxShadow: "4px 6px #ebe7e7",
                  }}
                  src={getImageKitUrl(sellReportDetail.Image)}
                />
              )}
            </a>
          )}
        </li>
      </ul>
    </>
  );
  return (
    <div style={{ marginLeft: "30px" }}>
      {/* <Confirm
        content="Are you sure? You want to accept User's KYC."
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
        }}
      /> */}

      <Modal
        trigger={
          <Button icon={<EyeOutlined />} />
        }
        header="Sales Report"
        content={modalElements}
        actions={[{ key: "done", content: "Done", primary: true }]}
      />
    </div>
  );
}

