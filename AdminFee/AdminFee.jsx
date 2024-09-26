import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/HOC/MainLayout";
import AdminList from "./AdminList.jsx";
import { AdminFees } from "../../../redux/_actions";
import { useDispatch } from "react-redux";
function AdminFee() {
  const [feeData, setFeeData] = useState([]);

  // const rows = [
  //   {
  //     nft_fees_id: 1,
  //     fees: 80,
  //     types: "ADMIN",
  //     is_active: 1,
  //   },
  //   {
  //     nft_fees_id: 2,
  //     fees: 80,
  //     types: "ROYALTY",
  //     is_active: 1,
  //   },
  // ];
  const dispatch = useDispatch();

  const getNftFeeList = async () => {
    const { nftFeeList } = AdminFees;
    const nftFee = await dispatch(nftFeeList());
    const rowData = nftFee.data.data.rows;
    setFeeData(rowData.filter((data) => data.nft_fees_id === 1));

    //setFeeData(rows.filter((data) => data.types === "ADMIN"));
  };

  useEffect(() => {
    getNftFeeList();
  }, []);

  return (
      <AdminList feeData={feeData} getNftFeeList={getNftFeeList} />
  );
}

export default AdminFee;
