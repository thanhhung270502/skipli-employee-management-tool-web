import { TaskObject } from "@/common/models/task";
import { Button } from "@/shared";
import { useDeleteTaskMutation } from "@/shared/hooks";
import { Edit2, Trash2 } from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";

type OwnerTasksActionsProps = {
  task: TaskObject;
  onEdit: (task: TaskObject) => void;
};
export const OwnerTasksActions = ({ task, onEdit }: OwnerTasksActionsProps) => {
  const deleteMutation = useDeleteTaskMutation();

  const handleDelete = useCallback(async () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      try {
        await deleteMutation.mutateAsync(task.id);
        toast.success("Task deleted successfully! 🗑️");
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message ?? "Failed to delete task");
      }
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        iconOnly
        className="size-8"
        onClick={() => onEdit(task)}
        title="Edit Task"
      >
        <Edit2 size={13} />
      </Button>
      <Button
        variant="danger"
        iconOnly
        className="size-8"
        onClick={handleDelete}
        loading={deleteMutation.isPending}
        title="Delete Task"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
};
