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
import { User } from "../models/user";
import FoodFilter from "./FoodFilter";
import FoodTable from "./FoodTable";
import NewFoodForm from "./NewFoodForm";

const FoodSection = ({
  user,
  editable,
}: {
  user: User;
  editable?: boolean;
}) => {
  const [filterRange, setFilterRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);
  const { data } = useUserFoods(user.id, filterRange);
  const { data: foodNames } = useUserFoodNameList(user.id);

  const addNewFoodMutation = useAddNewFood();
  const updateFoodMutation = useUpdateFood();
  const deleteFoodMutation = useDeleteFood();

  const onAddNewFood = useCallback(
    (entry: NewFoodEntry) => {
      addNewFoodMutation.mutate(
        {
          ...entry,
          userId: user.id,
          takenAt: entry.takenAt.toISOString(),
        },
        {
          onSuccess: ({ data }) => {
            if (data.threshold > user.dailyCalorieLimit) {
              Modal.error({
                title: "Something went wrong!",
                content: `You exceeded daily calorie limit. Limit: ${user.dailyCalorieLimit}, Used: ${data.threshold}`,
              });
            }
            if (data.cost > user.monthlyCostLimit) {
              Modal.error({
                title: "Something went wrong!",
                content: `You exceeded monthly cost limit. Limit: ${user.monthlyCostLimit}, Used: ${data.cost}`,
              });
            }
          },
        }
      );
    },
    [addNewFoodMutation, user.dailyCalorieLimit, user.id, user.monthlyCostLimit]
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
        user={user}
        editable={editable}
        onUpdate={editable ? onUpdateFood : undefined}
        onDelete={editable ? onDeleteFood : undefined}
      />
    </Space>
  );
};

export default FoodSection;
