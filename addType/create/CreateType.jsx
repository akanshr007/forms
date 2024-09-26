import React, { useCallback, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
import { Field, reduxForm } from "redux-form";
import { required } from "redux-form-validators";
import { Button, Form, Icon, Image, Table } from "semantic-ui-react";
import { FormField } from "../../../../components/FormField";
import MainLayout from "../../../../components/HOC/MainLayout";
import { toast } from "../../../../components/Toast/Toast";
import { BannerActions, AddTypeAction } from "../../../../redux/_actions";
import { validateUrls } from "../../../../_validators/customValidators";
import { ValidateImage } from "../../../../Services/Validation";

const CreateType = ({
  match: {
    params: { id },
  },
  history,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState({ extras_image: "" });
  const [isEdit, setIsEdit] = useState(false);
  const banner = useSelector((state) => state.addType.typeDetails);


  const goBack = () => history.goBack();

  const onImageChange = async (event) => {
    const files = event.target.files;
    // const name = event.target.name;

    if (files.length === 0)
      return toast.error(
        "Please upload a valid image format (.jpg, .jpeg, .png, .gif)"
      );

    const file = files[0]; /** get file from files array */
    let ext = file.name.split(".").pop();
    ext = ext.toLowerCase();
    // let ext = file.name.split(".")[1]; /** get ext of image to validate */
    ext = ext.toLowerCase();

    if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") {
      const fileSize = file.size / 1024 / 1024 / 1024;
      if (fileSize > 3000)
        return toast.error("Image should be less than or equal to 3MB");
      const blob = URL.createObjectURL(file);

      setImages({ ...images, extras_image: blob });
    } else {
      return toast.error(
        "Please upload a valid image format (.jpg, .jpeg, .png, .gif)"
      );
    }
  };

  const submitForm = async (data) => {
    //const { createBanner, updatebanner } = BannerActions;
    const { createType, updateType } = AddTypeAction;

    if (!isEdit) {
      data.is_featured = false;
      dispatch(
        createType({
          ...data,
        })
      ).then((data) => {
        if (data) {
          toast.success("Type has been added successfully..!!");
          history.goBack();
        }
      });
    } else {
      if (!data.extras_image) data.extras_image = banner.extras_image;
      // if (!data.gifImage) data.imageUrl = banner.gifImage;
      data.id = id;
      dispatch(updateType(data)).then((data) => {
        if (data) {
          toast.success("Type has been Updated successfully..!!");
          history.goBack();
        }
      });
    }
  };

  const setImageFromApi = useCallback((data) => {
    if (Object.keys(data).length > 0) {
      setImages({ extras_image: data.extras_image });
    }
  }, []);

  useEffect(() => {
    //const { getBannerById, saveBannerDetails } = BannerActions;

    const { getTypeById, saveTypeDetails } = AddTypeAction;

    if (id) {
      dispatch(getTypeById({ id }));
      setIsEdit(true);
    }

    return () => {
      dispatch(saveTypeDetails({ typeDetails: {} }));
    };
  }, [dispatch, id]);

  useEffect(() => {
    setImageFromApi(banner);
  }, [banner, setImageFromApi]);

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3> {isEdit ? "Update" : "Add"} Type</h3>
        <Button className="addButton" onClick={goBack}>
          Back
        </Button>
      </div>

      <div className="create-nft-form">
        <Form
          autoComplete="off"
          autoFocus="off"
          onSubmit={handleSubmit(submitForm)}
        >
          <div>
            {images.extras_image && (
              <Image src={images.extras_image} width="150" height="70" />
            )}
            <Form.Field>
              <label>Upload Type's Icon</label>
              <Field
                id="extras_image"
                component={FormField}
                name="extras_image"
                type="file"
                placeholder="upload a file"
                onImageChange={onImageChange}
                validate={[required()]}
              />
              {/* <small style={{ color: "blue" }}>
                <p className="infoData">
                  {" "}
                  Icon size (width:1920px, height: 726px )
                </p>
              </small> */}
            </Form.Field>
          </div>

          {/* <div>
            {images.gifImage && (
              <Image src={images.gifImage} width="80" height="80" />
            )}
            <Form.Field>
              <label>Upload Gif Image</label>
              <Field
                component={FormField}
                id="gifImage"
                name="gifImage"
                type="file"
                placeholder="upload a file"
                onImageChange={onImageChange}
                validate={[required()]}
              />
              <small style={{ color: "blue" }}>
                <p className="infoData">
                  {" "}
                  Gif size (width: 220px, height: 220px )<br />
                  This media will display on top of the banner image.
                </p>
              </small>
            </Form.Field>
          </div> */}

          <Form.Field>
            <label>Type's Title</label>
            <Field
              component={FormField}
              name="extras_name"
              type="text"
              maxLength={20}
              placeholder="Title"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field className="loginBtn">
            <Button type="submit" primary="true">
              {" "}
              Submit{" "}
            </Button>
          </Form.Field>
        </Form>
      </div>
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  initialValues: state.addType.typeDetails,
});

export default compose(
  connect(mapStateToProps, null),
  reduxForm({ form: "CreateType", enableReinitialize: true })
)(CreateType);
