import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
// import { Field, reduxForm } from "redux-form";
import { required } from 'redux-form-validators'
import { Button, Icon, Image, Dropdown } from 'semantic-ui-react'
import { FormField } from '../../../../components/FormField'
import MainLayout from '../../../../components/HOC/MainLayout'
import { toast } from '../../../../components/Toast/Toast'
import { ArtistActions } from '../../../../redux/_actions'
import { ValidateImage } from '../../../../Services/Validation'
import GlobalVariables from '../../../../_constants/GlobalVariables'
import { BrandActions } from '../../../../redux/_actions'
import { getBrands } from '../../../../redux/_actions/brand.action'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// const randomSpecialChar = "!$&=?".substr(~~(12 * Math.random()), 3);
let textArray = ['!', '$', '=', '?']
let randomSpecialChar_ = Math.floor(Math.random() * textArray.length) //"!$&=?".substr(~~(12 * Math.random()), 1);
const randomSpecialChar = textArray[randomSpecialChar_]
const randomNumber = Math.floor(Math.random() * 10 + 1)
const capitalLetter = Math.random()
  .toString(36)
  .toUpperCase()
  .replace(/[0-9O]/g, '')
  .substring(1, 4 + 1)
const smallLetter = Math.random()
  .toString(36)
  .toLowerCase()
  .replace(/[0-9O]/g, '')
  .substring(1, 4 + 1)

const schema = Yup.object().shape({
  // isActive: Yup.string().required("this field is required"),
  password: Yup.string().required('This field is required'),
  email: Yup.string()
    .email()
    .required('This field is required'),
  bio: Yup.string()
    .required('This field is required')
    .min(10, 'Minimum 10 charactor required'),
  // subHeading: Yup.string().required("This field is required"),
  fullname: Yup.string().required('This field is required'),
  coverImage: Yup.string().required('This field is required'),
  profileImage: Yup.string().required('This field is required')
})

const collectionsData = [
  { key: 'af', value: 'af', flag: 'af', lable: 'Afghanistan' },
  { key: 'ax', value: 'ax', flag: 'ax', lable: 'Aland Islands' },
  { key: 'al', value: 'al', flag: 'al', lable: 'Albania' },
  { key: 'dz', value: 'dz', flag: 'dz', lable: 'Algeria' },
  { key: 'as', value: 'as', flag: 'as', lable: 'American Samoa' },
  { key: 'ad', value: 'ad', flag: 'ad', lable: 'Andorra' },
  { key: 'ao', value: 'ao', flag: 'ao', lable: 'Angola' }
]

