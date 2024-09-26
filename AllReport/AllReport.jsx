import React from "react";
import MainLayout from "../../../components/HOC/MainLayout";
import NftReports from "./nftReports/NftReports";
import { Tab } from "semantic-ui-react";
import PhotographerReport from "./photographerReport/PhotographerReport";

function AllReport() {
  const panes = [
    {
      menuItem: "Artist Report",
      render: () => (
        <Tab.Pane attached={false}>
          <PhotographerReport />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "NFT Report",
      render: () => (
        <Tab.Pane attached={false}>
          <NftReports />
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

export default AllReport;
