import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/HOC/MainLayout";
import AdminList from "./TransactionList.jsx";
import { TransactionFeeAction } from "../../../redux/_actions";
import { useDispatch } from "react-redux";
import TransactionList from "./TransactionList.jsx";
function TransactionFee() {
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

  const getTransactionFeeList = async () => {
    const { transactionFeeList } = TransactionFeeAction;
    const transactionFee = await dispatch(transactionFeeList());
    const rowData = transactionFee.data.data.rows;
    setFeeData(rowData?.filter((data) => data?.id === 1));

    //setFeeData(rows.filter((data) => data.types === "ADMIN"));
  };

  useEffect(() => {
    getTransactionFeeList();
  }, []);

  return (
    
      <TransactionList feeData={feeData} getTransactionFeeList={getTransactionFeeList} />
  );
}

export default TransactionFee;
