import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  tag: string;
}

function App() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { error, data } = await supabase.from("tasks").select("*");
    if (error) {
      console.log("error get tasks: ", error.message);
      return;
    }

    setTasks(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(newTask);
    var prompt =
      "Help me to give a tag for task description, the tag is only work, personal, study, health, other. just give me one word, only the tag. the description is " +
      newTask.description;

    const { data, error: errorTag } = await supabase.functions.invoke(
      "ask-gemini",
      {
        body: { prompt: prompt },
      }
    );

    if (errorTag) {
      console.log("Error get tag: ", errorTag.message);
    }
    var tag = data.tag;

    const taskToInsert = { ...newTask, tag };
    const { error } = await supabase
      .from("tasks")
      .insert(taskToInsert)
      .single();
    if (error) {
      console.log("Error adding task: ", error.message);
    }
    setNewTask({ title: "", description: "" });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">🌸 Task Manager</h1>

        {/* Form (column layout) */}
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            className="input"
            onChange={(event) => {
              const newTitle = event.target.value;
              setNewTask((previousTask) => {
                return { ...previousTask, title: newTitle };
              });
            }}
          />
          <textarea
            placeholder="Description (optional)"
            className="textarea"
            rows={3}
            onChange={(event) => {
              const newDescription = event.target.value;
              setNewTask((previousTask) => {
                return { ...previousTask, description: newDescription };
              });
            }}
          ></textarea>
          <button type="submit" className="btn">
            Add Task
          </button>
        </form>

        {/* Example task list */}
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task">
              <div className="task-info">
                <h2 className="task-title">{task.title}</h2>
                <p className="task-desc">{task.description}</p>
                <h4
                  style={{
                    color: "#333",
                  }}
                >
                  {task.tag}
                </h4>
              </div>
              <button className="delete-btn">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
