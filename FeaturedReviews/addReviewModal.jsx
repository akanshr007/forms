import React, { useState } from "react";
import { Button, Form, Input, Modal } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { UserActions } from "../../../redux/_actions";
import { toast } from "../../../components/Toast/Toast";

const AddReviewModal = ({
  open,
  onClose,
  channelUrl,
  getDetails,
  optionDetails,
  type,
  handleEdit,
}) => {
  const dispatch = useDispatch();
  const [toastDisplayed, setToastDisplayed] = useState(false); // State to track if error toast has been displayed

  // Define Yup validation schema
  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(
        /^[a-zA-Z0-9_-]*[a-zA-Z0-9][a-zA-Z0-9\s_-]*$/,
        "Invalid characters and spaces in name"
      )
      .min(5, "Name must be at least 5 characters")
      .max(40, "Name cannot exceed 40 characters")
      .test("is-not-empty", "Name cannot be empty", (value) => {
        return value.trim().length > 0; // Check if trimmed value has length greater than 0
      }),
    link: Yup.string()
      .required("Link is required")
      .test(
        "is-youtube-link",
        "Only YouTube video links are allowed",
        (value) => {
          if (!value) return false; // If no value provided, fail validation
          return isYouTubeVideoUrl(value); // Check if it's a YouTube video URL
        }
      ),
  });

  // Helper function to check if the URL is from a YouTube video
  function isYouTubeVideoUrl(url) {
    // Regular expression to match YouTube video URLs
    const youtubeVideoRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|watch\?.*?v=))([a-zA-Z0-9_-]{11})(?:[?&]list=[^&\s]+)?(?:[?&]index=\d+)?(?:[?&].*)?$/;
    return youtubeVideoRegex.test(url);
  }

  const formik = useFormik({
    initialValues: {
      name: type === "edit" ? optionDetails?.review_name || "" : "",
      link: type === "edit" ? optionDetails?.review_link || "" : "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (type === "edit") {
          handleEdit(values);
        } else {
          const res = await handleAddReview(values);
          if (res?.status === 200 || res?.status === 201) {
            toast.success(res?.data?.message);
            onClose(); // Close modal only on successful submission
            getDetails(); // Refresh the review list
          }
        }
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting review:", error);
        if (!toastDisplayed) {
          setToastDisplayed(true); // Mark that error toast has been displayed
        }
      }
    },
  });

  const handleAddReview = async (data) => {
    const { createReview } = UserActions;

    try {
      const res = await dispatch(
        createReview({
          review_name: data.name,
          review_link: data.link,
          channel_link: channelUrl,
        })
      );
      onClose();
      if (res?.status === 200 || res?.status === 201) {
        toast.success("Review Created Successfully");
      }
      getDetails(); // Refresh the review list
      console.log("Review created successfully");
    } catch (error) {
      console.error("Error creating review:", error);
      throw error; // Throw error for handling in onSubmit
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {type === "edit" ? "Edit Review" : "Add Review"}
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <Input
              name="name"
              placeholder="Enter review name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
              onInput={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            )}
          </Form.Field>
          <Form.Field>
            <label>Link</label>
            <Input
              name="link"
              placeholder="Enter review link"
              value={formik.values.link}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.link && formik.errors.link}
              onInput={formik.handleBlur}
            />
            {formik.touched.link && formik.errors.link && (
              <div style={{ color: "red" }}>{formik.errors.link}</div>
            )}
          </Form.Field>
          <Button type="button" secondary onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            positive
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {type === "edit" ? "Update" : "Submit"}
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddReviewModal;
