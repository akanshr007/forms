import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import MainLayout from "../../../components/HOC/MainLayout";
import { CollectionActions } from "../../../redux/_actions";
import GlobalVariables from "../../../_constants/GlobalVariables";
import CollectionList from "./list/CollectionList";

const Collection = () => {
  const dispatch = useDispatch();
  const [collections, setCollections] = useState({ count: 0, rows: [] });

  const getCollections = useCallback(
    
    async (data) => {
      const { getCollections } = CollectionActions;
      const res = await dispatch(getCollections(data));
      if (res) {
        const {
          data: { data },
        } = res;
        setCollections(data);
      }
    },
    [dispatch]
  );
  
  // useEffect(() => {
  //   const { PAGE_LIMIT } = GlobalVariables;
  //   getCollections({ page: 0, limit: PAGE_LIMIT ,searchText:""});
  // }, [getCollections]);
// console.log(collections,"collections")
  return (
    <>
      <MainLayout>
        <CollectionList
          getCollections={getCollections}
          collections={collections}
        />
      </MainLayout>
    </>
  );
};

export default withRouter(Collection);
