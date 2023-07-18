import { Button, Checkbox, DatePicker, Form, Input, Select } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";
import { EditReservationForm, Reservation } from "./types";
import moment from "moment";
import dayjs from "dayjs";
const { Option } = Select;

interface editReservationProps {
  form: FormInstance<EditReservationForm>;
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
  editedReservation: Reservation;
}

const EditReservation: React.FC<editReservationProps> = ({
  form,
  onFinish,
  onFinishFailed,
  editedReservation,
}) => {
  return (
    <>
      <Form
        name="editReservation"
        labelCol={{ span: 7 }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Reservation Date"
          name="reservationDate"
          rules={[
            { required: true, message: "Please input reservation date!" },
          ]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            style={{ width: "100%" }}
            placeholder="Input reservation date"
          />
        </Form.Item>

        <Form.Item
          label="Expiration Date"
          name="expirationDate"
          rules={[{ required: true, message: "Please input expiration date!" }]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            style={{ width: "100%" }}
            placeholder="Input expiration date"
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default EditReservation;
