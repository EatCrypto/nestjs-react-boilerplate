import { DatePicker, Form, Input, InputNumber } from "antd";
import { Food } from "../models/food";

type Props = React.HTMLAttributes<HTMLElement> & {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text" | "datetime";
  record: Food;
  index: number;
  children: React.ReactNode;
};

const FoodTableEditableCell: React.FC<Props> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "text" ? (
      <Input />
    ) : (
      <DatePicker />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default FoodTableEditableCell;
