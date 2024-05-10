import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/HOC/MainLayout";
import { Button, Form, Table, Confirm, Popup } from "semantic-ui-react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddReviewModal from "./addReviewModal";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserActions } from "../../../redux/_actions";
import { DeleteReview } from "../../../redux/_actions/user.action";
import { toast } from "../../../components/Toast/Toast";

const FeaturedReviews = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteData, setdeleteData] = useState();
  const [type, setType] = useState("add");
  const dispatch = useDispatch();
  const [optionDetails, setOptionDetails] = useState("");
  const getDetails = async () => {
    const { showReviews, channelLink } = UserActions;
    const res = await dispatch(showReviews());
    const channelRes = await dispatch(channelLink());
    console.log(channelRes?.data?.data, "fdewiufeuwh");
    setReviews(res?.data?.data);
    setChannelUrl(channelRes?.data?.data?.channel_link);
    console.log(res?.data?.data, "lllllll");
  };

  useEffect(() => {
    getDetails();
  }, []);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = (option, id) => {
    closeModal();
  };
  const handleChange = (data) => {
    console.log("ewiuhfuewfuew");
    setType("edit");
    setOptionDetails(data);
    setReviewFormOpen(true);
  };

  const schema = Yup.object().shape({
    link: Yup.string()
      .url("Invalid URL") // Validate if it's a valid URL format
      .test(
        "is-youtube-url",
        "Only YouTube Channel URLs are allowed",
        (value) => {
          if (!value) return false; // If no value provided, fail validation
          // Check if the URL is from YouTube
          return isYouTubeChannelUrl(value);
        }
      )
      .required("Channel link is required"), // Mark the field as required
  });

  function isYouTubeChannelUrl(url) {
    // Regular expression to match YouTube channel URLs
    const youtubeChannelRegex =
      /^(https?\:\/\/)?(www\.)?(youtube\.com\/(c\/|@|channel\/|user\/)|youtu\.be\/)[\w-]{1,}$/i;
    return youtubeChannelRegex.test(url);
  }

  const formik = useFormik({
    initialValues: {
      link: channelUrl ? channelUrl : "",
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      setReviewFormOpen(true);
      setType("add");
    },
  });

  const handleDeleteReview = async (data) => {
    try {
      const deleteResponse = await dispatch(DeleteReview(data?.id));
      if (deleteResponse?.status === 200) {
        toast.success("Review deleted successfully");
        getDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };
  let modelcontent = "Are you sure you want to " + "delete this Review?";
  const handleEdit = async (updateReview) => {
    console.log(updateReview, "aaaaaaaa");
    try {
      const editPayload = {
        review_name: updateReview?.name,

        review_link: updateReview?.link,

        channel_link: channelUrl,

        id: optionDetails.id,
      };
      const { updatedReviews } = UserActions;
      const editResponse = await dispatch(updatedReviews(editPayload));
      if (editResponse) {
        toast.success("Review updated successfully");
        getDetails();
        setReviewFormOpen(false); // Close the modal
      }
    } catch (error) {
      console.log(error);
    }
  };
  const payload = deleteData;
  return (
    <MainLayout>
      <Confirm
        header={"Delete Review"}
        content={modelcontent}
        open={open}
        confirmButton="Yes"
        cancelButton="No"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          handleDeleteReview(payload);
        }}
      />
      <div className="featured-reviews">
        <div className="channel-submission">
          <h2>Featured Reviews</h2>
          <Form onSubmit={formik.handleSubmit}>
            <div className="channel-url">
              <input
                type="url"
                placeholder="Enter URL"
                value={formik.values.link}
                onChange={formik.handleChange}
                id="link"
                name="link"
                style={{ width: "500px", height: "35px", marginRight: "3px" }}
              />
              <Button type="submit" className="add-review-button">
                Add Review
              </Button>
            </div>
            {formik.touched.link && formik.errors.link && (
              <div style={{ color: "red" }}>{formik.errors.link}</div>
            )}
          </Form>
        </div>

        <div className="add-review" style={{ marginTop: "20px" }}>
          {reviewFormOpen && (
            <AddReviewModal
              open={reviewFormOpen}
              onClose={() => setReviewFormOpen(false)}
              getDetails={getDetails}
              channelUrl={formik.values.link}
              optionDetails={optionDetails}
              handleEditSubmit={handleSubmit}
              type={type}
              handleEdit={handleEdit}
            />
          )}

          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Link</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {reviews?.length > 0 ? (
                reviews.map((review, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{review.review_name}</Table.Cell>
                    <Table.Cell>
                      <a
                        href={review.review_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {review.review_link}
                      </a>
                    </Table.Cell>

                    <Table.Cell>
                      <Popup
                        trigger={
                          <Button icon onClick={() => handleChange(review)}>
                            <EditOutlined />
                          </Button>
                        }
                        content="Edit"
                        basic
                      />
                      <Popup
                        trigger={
                          <Button
                            icon
                            onClick={() => {
                              setdeleteData(review);
                              setOpen(true);
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        }
                        content="Delete"
                        basic
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell collapsing colSpan="18" textAlign="center">
                    <div
                      style={{
                        textAlign: "center",
                        fontWeight: "bolder",
                        fontSize: "10x",
                      }}
                    >
                      No Record Found
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {reviews.length <= 12 && <p></p>}
        </div>
      </div>
    </MainLayout>
  );
};

export default FeaturedReviews;
