import React from "react";
import MainLayout from "../../../components/HOC/MainLayout.jsx";
import NftReports from "../AllReport/nftReports/NftReports.jsx";
import { Tab } from "semantic-ui-react";
import PhotographerReport from "../AllReport/photographerReport/PhotographerReport.jsx";
import SellReport from "./SellReport.jsx";
import TotalFee from "./TotalFee.jsx";
import SocialEarning from "./SocialEarning.jsx";

function SaleReport() {
  const panes = [
    {
      menuItem: "Sales Report",
      render: () => (
        <Tab.Pane attached={false}>
          <SellReport />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Total Fees",
      render: () => (
        <Tab.Pane attached={false}>
          <TotalFee />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Social Earnings",
      render: () => (
        <Tab.Pane attached={false}>
          <SocialEarning />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <MainLayout>
     
        <Tab menu={{ pointing: true }} panes={panes} />
      

    </MainLayout>
  );
}

export default SaleReport;
