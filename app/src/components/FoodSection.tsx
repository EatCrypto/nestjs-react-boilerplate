import { Modal, Space } from "antd";
import { useCallback, useState } from "react";
import {
  useAddNewFood,
  useDeleteFood,
  useUpdateFood,
  useUserFoodNameList,
  useUserFoods,
} from "../hooks/api/food";
import { Food, NewFoodEntry } from "../models/food";
import FoodFilter from "./FoodFilter";
import FoodTable from "./FoodTable";
import NewFoodForm from "./NewFoodForm";

const FoodSection = ({
  userId,
  editable,
}: {
  userId: number;
  editable?: boolean;
}) => {
  const [filterRange, setFilterRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);
  const { data } = useUserFoods(userId, filterRange);
  const { data: foodNames } = useUserFoodNameList(userId);

  const addNewFoodMutation = useAddNewFood();
  const updateFoodMutation = useUpdateFood();
  const deleteFoodMutation = useDeleteFood();

  const onAddNewFood = useCallback(
    (entry: NewFoodEntry) => {
      addNewFoodMutation.mutate(
        {
          ...entry,
          userId,
          takenAt: entry.takenAt.toISOString(),
        },
        {
          onError: (error) => {
            Modal.error({
              title: "Something went wrong!",
              content: (error as Error).message,
            });
          },
        }
      );
    },
    [addNewFoodMutation, userId]
  );

  const onUpdateFood = useCallback(
    (updatedFood: Food) => {
      updateFoodMutation.mutate(updatedFood, {
        onError: (error) => {
          Modal.error({
            title: "Something went wrong!",
            content: (error as Error).message,
          });
        },
      });
    },
    [updateFoodMutation]
  );

  const onDeleteFood = useCallback(
    (id: number) => {
      deleteFoodMutation.mutate(id);
    },
    [deleteFoodMutation]
  );

  return (
    <Space direction="vertical">
      <Space direction="vertical" size="large">
        <NewFoodForm list={foodNames ?? []} onSubmit={onAddNewFood} />
        <FoodFilter onChange={setFilterRange} range={filterRange} />
      </Space>

      <FoodTable
        foods={data || []}
        editable={editable}
        onUpdate={editable ? onUpdateFood : undefined}
        onDelete={editable ? onDeleteFood : undefined}
      />
    </Space>
  );
};

export default FoodSection;
