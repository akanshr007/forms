import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import MainLayout from "../../../components/HOC/MainLayout";
// import { BrandActions } from "../../../redux/_actions";
import GlobalVariables from "../../../_constants/GlobalVariables";
import UploadMinting from "./Upload/UploadMinting";

function Minting() {
  return (
    <>
      <MainLayout>
        <UploadMinting />
      </MainLayout>
    </>
  );
}

export default Minting;
