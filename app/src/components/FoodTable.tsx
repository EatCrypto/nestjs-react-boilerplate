import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useMemo } from "react";
import { Food } from "../models/food";

const FoodTable = ({ foods }: { foods: Food[] }) => {
  const columns = useMemo<ColumnsType<Food>>(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Calorie",
        dataIndex: "calorie",
        key: "calorie",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Food Taken",
        dataIndex: "takenAt",
        key: "takenAt",
        render: (takenAt: string) => new Date(takenAt).toLocaleString(),
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={foods}
      rowKey={(row) => row.id}
      pagination={false}
      scroll={{ y: 560 }}
    />
  );
};

export default FoodTable;
