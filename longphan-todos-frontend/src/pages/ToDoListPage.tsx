import { useState, useEffect, useRef } from "preact/hooks";
import { format } from "date-fns";
import axios from "axios";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Tag } from "primereact/tag";
import { BASE_URL, Status } from "../constants/variables";
import { Dropdown } from "primereact/dropdown";

interface Task {
  id: string | null;
  task: string;
  status: string;
}

export default function ToDoListPage() {
  let emptytask: Task = {
    id: null,
    task: "",
    status: Status[0],
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDialog, setTaskDialog] = useState<boolean>(false);
  const [deleteTaskDialog, setDeleteTaskDialog] = useState<boolean>(false);
  const [deleteTasksDialog, setDeleteTasksDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(emptytask);
  const [newTask, setNewTask] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Task[]>>(null);

  const fetchAllTasks = () => {
    axios
      .get(`${BASE_URL}/tasks`)
      .then(response => {
        setTasks(response.data.content);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const openNew = () => {
    setNewTask(true);
    setTask(emptytask);
    setSubmitted(false);
    setTaskDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTaskDialog(false);
  };

  const hideDeleteTaskDialog = () => {
    setDeleteTaskDialog(false);
  };

  const hideDeleteTasksDialog = () => {
    setDeleteTasksDialog(false);
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      saveTask();
    }
  };

  const saveTask = () => {
    setSubmitted(true);

    if (task.task.trim()) {
      let _task = { ...task };

      if (task.id) {
        axios
          .patch(`${BASE_URL}/tasks/${task.id}`, _task)
          .then(() => {
            setTaskDialog(false);
            fetchAllTasks();
            toast.current?.show({ severity: "success", summary: "Successful", detail: "Task Updated", life: 3000 });
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post(`${BASE_URL}/tasks`, _task)
          .then(() => {
            setTaskDialog(false);
            fetchAllTasks();
            toast.current?.show({ severity: "success", summary: "Successful", detail: "Task Created", life: 3000 });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const editTask = (task: Task) => {
    setNewTask(false);
    setTask({ ...task });
    setTaskDialog(true);
  };

  const confirmDeleteTask = (task: Task) => {
    setTask(task);
    setDeleteTaskDialog(true);
  };

  const deleteTask = () => {
    axios
      .delete(`${BASE_URL}/tasks/${task.id}`)
      .then(() => {
        setDeleteTaskDialog(false);
        setTask(emptytask);
        toast.current?.show({ severity: "success", summary: "Successful", detail: "Task Deleted", life: 3000 });
        fetchAllTasks();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const confirmDeleteSelected = () => {
    setDeleteTasksDialog(true);
  };

  const deleteCompletedTasks = () => {
    axios
      .delete(`${BASE_URL}/tasks/remove/completed`)
      .then(() => {
        setDeleteTasksDialog(false);
        toast.current?.show({ severity: "success", summary: "Successful", detail: "Deleted Completed Tasks", life: 3000 });
        fetchAllTasks();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onInputChange = (e: any, name: string) => {
    const val = (e.target && e.target.value) || "";
    let _task = { ...task };

    // @ts-ignore
    _task[name] = val;

    setTask(_task);
  };
  const statusItemTemplate = (option: string) => {
    return <Tag value={option.toUpperCase()} severity={getSeverity(option)} />;
  };
  const statusFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={Status}
        onChange={e => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder='Select One'
        className='p-column-filter'
        showClear
      />
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        <Button label='New task' icon='pi pi-plus' severity='success' onClick={openNew} />
        <Button label='Delete all completed tasks' icon='pi pi-trash' severity='danger' onClick={confirmDeleteSelected} />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: Task) => {
    return <Tag value={rowData.status.toUpperCase()} severity={getSeverity(rowData.status)}></Tag>;
  };

  const actionBodyTemplate = (rowData: Task) => {
    return (
      <>
        <Button icon='pi pi-pencil' rounded outlined className='mr-2' onClick={() => editTask(rowData)} />
        <Button icon='pi pi-trash' rounded outlined severity='danger' onClick={() => confirmDeleteTask(rowData)} />
      </>
    );
  };

  const getSeverity = (statusParam: string) => {
    switch (statusParam) {
      case Status[2]:
        return "success";

      case Status[1]:
        return "warning";

      case Status[0]:
        return "danger";

      default:
        return null;
    }
  };

  const header = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
      <h4 className='m-0'>Manage tasks</h4>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search...'
          onInput={(e: any) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </span>
    </div>
  );
  const taskDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button label={newTask ? "Add" : "Update"} icon='pi pi-check' onClick={saveTask} />
    </>
  );
  const deleteTaskDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteTaskDialog} />
      <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteTask} />
    </>
  );
  const deleteTasksDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteTasksDialog} />
      <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteCompletedTasks} />
    </>
  );

  return (
    <div>
      <p className='text-center'>Long Phan Personal Todo Application {format(new Date(), "dd/MM/yyyy")}</p>
      <Toast ref={toast} />
      <div className='card'>
        <Toolbar className='mb-4' start={leftToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={tasks}
          selection={null}
          dataKey='id'
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} tasks'
          globalFilter={globalFilter}
          header={header}
          removableSort
          selectionMode='single'
        >
          <Column field='id' header='ID' sortable style={{ minWidth: "12rem" }}></Column>
          <Column field='task' header='Task' sortable style={{ minWidth: "16rem" }}></Column>
          <Column
            field='status'
            header='Status'
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
            filter
            filterElement={statusFilterTemplate}
            filterMenuStyle={{ width: "14rem" }}
            showFilterMenuOptions={false}
          ></Column>
          <Column header='Action' body={actionBodyTemplate} exportable={false} style={{ minWidth: "12rem" }}></Column>
        </DataTable>
      </div>

      <Dialog
        visible={taskDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={task && !newTask ? `Task Details #${task.id}` : "New Task Details"}
        modal
        className='p-fluid'
        footer={taskDialogFooter}
        onHide={hideDialog}
      >
        <div className='field'>
          <label htmlFor='task' className='font-bold'>
            Name
          </label>
          <InputText
            id='task'
            value={task.task}
            onChange={(e: any) => onInputChange(e, "task")}
            onKeyPress={handleKeyPress}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !task.task })}
          />
          {submitted && !task.task && <small className='p-error'>Task name is required.</small>}
        </div>

        {!newTask && (
          <div className='field'>
            <label className='mb-3 font-bold'>Status</label>
            <div className='formgrid grid'>
              {Status.map((status, index) => {
                return (
                  <div className='field-radiobutton col-6' key={index}>
                    <RadioButton
                      inputId={status}
                      name='status'
                      value={status}
                      onChange={(e: any) => onInputChange(e, "status")}
                      checked={task?.status === status}
                    />
                    <label htmlFor={status} className='ml-2'>
                      {status.toUpperCase()}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        visible={deleteTaskDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header='Confirm'
        modal
        footer={deleteTaskDialogFooter}
        onHide={hideDeleteTaskDialog}
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: "2rem" }} />
          {task && (
            <span>
              Are you sure you want to delete <b>{task.task}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteTasksDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header='Confirm'
        modal
        footer={deleteTasksDialogFooter}
        onHide={hideDeleteTasksDialog}
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: "2rem" }} />
          {task && <span>Are you sure you want to delete the selected tasks?</span>}
        </div>
      </Dialog>
    </div>
  );
}
