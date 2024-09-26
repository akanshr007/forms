import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import MainLayout from "../../../components/HOC/MainLayout";
import { KycActions } from "../../../redux/_actions";
import GlobalVariables from "../../../_constants/GlobalVariables";
import SellReportList from "./List/SellReportList";
import "./sellReport.scss";
import { SellReportActions } from "../../../redux/_actions";
// import { CollectionActions } from "../../../redux/_actions";

const SellReport = () => {
  const dispatch = useDispatch();
  const [sellReport, setSellReport] = useState({ rows: [], count: 0 });

  useEffect(() => {}, [JSON.stringify(sellReport)]);

  const getSellReportData = useCallback(
    async (data) => {
      const { getSellReport } = SellReportActions;
      const res = await dispatch(getSellReport(data));
      if (res) {
        const {
          data: { data },
        } = res;
        setSellReport(data);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const { PAGE_LIMIT } = GlobalVariables;
    getSellReportData({ id: 3, page: 0, limit: PAGE_LIMIT });
  }, [getSellReportData]);

  const sellReportActionsData = () => {
    const { PAGE_LIMIT } = GlobalVariables;
    getSellReportData({ id: 3, page: 0, limit: PAGE_LIMIT });
  };
  return (
    <>
      <SellReportList
        getSellReportData={getSellReportData}
        sellReport={sellReport}
        sellReportActionsData={sellReportActionsData}
        // deleteArtist={deleteArtist}
      />
    </>
  );
};

export default withRouter(SellReport);
