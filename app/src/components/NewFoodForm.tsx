import { AutoComplete, Button, DatePicker, Form, InputNumber } from "antd";
import { useMemo } from "react";
import { NewFoodEntry } from "../models/food";

const NewFoodForm = ({
  onSubmit,
  list,
}: {
  list: string[];
  onSubmit: (newEntry: NewFoodEntry) => void;
}) => {
  const [form] = Form.useForm();

  const options = useMemo(() => list.map((value) => ({ value })), [list]);

  return (
    <Form layout="inline" form={form} onFinish={onSubmit}>
      <Form.Item
        name="name"
        label="Food Name"
        rules={[{ required: true, message: "Name missing!" }]}
      >
        <AutoComplete options={options} style={{ width: 150 }} />
      </Form.Item>

      <Form.Item
        name="calorie"
        label="Calorie"
        rules={[{ required: true, message: "Calorie missing!" }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Price missing!" }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="takenAt"
        label="Taken At"
        rules={[{ required: true, message: "Date missing!" }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          + New Entry
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewFoodForm;
