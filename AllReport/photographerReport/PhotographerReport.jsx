import React, { useCallback, useEffect, useState } from 'react'
import ListPhotographerReport from './list/ListPhotographerReport'
import "./PhotographerReport.scss"

import { useDispatch } from "react-redux";
import GlobalVariables from '../../../../_constants/GlobalVariables';
import { NftActions } from '../../../../redux/_actions';

const PhotographerReport = () => {
    const dispatch = useDispatch();
    const [photoGrapher, setphotoGrapher] = useState({ count: 0, rows: [] });
    const [nftDetail, setNftDetail] = useState({});
    const [loading, setLoading] = useState(false);
  
    const getPhotoGrapherReports = useCallback(
      async (data) => {
        const { getPhotoGrapherReports } = NftActions;
        const res = await dispatch(getPhotoGrapherReports(data));
        if (res) {
          const rows =res.data.data
          setphotoGrapher({ ...photoGrapher,rows });
        }
      },
      [dispatch]
    );
    useEffect(() => {
      getnftLocal();
    }, [getPhotoGrapherReports]);
    function getnftLocal() {
      const { PAGE_LIMIT } = GlobalVariables;
      getPhotoGrapherReports({ page: 0, limit: PAGE_LIMIT, query: "" });
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
      getPhotoGrapherReports({ page: 0, limit: PAGE_LIMIT, query: query });
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
    <ListPhotographerReport
        getPhotoGrapherReports={getPhotoGrapherReports}
        photoGrapher={photoGrapher}
        changeNftStatus={changeNftStatus}
        handleSearchChange={handleSearchChange}
        loading={loading}
    />
  )
}

export default PhotographerReport