const AddUser = ({
  match: {
    params: { id }
  },
  history,
  handleSubmit
}) => {
  const dispatch = useDispatch()
  const [images, setImages] = useState({ logo: '', banner: '' })
  const [banner, setBanner] = useState(null)
  const [logo, setLogo] = useState(null)

  const [showPassword, setShowPassword] = useState(true)
  const [brand, setBrand] = useState({
    count: 0,
    rows: [{ key: 'No brand selected', value: '0', text: 'No brand selected' }]
  })
  const [isEdit, setIsEdit] = useState(false)
  const [artistData, setArtistData] = useState({})
  const collection = useSelector(state => state.artist.artist)

  const goBack = () => history.goBack()

  const getBrands = useCallback(
    async data => {
      // Api to get Brand list
      const { getBrands } = BrandActions
      dispatch(getBrands(data)).then(data => {
        const finalData = data?.data?.data?.details.map((ghg, index) => {
          return { key: ghg.brandId, value: ghg.brandId, text: ghg.title }
        })
        setBrand({ ...brand, rows: [...brand.rows, ...finalData] })
      })
    },
    [dispatch]
  )

  const getArtist = artistId => {
    if (artistId) {
      const { getArtistById } = ArtistActions
      dispatch(getArtistById({ id: artistId })).then(data => {
        if (data) {
          setIsEdit(true)
          setArtistData(data?.data?.data[0])
        }
      })
    }
  }

  useEffect(() => {
    getBrands({ id: 2, page: 0, limit: -1 })
    getArtist(id)
  }, [])

  const onImageChange = async (event, setFieldValue, names) => {
    const files = event.target.files
    const name = names //event.target.files[0].name;
    let height
    let width
    let isImageValid = false

    if (Array.isArray(files) && files.length === 0)
      return toast.error(
        'Please upload a valid image format (.jpg, .jpeg, .png, .gif)'
      )

    const file = files[0] /** get file from files array */
    let ext = file.name.split('.').pop()
    ext = ext.toLowerCase()
    // let ext = file.name.split(".")[1]; /** get ext of image to validate */
    ext = ext.toLowerCase()
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
      const fileSize = file.size / 1024 / 1024 / 1024
      if (fileSize > 3000)
        return toast.error('Image should be less than or equal to 3MB')
      const blob = URL.createObjectURL(file)
      if (name === 'profileImage') {
        height = 330
        width = 330
        isImageValid = await ValidateImage({
          event: blob,
          wid: width,
          hei: height
        })
        setImages({ ...images, logo: blob })
        setFieldValue('profileImage', file)
        // if (isImageValid) {
        //   setImages({ ...images, logo: blob });
        //   setFieldValue("profileImage", blob);
        // } else {
        //   document.getElementById("profileImage").value = "";
        // }
      } else {
        height = 726
        width = 1920
        isImageValid = await ValidateImage({
          event: blob,
          wid: width,
          hei: height
        })
        // setImages({ ...images, banner: blob });
        // setFieldValue("coverImage", file);
        if (isImageValid) {
          setImages({ ...images, banner: blob })
          setFieldValue('coverImage', blob)
        } else {
          document.getElementById('coverImage').value = ''
          if (!isImageValid) {
            return toast.error(
              `Please add a valid dimension ${name} image of width: ${width}px & Height: ${height}px`
            )
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
        'Please upload a valid image format (.jpg, .jpeg, .png, .gif)'
      )
    }
  }

  const submitForm = async data => {
    const { createArtist, updateArtist } = ArtistActions
    let res = {}
    if (!isEdit) {
      res = await dispatch(createArtist(data))
    } else {
      if (!data.banner) data.banner = images.banner
      data.id = id
      res = await dispatch(updateArtist(data))
    }

    if (res) {
      // toast.success("Collection has been added successfully..!!");
      toast.success(res.message)
      history.goBack()
    }
  }

  const setImageFromApi = useCallback(data => {
    if (data && Object.keys(data).length > 0) {
      setImages({ ...images, banner: data.banner })
    }
  }, [])

  useEffect(() => {
    const { getArtistById, saveArtist } = ArtistActions
    if (id) {
      dispatch(getArtistById({ id }))
      setIsEdit(true)
    }
    return () => {
      dispatch(saveArtist({ collection: {} }))
    }
  }, [dispatch, id])

  useEffect(() => {
    setImageFromApi(collection)
  }, [collection, setImageFromApi])

  useEffect(() => {
    if (isEdit) {
      setImages({
        ...images,
        logo: artistData?.coverImage,
        banner: artistData?.profileImage
      })
    }
  }, [JSON.stringify(artistData)])

  useEffect(() => {
  }, [images])
  const initialValues = {
    // isActive: "",
    password: randomSpecialChar + randomNumber + capitalLetter + smallLetter,
    email: isEdit ? artistData?.email : '',
    bio: isEdit ? artistData?.description : '',
    // subHeading: isEdit?artistData.subHeading:"",
    fullname: isEdit ? artistData?.title : '',
    coverImage: isEdit ? artistData?.coverImage : '',
    profileImage: isEdit ? artistData?.profileImage : '',
    brandId: isEdit ? artistData?.parentId : 0,
    isFeatured: isEdit ? (artistData?.isFeatured === 1 ? 1 : 0) : 0
  }

  return (
    <MainLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3>{isEdit ? 'Update' : 'Add'} User</h3>
        <Button className='addButton' onClick={goBack}>
          Back
        </Button>
      </div>
      <div className='create-nft-form'>
        <Formik
          enableReinitialize={true}
          enableReinitializing={true}
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { resetForm }) => {
            let data = {
              password: values.password,
              email: values.email,
              bio: values.bio,
              fullname: values.fullname,
              coverImage: banner ? banner : values.coverImage,
              profileImage: logo ? logo : values.profileImage,
              isFeatured: values.isFeatured,
              brandId: values.brandId
            }

            let un = values.email.split('@')[0].replace(/[^\w\s]/gi, '')

            if (!isEdit) {
              data['username'] = un
              data['role_type'] = 3
            }
            ///
            const { createArtist, updateArtist } = ArtistActions
            let res = {}
            if (!isEdit) {
              res = await dispatch(createArtist(data)).then(response => {
                toast.success('Artist added successfully')
                resetForm('')
                document.getElementById('coverImage').value = ''
                document.getElementById('profileImage').value = ''
                setImages({ ...images, banner: '', logo: '' })
                // history.goBack();
              })
            } else {
              // if (!data.banner) data.banner = images.banner;
              data.id = id
              res = await dispatch(updateArtist(data)).then(response => {
                toast.success('Artist updated successfully')
                // history.goBack();
              })
            }
          }}
          render={({ values, setFieldValue }) => (
            <>
              <Form className='ui form'>
                {/* <div className='field'>
                  <label>Select Brand</label>
                  <Dropdown
                    placeholder='Select Brand'
                    fluid
                    search
                    disabled={isEdit ? true : false}
                    selection
                    options={brand.rows}
                    id='brandId'
                    value={values?.brandId ? values?.brandId : 0}
                    onChange={(e, { value }) => {
                      setFieldValue('brandId', value)
                    }}
                  />
                  <p className='infoData'>
                    Note: If no brand selected then it will be an individual
                    artist.
                  </p>
                </div> */}
                {/* <div className='field'>
                  {images?.logo && (
                    <Image src={images?.logo} width='80' height='80' />
                  )}
                  <label>Upload Logo</label>
                  <input
                    id='profileImage'
                    name='profileImage'
                    type='file'
                    placeholder='upload a file'
                    onChange={e => {
                      setLogo(e.target.files[0])
                      onImageChange(e, setFieldValue, 'profileImage')
                    }}
                  />

                  <p class='infoData' style={{ marginBottom: '5px' }}>
                    {/* Logo size (width:330px, height: 330px ) */}
                  {/* </p>

                  <p className='error-msg'>
                    <ErrorMessage name='profileImage' />
                  </p>
                </div>  */}

                {/* <div className='field'>
                  {images?.banner && (
                    <Image src={images?.banner} width='150' height='70' />
                  )}

                  {/* {values?.coverImage && (
                    <Image src={values.coverImage} width="150" />
                  )} */}
                  {/* <label>Upload Cover Image</label>
                  <input
                    id='coverImage'
                    name='coverImage'
                    type='file'
                    placeholder='upload a file'
                    onChange={e => {
                      setBanner(e.target.files[0])
                      onImageChange(e, setFieldValue, 'coverImage')
                    }}
                  />

                  <p class='infoData' style={{ marginBottom: '5px' }}>
                    Cover size (width:1920px, height: 726px )
                  </p>
                  <p className='error-msg'>
                    <ErrorMessage name='coverImage' />
                  </p>
                </div>  */}
                {/* <div className='field'>
                  <label>Artist Name</label>
                  <input
                    name='fullname'
                    type='text'
                    placeholder='Artist Name'
                    value={values.fullname}
                    onChange={e => {
                      setFieldValue('fullname', e.target.value)
                    }}
                  />
                  <p className='error-msg'>
                    <ErrorMessage name='fullname' />
                  </p>
                </div> */}

                {/* <div>
                    <label>Sub Title</label>
                    <input
                      name="subHeading"
                      type="text"
                      placeholder="Sub Title"
                      value={values.subHeading}
                      onChange={(e) => {
                        setFieldValue("subHeading", e.target.value);
                      }}
                    />
                    <br />
                    <ErrorMessage name="subHeading" />
                  </div> */}
                {/* <div className='field'>
                  <label>Description</label>
                  <textarea
                    type='textarea'
                    textarea={true}
                    rows={3}
                    name='bio'
                    placeholder='Enter Description'
                    value={values.bio}
                    onChange={e => {
                      setFieldValue('bio', e.target.value)
                    }}
                  />
                  <p className='error-msg'>
                    <ErrorMessage name='bio' />
                  </p>
                </div>

                <div className='field'>
                  <label>Artist Email</label>
                  <input
                    disabled={isEdit ? true : false}
                    name='email'
                    type='text'
                    placeholder='Artist email'
                    value={values.email}
                    onChange={e => {
                      setFieldValue('email', e.target.value)
                    }}
                  />
                  <p className='error-msg'>
                    <ErrorMessage name='email' />
                  </p>
                </div>
                {!isEdit && (
                  <div className='field hide'>
                    <label>Artist Password</label>
                    <input
                      disabled={true}
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      value={values.password}
                      onChange={e => {
                        setFieldValue('password', e.target.value)
                      }}
                    />
                    {showPassword ? (
                      <i
                        className='hideshow'
                        id='togglePassword'
                        onClick={() => setShowPassword(false)}
                      >
                        hide
                      </i>
                    ) : (
                      <i
                        class=' '
                        id='togglePassword'
                        onClick={() => setShowPassword(true)}
                      >
                        show
                      </i>
                    )}
                    <p className='error-msg'>
                      <ErrorMessage name='password' />
                    </p>
                  </div>
                )} */}
                <div className='field'>
                  <label>Is Featured ?</label>

                  <input
                    name='isFeatured'
                    type='checkbox'
                    checked={values.isFeatured}
                    value={values.isFeatured}
                    onChange={e => {
                      setFieldValue('isFeatured', e.target.checked ? 1 : 0)
                    }}
                  />
                  <p className='infoData'>
                    Note: If selected then it will display on home page
                  </p>
                </div>
                {/* <div>
                  <Checkbox
                    name="isActive"
                    label="Is Active?"
                    type="checkbox"
                    onClick={(e, d) => {
                      setFieldValue(
                        "isActive",
                        d.checked === true ? true : false
                      );
                    }}
                  />
                  <br />
                  <ErrorMessage name="isActive" />
                </div> */}
                <div className='form-group'>
                  <Button type='submit' primary>
                    {isEdit ? 'Update' : 'Add'} Artist
                  </Button>
                </div>
              </Form>
            </>
          )}
        />
      </div>
    </MainLayout>
  )
}

