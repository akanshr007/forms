import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  MintActions,
  LoadingActions,
  NftActions,
} from "../../../../redux/_actions";
import { Button } from "semantic-ui-react";
import * as Yup from "yup";
// import Select from "react-select";
import { toast } from "../../../../components/Toast/Toast";
import "./UploadingMintingStyle.scss";
// import { Icon, Table } from "semantic-ui-react";
import { uploadBulkImage } from "../../../../redux/_actions/minting.action";
import ErrorLogs from "./ErrorLogs";
import { BannerActions } from "../../../../redux/_actions";

// const optionList = {
//   brands: [
//     {
//       title: "Sentra",
//       id: 4,
//     },
//     {
//       title: "Maxima",
//       id: 4,
//     },
//     {
//       title: "Skyline",
//       id: 2,
//     },
//   ],
//   artists: [
//     {
//       title: "Taurus",
//       id: 4,
//     },
//     {
//       title: "Escort",
//       id: 4,
//     },
//   ],
// };

function UploadMinting({ isImageMinting, setIsImageMinting }) {
  const [records, setRecords] = useState([]);
  const [isMinting, setIsMinting] = useState("");
  const [myInterval, setMyInterval] = useState("");
  const [link, setLink] = useState("");
  const [fileType, setFileType] = useState("Image");
  const [blockChainName, setBlockChainName] = useState([]);
  const [selectedBlockchainName, setSelectedBlockChainName] =
    useState("Select Blockchain");
  const [check, setCheck] = useState(false);
  const [optionList, setOptionList] = useState({ brands: [], artists: [] });
  // const [InputKey, setInputKey] = useState();

  const [bulk, setBulk] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMinting === "COMPLETED") {
      getErrorLogs();
    }
    getMintingStatus();
    if (isMinting !== "PENDING") {
      clearInterval(myInterval);
    }
  }, [isMinting]);

  useEffect(() => {
    getErrorLogs();
    getBrandArtist();
    const { getMintStatus } = MintActions;
    dispatch(getMintStatus()).then((data) => {
      setIsMinting(data?.data?.status);
      setCheck(true);
    });
    return () => clearInterval(myInterval);
  }, []);

  const getBrandArtist = () => {
    const { getBrandArtistList } = BannerActions;
    dispatch(getBrandArtistList()).then((_data) => {
      setOptionList(_data);
    });
  };
  const getMintingStatus = () => {
    let myIntervals = "";
    if (isMinting === "PENDING") {
      myIntervals = setInterval(() => {
        const { getMintStatus } = MintActions;
        dispatch(getMintStatus()).then((data) => {
          setIsMinting(data?.data?.status);
          if (data?.data?.status === "COMPLETED") {
            // getErrorLogs();
            setIsMinting(data?.data?.status);
          }
        });
      }, 5000);
      setMyInterval(myIntervals);
    }
    return () => clearInterval(myInterval);
  };
  const getErrorLogs = () => {
    const { getErrorLogData } = MintActions;
    dispatch(getErrorLogData()).then((data) => {
      setRecords(data?.data?.data?.rows);
    });
  };

  const createOptions = (data) => {
    const brands = data.brands.map((obj) => {
      return { label: obj.title, value: obj.id };
    });
    const artists = data.artists.map((obj) => {
      return { label: obj.title, value: obj.id };
    });

    return [
      { label: "Brands", options: brands },
      { label: "Artists", options: artists },
    ];
  };

  const options = createOptions(optionList);
  useEffect(() => {
    resetsFileInput();
  }, [fileType]);

  useEffect(() => {
    getBlockChainList();
  }, []);

  function resetsFileInput() {
    // let randomString = Math.random().toString(36);
    // setInputKey(randomString);
    document.getElementById("bulkImages").value = "";
  }
  const onImageChange = async (event) => {
    const files = event.target.files;
    const name = event.target.name;


    if (fileType === "") {
      resetsFileInput();
      return toast.error("Please choose your file type");
    }

    if (files.length === 0)
      return toast.error(
        "Please upload a valid image format (.jpg, .jpeg, .png, .gif)"
      );
    for (let item of files) {
      const file = item; /** get file from files array */

      let ext = file.name.split(".").pop();
      ext = ext.toLowerCase();
      ext = ext.toLowerCase();
      if (fileType === "Image") {
        if (
          ext === "jpg" ||
          ext === "gif" ||
          ext === "jpeg" ||
          ext === "png" ||
          ext === "gif"
        ) {
          const fileSize = file.size / 1024 / 1024;
          if (fileSize > 100) {
            resetsFileInput();
            return toast.error("Image should be less than or equal to 100MB");
          } else {
            const blob = URL.createObjectURL(file);
          }
        } else {
          resetsFileInput();
          return toast.error(
            "Please upload a valid image format (.jpg, .jpeg, .png, .gif)"
          );
        }
      } else {
        if (ext === "mp4" || ext === "mov") {
          const fileSize = file.size / 1024 / 1024;
          if (fileSize > 100) {
            resetsFileInput();
            return toast.error("Video should be less than or equal to 100MB");
          } else {
            const blob = URL.createObjectURL(file);
          }
        } else {
          resetsFileInput();
          return toast.error("Please upload a valid video format (.mp4, .mov)");
        }
      }
    }
  };

  const getBlockChainList = useCallback(async () => {
    const { getBlockChainList } = NftActions;
    const res = await dispatch(getBlockChainList());
    let list = [];

    list.push({
      key: "select",
      value: "Select Blockchain",
      lable: "Select Blockchain",
    });
    res.data.data.map((item) => {
      item.blockChainName === "All"
        ? console.log("ALl")
        : list.push({
            key: item.blockChainName,
            value: item.blockChainName,
            lable: item.blockChainName,
          });
    });
    setBlockChainName(list);
  }, [dispatch]);


  const blockChainNameOptions =
    blockChainName &&
    blockChainName.map((item) => {
      return (
        <option key={item.value} value={item.value}>
          {item.value}
        </option>
      );
    });
  return (
    <div>
      {isMinting === "PENDING" && (
        <h3 style={{ color: "red" }}>Your previous minting still pending</h3>
      )}

      <Formik
        initialValues={{
          bulkImages: "",
        }}
        validationSchema={Yup.object().shape({
          bulkImages: Yup.string().required("This field is required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const { startLoading, stopLoading } = LoadingActions;
          let final = Array.from(values.bulkImages);
          let formData = new FormData();

          if (final.length === 0) {
            resetForm({ values: "" });
            toast.error("Please select minting files.");
            return;
          }
          if (selectedBlockchainName === "Select Blockchain") {
            toast.error("Please select Blockchain name.");
            return;
          }
          formData.append("blockChainName", selectedBlockchainName);
          formData.append("folderName", fileType === "Image" ? "nft" : "video");
          formData.append("fileType", fileType === "Image" ? "image" : "video");
          dispatch(startLoading());

          final.forEach((element) => {
            formData.append("file", element);
          });
          dispatch(uploadBulkImage(formData))
            .then((res) => {
              if (res) {
                document.getElementById("bulkImages").value = "";
                resetForm({ values: "" });
                setLink(res.data.data.downloadLink);
                dispatch(stopLoading());
              }
            })
            .catch((error) => {
              document.getElementById("bulkImages").value = "";
              resetForm({ values: "" });
              console.log(error);
              dispatch(stopLoading());
            });
        }}
        render={({ setFieldValue }) => (
          <>
            {/* <h3>Upload Bulk Minting</h3> */}
            {/* <span>
              <a
                href="https://stage-nft-collection.s3.ap-south-1.amazonaws.com/bulkCsv/NFT_UPLOAD_SAMPLE.csv"
                download
              >
                Sample format
              </a>
            </span> */}
            <Form>
              <div className="form-group">
                <div>
                  <label className="fileUpload_label" htmlFor="csv_file">
                    File type
                  </label>
                  <select
                    className="dropDown"
                    name="fileType"
                    placeholder="Select file type"
                    onChange={(e) => {
                      setFileType(e.target.value);
                    }}
                  >
                    <option value="Image" label="Image" />
                    <option value="Video" label="Video" />
                  </select>
                </div>
                <div>
                  <label className="fileUpload_label" htmlFor="csv_file">
                    Blockchain Name
                  </label>
                  <select
                    className="dropDown"
                    name="fileType"
                    placeholder="Select BlockChain Name"
                    onChange={(e) => {
                      setSelectedBlockChainName(e.target.value);
                    }}
                  >
                    {blockChainNameOptions}
                  </select>
                </div>
                <div>
                  <label className="fileUpload_label" htmlFor="csv_file">
                    Bulk Image/Video Upload
                  </label>
                  <div className="fileUpload_block">
                    <input
                      id="bulkImages"
                      type="file"
                      className="inputfileStyle"
                      onChange={(e) => {
                        setBulk(e.target.files);
                        setFieldValue("bulkImages", e.target.files);
                        onImageChange(e);
                      }}
                      // key={InputKey || ""}
                      name="bulkImages"
                      multiple="multiple"
                    />
                    <br />
                    <br />
                  </div>
                  <p className="error-meg">
                    <ErrorMessage name="bulkImages" className="same_error" />
                  </p>
                </div>

                <div className="form-group">
                  <Button
                    disabled={isMinting === "PENDING" ? true : false}
                    type="submit"
                    // onClick={() => uploadBulkImages()}
                    primary
                    className="bulk_btn"
                  >
                    Upload Bulk Images
                  </Button>
                </div>
                {link !== "" && (
                  <div>
                    Download your file from here and update csv data
                    accordingly: <a href={link}>{link}</a>
                  </div>
                )}
              </div>
            </Form>
          </>
        )}
      />
      {/* <span style={{width:100,border}}></span> */}
      <br />
      <hr />
      <Formik
        initialValues={{
          // id: 0,
          csv_file: "",
        }}
        validationSchema={Yup.object().shape({
          csv_file: Yup.string().required(".csv file is required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          let formData = new FormData();
          // formData.append("id", values?.id);
          formData.append("csv_file", values.csv_file);
          let { uploadCsv } = MintActions;
          dispatch(uploadCsv(formData)).then((res) => {
            setIsMinting("PENDING");
            let files = document.getElementById("csvData");
            if (res?.data?.error === false) {
              setRecords(res?.data);
              toast.success(res?.data?.message);
              files.value = "";
            } else {
              files.value = "";
              toast.error(res?.data?.message);
            }
          });
        }}
        render={({ setFieldValue }) => (
          <>
            {/* <h3>Upload Bulk Minting</h3> */}
            <Form>
              <div className="form-group">
                <label className="fileUpload_label" htmlFor="csv_file">
                  Bulk Minting
                </label>
                {/* <div className="">
                  <label>
                    <b>Choose Role</b>
                  </label>
                  <Select
                    placeholder="Select Type"
                    options={options}
                    onChange={(e, d) => {
                      setFieldValue("id", e.value);
                    }}
                  />
                </div> */}
                <br />
                <label>
                  <b>Upload File</b>
                </label>
                <div className="fileUpload_block">
                  <input
                    id="csvData"
                    type="file"
                    className="inputfileStyle"
                    accept=".csv"
                    onChange={(e) => {
                      if (
                        e.currentTarget.files[0]?.type === "text/csv" ||
                        e.currentTarget.files[0]?.type ===
                          "application/vnd.ms-excel"
                      ) {
                        setFieldValue("csv_file", e.currentTarget.files[0]);
                      } else {
                        toast.error("Only .csv file format");
                      }
                    }}
                    name="csv_file"
                  />
                </div>
                <p className="error-meg">
                  <ErrorMessage name="csv_file" />
                </p>
              </div>
              <div className="form-group">
                <Button
                  type="submit"
                  disabled={isMinting === "PENDING" ? true : false}
                  primary
                  className="bulk_btn"
                >
                  Upload CSV
                </Button>
              </div>
            </Form>
            <br />
            <div className="failedTx">
              <ErrorLogs records={records} />
            </div>
          </>
        )}
      />
    </div>
  );
}

export default UploadMinting;
