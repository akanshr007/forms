import React from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { KycActions } from "../../../../redux/_actions";

const initialValues = {
  remark: "",
};

const schema = Yup.object().shape({
  remark: Yup.string()
    .required("This field is required")
    .min(10, "Minimum 10 charactor required"),
});
function RejectKyc({ kycDetail, myKycActions }) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color="red">Reject</Button>}
    >
      <Modal.Header>Add Remark For KYC Rejection</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Formik
            enableReinitialize={true}
            enableReinitializing={true}
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (values, { resetForm }) => {
              const { changeKycStatus } = KycActions;
              const res = dispatch(
                changeKycStatus({
                  userId: kycDetail.userId,
                  kycStatus: "FAILED",
                  remark: values?.remark,
                })
              ).then((data) => {
                if (data) {
                  myKycActions();
                }
              });
              setOpen(false);
            }}
            render={({ values, setFieldValue }) => (
              <>
                <Form className="ui form">
                  <div className="field">
                    <label>Remark *</label>
                    <input
                      name="remark"
                      type="text"
                      placeholder="Add your remark here"
                      value={values.remark}
                      onChange={(e) => {
                        setFieldValue("remark", e.target.value);
                      }}
                    />
                    <p className="error-msg">
                      <ErrorMessage name="remark" />
                    </p>
                  </div>

                  <div className="form-group">
                    <Button color="black" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" color="red" content="Ok" />
                  </div>
                </Form>
              </>
            )}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default RejectKyc;
