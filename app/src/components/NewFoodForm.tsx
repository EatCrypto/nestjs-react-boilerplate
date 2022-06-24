import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import { NewFoodEntry } from "../models/food";

const NewFoodForm = ({
  onSubmit,
}: {
  onSubmit: (newEntry: NewFoodEntry) => void;
}) => {
  const [form] = Form.useForm();

  return (
    <Form layout="inline" form={form} onFinish={onSubmit}>
      <Form.Item
        name="name"
        label="Food Name"
        rules={[{ required: true, message: "Name missing!" }]}
      >
        <Input />
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
