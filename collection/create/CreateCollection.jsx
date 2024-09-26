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
import { CollectionActions } from "../../../../redux/_actions";
import { ValidateImage } from "../../../../Services/Validation";

const CreateCollection = ({
  match: {
    params: { id },
  },
  history,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState({ logo: "", banner: "" });
  const [isEdit, setIsEdit] = useState(false);
  const collection = useSelector((state) => state.collection.collection);
  const [creatorsData, setCreatorsData] = useState({});

  const goBack = () => history.goBack();

  const getCreatorList = useCallback(
    async (data) => {
      const { getCreatorList } = CollectionActions;
      const res = await dispatch(getCreatorList(data));
      setCreatorsData(res.data.data);
    },
    [dispatch]
  );

  useEffect(() => {
    getCreatorList();
  }, [getCreatorList]);

  const onImageChange = async (event) => {
    const files = event.target.files;
    const name = event.target.name;
    let height;
    let width;
    let isImageValid = false;

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
      if (name === "logo") {
        height = 330;
        width = 330;
        // isImageValid = await ValidateImage({
        //   event: blob,
        //   wid: width,
        //   hei: height,
        // });
        setImages({ ...images, logo: blob });
        // if (isImageValid) {
        //   setImages({ ...images, logo: blob });
        // } else {
        //   document.getElementById("logo").value = null;
        // }
      } else {
        height = 726;
        width = 1920;
        isImageValid = await ValidateImage({
          event: blob,
          wid: width,
          hei: height,
        });
        // setImages({ ...images, banner: blob });
        if (isImageValid) {
          setImages({ ...images, banner: blob });
        } else {
          document.getElementById("banner").value = null;
          if (!isImageValid) {
            return toast.error(
              `Please add a valid dimension ${name} image of width: ${width}px & Height: ${height}px`
            );
          }
        }
      }
      // if (!isImageValid) {
      //   return toast.error(
      //     `Please add a valid dimension ${name} image of width: ${width}px & Height: ${height}px`
      //   );
      // }
    } else {
      return toast.error(
        "Please upload a valid image format (.jpg, .jpeg, .png, .gif)"
      );
    }
  };

  const submitForm = async (data) => {
    const { createCollection, updateCollection } = CollectionActions;
    let res = {};
    if (!isEdit) {
      res = await dispatch(createCollection(data));
    } else {
      if (!data.banner) data.banner = images.banner;
      data.id = id;
      res = await dispatch(updateCollection(data));
    }

    if (res) {
      toast.success("Collection has been added successfully..!!");
      history.goBack();
    }
  };

  const setImageFromApi = useCallback((data) => {
    if (Object.keys(data).length > 0) {
      setImages({ ...images, logo: data.logo, banner: data.banner });
    }
  }, []);

  useEffect(() => {
    const { getCollectionById, saveCollection } = CollectionActions;
    if (id) {
      dispatch(getCollectionById({ id }));
      setIsEdit(true);
    }

    return () => {
      dispatch(saveCollection({ collection: {} }));
    };
  }, [dispatch, id]);

  useEffect(() => {
    setImageFromApi(collection);
  }, [collection, setImageFromApi]);

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
        <h3>{isEdit ? "Update" : "Add"} Collection</h3>
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
            {/* { !isEdit && */}
            <Form.Field>
              <label>Creator</label>
              <Field
                component={FormField}
                name="creator"
                type="selectWithOpt"
                data={creatorsData}
                placeholder="Select Creator"
                validate={[required()]}
                disabled={isEdit}
              />
            </Form.Field>

            {images.logo.length > 0 && (
              <Image src={images.logo} width="80" height="80" />
            )}
            <Form.Field>
              <label>Upload Logo</label>
              <Field
                id="logo"
                component={FormField}
                name="logo"
                type="file"
                placeholder="upload a file"
                onImageChange={onImageChange}
                // validate={[required()]}
                validate={!isEdit && [required()]}
              />
              <small style={{ color: "blue" }}>
                <p className="infoData">
                  {" "}
                  {/* Logo size (width:330px, height: 330px ) */}
                </p>
              </small>
            </Form.Field>
          </div>

          <div>
            {images.banner.length > 0 && (
              <Image src={images.banner} width="150" height="70" />
            )}

            <Form.Field>
              <label>Upload Cover Image</label>
              <Field
                id="banner"
                component={FormField}
                name="banner"
                type="file"
                placeholder="upload a file"
                onImageChange={onImageChange}
                validate={!isEdit && [required()]}
              />
              <small style={{ color: "blue" }}>
                <p className="infoData">
                  Cover size (width:1920px, height: 726px )
                </p>
              </small>
            </Form.Field>
          </div>

          <Form.Field>
            <label>Collection Name</label>
            <Field
              component={FormField}
              name="name"
              type="text"
              placeholder="Collection Name"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field>
            <label>Sub Title</label>
            <Field
              component={FormField}
              name="subHeading"
              type="text"
              placeholder="Sub Title"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field>
            <label>Brand Name</label>
            <Field
              component={FormField}
              name="brandName"
              type="text"
              placeholder="Brand Name"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <Field
              component={FormField}
              type="textarea"
              textarea={true}
              rows={3}
              name="description"
              placeholder="Enter Description"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field>
            <Field
              component={FormField}
              name="isFeatured"
              id="isFeatured"
              label="Is Featured?"
              type="checkbox"
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
  initialValues: state.collection.collection,
});

export default compose(
  connect(mapStateToProps, null),
  reduxForm({ form: "CreateCollection", enableReinitialize: true })
)(CreateCollection);