const mapStateToProps = state => ({
  initialValues: state.artist.artist
})

export default AddUser

// compose(
//   connect(mapStateToProps, null),
//   reduxForm({ form: "AddArtist", enableReinitialize: true })
// )(AddArtist);

{
  /* <Form
          autoComplete="off"
          autoFocus="off"
          onSubmit={handleSubmit(submitForm)}
        >
          <div>
            <Form.Field>
              <label>Select Brand</label>
              <Field
                component={FormField}
                name="brand"
                type="select"
                children={collectionsData}
                placeholder="select"
                validate={[required()]}
              />
            </Form.Field>
          </div>
          <div>
            {Array.isArray(images?.logo) && images?.logo.length > 0 && (
              <Image src={images.logo} width="150" />
            )}
            <Form.Field>
              <label>Upload Logo</label>
              <Field
                component={FormField}
                name="profileImage"
                type="file"
                placeholder="upload a file"
                onImageChange={onImageChange}
                validate={[required()]}
              />
              <small style={{ color: "blue" }}>
                Logo size (width:330px, height: 330px )
              </small>
            </Form.Field>
          </div>

          <div>
            {Array.isArray(images.banner) && images?.banner.length > 0 && (
              <Image src={images.banner} width="150" />
            )}

            <Form.Field>
              <label>Upload Cover Image</label>
              <Field
                component={FormField}
                name="coverImage"
                type="file"
                placeholder="upload a file"
                onImageChange={onImageChange}
                // validate={!isEdit && [required()]}
              />
              <small style={{ color: "blue" }}>
                Cover size (width:1920px, height: 726px )
              </small>
            </Form.Field>
          </div>

          <Form.Field>
            <label>Artist Name</label>
            <Field
              component={FormField}
              name="artistName"
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
            <label>Artist Email</label>
            <Field
              component={FormField}
              name="artistEmail"
              type="input"
              placeholder="Artist email"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field>
            <label>Artist Password</label>
            <Field
              component={FormField}
              name="artistPassword"
              type="password"
              placeholder="Password"
              validate={[required()]}
            />
          </Form.Field>

          <Form.Field>
            <Field
              component={FormField}
              name="isActive"
              label="Is Active?"
              type="checkbox"
            />
          </Form.Field>

          <Form.Field className="loginBtn">
            <Button type="submit" primary="true">
              {" "}
              Submit{" "}
            </Button>
          </Form.Field>
        </Form> */
}
