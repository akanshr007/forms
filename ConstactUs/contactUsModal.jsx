import React, { useState } from "react";
import { Modal, Input, Button, Message } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { addoptions } from "../../../redux/_actions/user.action";
import { toast } from "../../../components/Toast//Toast";

const ContactUsModal = ({
  isOpen,
  onClose,
  optionDetails,
  type,
  handleEdit,
  getDetails,
}) => {
  const [inputValue, setInputValue] = useState(
    type === "add" ? "" : optionDetails?.user_label
  );
  const [inputEmpty, setInputEmpty] = useState(false);
  const [inputValid, setInputValid] = useState(true); // State to track input validity
  const dispatch = useDispatch();

  const handleAddContactLabel = async () => {
    // Trim the inputValue to remove leading and trailing whitespace
    const trimmedValue = inputValue.trim();

    // Check if the trimmed value is empty or does not meet the length criteria
    if (
      trimmedValue === "" ||
      trimmedValue.length < 5 ||
      trimmedValue.length > 40
    ) {
      // Display error message or handle invalid input state
      setInputEmpty(true); // Set inputEmpty state to true for displaying error message
      return; // Exit early if validation fails
    }

    // Check if the inputValue contains leading spaces
    if (inputValue !== trimmedValue) {
      // Display error message or handle invalid input state (leading spaces)
      setInputEmpty(true); // Set inputEmpty state to true for displaying error message
      return; // Exit early if validation fails
    }

    try {
      // Proceed with dispatching the action to add the option label
      const res = await dispatch(addoptions({ user_label: trimmedValue }));

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message);
      }

      onClose(); // Close the modal upon successful label addition
      getDetails(); // Refresh the details (e.g., fetch updated data)
    } catch (error) {
      console.error("Error adding option:", error);
      // Handle error scenario (e.g., display error message)
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    const isValidLength = value.length >= 5 && value.length <= 40;

    // Validate input against alphabetic characters using regex
    const isValid = /^[a-zA-Z|\s]+$/.test(value);

    if (isValid || value === "") {
      setInputValue(value);
      setInputEmpty(false);
      setInputValid(isValidLength);
    } else {
      setInputValue(value);
      setInputEmpty(false);
      setInputValid(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && type === "add") {
      e.preventDefault();
      handleAddContactLabel();
    } else if (e.key === "Enter" && type === "edit") {
      handleEdit(inputValue);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>
        {type === "edit" ? "Edit Option" : "Add Option"}
      </Modal.Header>
      <Modal.Content>
        <Input
          fluid
          placeholder="Enter option"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Handle key press event
          error={!inputValid} // Apply error style if input is invalid
        />
        {!inputValid && (
          <Message color="red" size="mini" style={{ marginTop: "5px" }}>
            Option must contain only alphabetic characters and be between 5 and
            40 characters long, without invalid spacing.
          </Message>
        )}
        {inputEmpty && (
          <Message color="red" size="mini" style={{ marginTop: "5px" }}>
            Option must contain only alphabetic characters and be between 5 and
            40 characters long, without invalid spacing.
          </Message>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={onClose}>
          Cancel
        </Button>
        <Button
          content={type === "edit" ? "Update" : "Submit"}
          positive
          onClick={
            type === "edit"
              ? () => handleEdit(inputValue)
              : handleAddContactLabel
          }
          disabled={!inputValid || inputValue.trim() === ""}
          type="submit"
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ContactUsModal;
