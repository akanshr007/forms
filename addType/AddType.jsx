import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import MainLayout from "../../../components/HOC/MainLayout";
import { BannerActions, AddTypeAction } from "../../../redux/_actions";
import GlobalVariables from "../../../_constants/GlobalVariables";
// import BannerList from "./list/BannerList";
import "./addType.scss";
import AddTypeList from "./list/AddTypeList";

const AddType = () => {
  const dispatch = useDispatch();
  const [extraTypes, setExtraTypes] = useState({ count: 0, rows: [] });

  const getTypeList = useCallback(
    async (data) => {
      const { getTypeList } = AddTypeAction;
      const res = await dispatch(getTypeList(data));
      if (res) {
        const {
          data: { data },
        } = res;
        const finalData = { count: 0, rows: data };
        setExtraTypes(finalData);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const { PAGE_LIMIT } = GlobalVariables;
    getTypeList({ page: 0, limit: PAGE_LIMIT });
  }, [getTypeList]);
  return (
    <>
      <MainLayout>
        <AddTypeList getTypeList={getTypeList} extraTypes={extraTypes} />
      </MainLayout>
    </>
  );
};

export default withRouter(AddType);
