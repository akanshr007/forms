import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import MainLayout from '../../../components/HOC/MainLayout'
import { ArtistActions, BrandActions } from '../../../redux/_actions'
import GlobalVariables from '../../../_constants/GlobalVariables'
import ArtistList from './List/UsertList'
import './user.scss'
import { downloadExlFile } from '../../../_utils/downloadSpreadsheet'

const User = () => {
  const dispatch = useDispatch()
  const [artist, setArtist] = useState({ count: 10, rows: [] })

  useEffect(() => {
  }, [artist])
  const getArtist = useCallback(
    async data => {
      const { getArtist } = ArtistActions
      const res = await dispatch(getArtist(data))
     // console.log("res.res",res.data)
      if (res) {
        const {
          data: { data }
        } = res
        setArtist(res.data)
      }
    },
    [dispatch]
  )

  const getAllArtist = useCallback(
    async data => {
      const { getArtist } = ArtistActions
      const res = await dispatch(getArtist(data))
      if (res) {
const updatedData = res.data.data.map(data => ({
  FullName: data.fullname,
  UserName: data.username,
  Email: data.email,
  MobileNo: data.mobile_no,
  Active: data.isActive ? "Active" :"Inactive"  ,
  Type: data.role_type == 1 ? "User" : data.role_type == 2 ? "Photographer" : "Musician",
}))
        downloadExlFile(updatedData);
      }
    },
    [dispatch]
  )

  // useEffect(() => {
  //   const { PAGE_LIMIT } = GlobalVariables
  //   getArtist({ id: 3, page: 0, limit: PAGE_LIMIT })
  // }, [getArtist])

  const blockUser = data => {
    // alert("+++++ " + data);
    const { blockuserById } = ArtistActions
    dispatch(blockuserById(data)).then(_data => {
      if (_data) {
        const { PAGE_LIMIT } = GlobalVariables
        getArtist({ id: 3, page: 0, limit: PAGE_LIMIT })
      }
    })
  }
  return (
    <>
      <MainLayout>
        <ArtistList
          getArtist={getArtist}
          artist={artist}
          blockUser={blockUser}
          getAllArtist={getAllArtist}
          setArtist={setArtist}
        />
      </MainLayout>
    </>
  )
}

export default withRouter(User)
