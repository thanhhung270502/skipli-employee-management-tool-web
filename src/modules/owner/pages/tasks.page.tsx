"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  useQueryAllTasks,
  useQueryEmployees,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/shared/hooks";
import { Button, EmptyState, PageHeader, Skeleton, TaskListSkeleton } from "@/shared/components";
import { formatToInputDate } from "@/shared/utils";
import { useTaskForm } from "../hooks";
import { TaskCard, TaskFormModal } from "../components";
import type { TaskObject } from "@/common/models/task";

export function TasksPage() {
  const { data: taskData, isLoading: tasksLoading } = useQueryAllTasks();
  const { data: empData } = useQueryEmployees();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();

  const tasks = taskData?.tasks ?? [];
  const activeEmployees = (empData?.employees ?? []).filter((e) => e.isSetup);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskObject | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "done">("all");

  const { methods, reset } = useTaskForm();

  const handleEditClick = (task: TaskObject) => {
    setEditingTask(task);
    methods.reset({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo,
      dueDate: formatToInputDate(task.dueDate),
      priority: task.priority,
    });
    setModalOpen(true);
  };

  const handleCreateTask = methods.handleSubmit(async (data) => {
    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({
          taskId: editingTask.id,
          data: {
            title: data.title,
            description: data.description,
            assignedTo: data.assignedTo,
            dueDate: data.dueDate || null,
            priority: data.priority,
          },
        });
        toast.success("Task updated!");
      } else {
        await createTaskMutation.mutateAsync({
          title: data.title,
          description: data.description,
          assignedTo: data.assignedTo,
          dueDate: data.dueDate || undefined,
          priority: data.priority,
        });
        toast.success("Task created!");
      }
      setModalOpen(false);
      setEditingTask(null);
      reset();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Failed to save task");
    }
  });

  const filtered = tasks.filter((t) => (filter === "all" ? true : t.status === filter));

  const openCreateModal = () => {
    setEditingTask(null);
    reset();
    setModalOpen(true);
  };

  if (tasksLoading) {
    return (
      <div>
        <div className="mb-8">
          <Skeleton width={120} height={32} className="mb-2" />
          <Skeleton width={180} height={16} />
        </div>
        <TaskListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} total task${tasks.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="secondary" className="w-auto" onClick={openCreateModal}>
            <Plus size={16} /> Create Task
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "pending", "in_progress", "done"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "ghost"}
            size="sm"
            className="w-auto capitalize"
            onClick={() => setFilter(f)}
          >
            {f === "in_progress" ? "In Progress" : f}{" "}
            {f === "all"
              ? `(${tasks.length})`
              : f === "pending"
                ? `(${tasks.filter((t) => t.status === "pending").length})`
                : f === "in_progress"
                  ? `(${tasks.filter((t) => t.status === "in_progress").length})`
                  : `(${tasks.filter((t) => t.status === "done").length})`}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title={`No ${filter !== "all" ? (filter === "in_progress" ? "in progress" : filter) : ""} tasks`}
          description="Create a task and assign it to an employee"
          action={
            <Button variant="primary" className="mt-4 w-auto" onClick={openCreateModal}>
              <Plus size={16} /> Create Task
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} onEdit={() => handleEditClick(task)} />
          ))}
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        employees={activeEmployees}
        methods={methods}
        onSubmit={handleCreateTask}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
          reset();
        }}
        isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
        isEdit={!!editingTask}
      />
    </div>
  );
}
