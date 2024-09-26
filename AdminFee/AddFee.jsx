import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Dropdown, Form, Input, Modal } from "semantic-ui-react";
import * as Yup from "yup";

function AddFee({ open, setOpen, setNftFees, data }) {
  const options = [
    { key: "Percentage", text: "Percentage", value: "percentage" },
    { key: "fixed", text: "Fixed", value: "fixed" },
  ];

  const schema = Yup.object().shape({
    fees: Yup.number()
      .min(0)
      .required("Fees is requied")
      .typeError("Fees must be a number"),
  });

  const formik = useFormik({
    initialValues: { fees: data?.fees || "", types: data?.types || "fiat" },
    validationSchema: schema,
    onSubmit: (values) => {
      const data = {
        types: values.types,
        fees: values.fees,
      };
      setNftFees(data);
      formik.resetForm();
      setOpen();
    },
  });

  return (
    <Modal onClose={setOpen} onOpen={setOpen} open={open}>
      <Modal.Header>Add Commission</Modal.Header>

      <Modal.Content image>
        {" "}
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field>
            <Dropdown
              placeholder="Select Fee"
              fluid
              selection
              options={options}
              id="types"
              name="types"
              onChange={(e, data) => formik.setFieldValue("types", data.value)}
              value={formik.values.types}
            />
          </Form.Field>

          <Form.Field>
            <label>Add fees</label>
            <Input
              placeholder="Fees..."
              types="number"
              name="fees"
              id="fees"
              onChange={formik.handleChange}
              value={formik.values.fees}
              //error={formik.errors.fees}
            />
          </Form.Field>
          {formik.errors.fees && (
            <p style={{ color: "red" }}>{formik.errors.fees}</p>
          )}
          <Button secondary onClick={setOpen}>
            Cancel
          </Button>
          <Button type="submit" positive>
            Submit
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default AddFee;
