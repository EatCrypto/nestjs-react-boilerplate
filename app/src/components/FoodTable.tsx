import { Button, Form, Space, Table, Typography } from "antd";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { Food } from "../models/food";
import { User } from "../models/user";
import FoodTableEditableCell from "./FoodTableEditableCell";

const FoodTable = ({
  foods,
  editable,
  user,
  onUpdate,
  onDelete,
}: {
  foods: Food[];
  editable?: boolean;
  user: User;
  onDelete?: (id: number) => void;
  onUpdate?: (food: Food) => void;
}) => {
  const [form] = Form.useForm();

  const [editableFood, setEditableFood] = useState<Food>();

  const onEdit = useCallback(
    (food: Food) => {
      setEditableFood(food);
      form.setFieldsValue({ ...food, takenAt: moment(new Date(food.takenAt)) });
    },
    [form]
  );

  const onSave = useCallback(async () => {
    if (editableFood && onUpdate) {
      const { takenAt, ...input } = await form.validateFields();
      const updatedFood: Food = {
        ...input,
        takenAt: takenAt.toISOString(),
        id: editableFood.id,
      };
      onUpdate(updatedFood);
      setEditableFood(undefined);
    }
  }, [editableFood, form, onUpdate]);

  const columns = useMemo(
    () => [
      ...[
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          editable: true,
        },
        {
          title: "Calorie",
          dataIndex: "calorie",
          key: "calorie",
          editable: true,
        },
        {
          title: "Price",
          dataIndex: "price",
          key: "price",
          editable: true,
          render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
          title: "Food Taken",
          dataIndex: "takenAt",
          key: "takenAt",
          editable: true,
          render: (takenAt: string, food: Food) => (
            <Space direction="vertical" size="small">
              <Typography>{new Date(takenAt).toLocaleDateString()}</Typography>
              <Typography
                style={{
                  color:
                    food.threshold > user.dailyCalorieLimit ? "red" : undefined,
                }}
              >
                (Total calorie used for the day {food.threshold} /{" "}
                {user.dailyCalorieLimit})
              </Typography>
              <Typography
                style={{
                  color: food.cost > user.monthlyCostLimit ? "red" : undefined,
                }}
              >
                (Total spent for the month ${food.cost.toFixed(2)} / $
                {user.monthlyCostLimit.toFixed(2)})
              </Typography>
            </Space>
          ),
        },
      ],
      ...(editable
        ? [
            {
              title: "",
              dataIndex: "operation",
              render: (_: any, food: Food) =>
                editableFood?.id === food.id ? (
                  <Space>
                    <Button type="link" onClick={onSave}>
                      Save
                    </Button>
                    <Button
                      type="link"
                      onClick={() => setEditableFood(undefined)}
                    >
                      Cancel
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Button type="link" onClick={() => onEdit(food)}>
                      Edit
                    </Button>
                    <Button
                      type="link"
                      onClick={() => onDelete && onDelete(food.id)}
                    >
                      Delete
                    </Button>
                  </Space>
                ),
            },
          ]
        : []),
    ],
    [
      editable,
      editableFood?.id,
      onDelete,
      onEdit,
      onSave,
      user.dailyCalorieLimit,
      user.monthlyCostLimit,
    ]
  );

  const mergedColumns = useMemo(
    () =>
      columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (food: Food) => ({
            record: food,
            inputType:
              col.dataIndex === "name"
                ? "text"
                : col.dataIndex === "takenAt"
                ? "datetime"
                : "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: food.id === editableFood?.id,
          }),
        };
      }),
    [columns, editableFood?.id]
  );

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: FoodTableEditableCell,
          },
        }}
        columns={mergedColumns}
        dataSource={foods}
        rowKey={(row) => row.id}
        pagination={false}
        scroll={{ y: 800 }}
      />
    </Form>
  );
};

export default FoodTable;
