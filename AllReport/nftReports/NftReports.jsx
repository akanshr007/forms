import React, { useCallback, useEffect, useState } from "react";
import "./nftReports.scss";
import MainLayout from "../../../../components/HOC/MainLayout";
import { useDispatch } from "react-redux";
import { NftActions } from "../../../../redux/_actions";
import GlobalVariables from "../../../../_constants/GlobalVariables";
import ListNftReport from "./list/ListNftReport";

const NftReports = () => {
  const dispatch = useDispatch();
  const [nfts, setNfts] = useState({ count: 0, rows: [] });
  const [nftDetail, setNftDetail] = useState({});
  const [loading, setLoading] = useState(false);

  const getNftReports = useCallback(
    async (data) => {
      const { getNftReports } = NftActions;
      const res = await dispatch(getNftReports(data));
      if (res) {
        const rows =res.data.data
        setNfts({ ...nfts,rows });
      }
    },
    [dispatch]
  );
  useEffect(() => {
    getnftLocal();
  }, [getNftReports]);
  function getnftLocal() {
    const { PAGE_LIMIT } = GlobalVariables;
    getNftReports({ page: 0, limit: PAGE_LIMIT, query: "" });
  }
  const changeNftStatus = (data) => {
    let payload = {
      isActive: data?.action,
      id: data?.data?.nftId,
    };
    const { updateNftStatus } = NftActions;
    dispatch(updateNftStatus(payload)).then((data) => {
      if (data?.status === 200) {
        getnftLocal();
      }
    });
  };
  const searchNftQuery = (query) => {
    const { PAGE_LIMIT } = GlobalVariables;
    getNftReports({ page: 0, limit: PAGE_LIMIT, query: query });
  };
  const timeoutRef = React.useRef();
  const handleSearchChange = useCallback((e, data) => {
    clearTimeout(timeoutRef.current);

    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      data.value === "" ? getnftLocal() : searchNftQuery(data.value);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <ListNftReport
      getNftReports={getNftReports}
      nfts={nfts}
      changeNftStatus={changeNftStatus}
      handleSearchChange={handleSearchChange}
      loading={loading}
    />
  );
};

export default NftReports;
