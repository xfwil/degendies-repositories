const inquirer = require("inquirer");
const fs = require("fs");

const fileName = "blum.json";

const main = async () => {
  console.log(`BLUM Task Manager`);
  console.log(`1. List Task`);
  console.log(`2. Add Task`);
  console.log(`3. Remove Task`);

  console.log();

  const { choice } = await inquirer.prompt({
    type: "list",
    name: "choice",
    message: "Select an option",
    choices: ["List Task", "Add Task", "Remove Task"],
  });
  console.log();

  if (choice === "Add Task") {
    const { taskId, taskAnswer } = await inquirer.prompt([
      {
        type: "input",
        name: "taskId",
        message: "Enter Task ID",
      },
      {
        type: "input",
        name: "taskAnswer",
        message: "Enter Task Answer",
      },
    ]);

    console.log();

    const readFileJSON = JSON.parse(fs.readFileSync(fileName, "utf8"));
    if (readFileJSON.tasks.length === 0) {
      readFileJSON.tasks.push({ id: taskId, answer: taskAnswer });
      await fs.writeFileSync(fileName, JSON.stringify(readFileJSON, null, 4));
    } else {
      const isIdExist = readFileJSON.tasks.some((task) => task.id === taskId);
      if (isIdExist) {
        console.log(`Task ID already exist`);
        return;
      }

      readFileJSON.tasks.push({ id: taskId, answer: taskAnswer });
      console.log(`Task added: Task ${readFileJSON.tasks.length}`);
      await fs.writeFileSync(fileName, JSON.stringify(readFileJSON, null, 4));
    }
  } else if (choice === "List Task") {
    const readFileJSON = JSON.parse(fs.readFileSync(fileName, "utf8"));
    console.log(`Task list:`);
    for (let i = 0; i < readFileJSON.tasks.length; i++) {
      console.log(
        `${i + 1}. ${readFileJSON.tasks[i].id}, Answer: ${
          readFileJSON.tasks[i].answer
        }`
      );
    }
  } else if (choice === "Remove Task") {
    const readFileJSON = JSON.parse(fs.readFileSync(fileName, "utf8"));
    const taskList = readFileJSON.tasks.map((task) => task.id);
    const { task } = await inquirer.prompt({
      type: "list",
      name: "task",
      message: "Select a task to remove",
      choices: taskList,
    });

    const isTaskExist = readFileJSON.tasks.some((t) => t.id === task);
    if (!isTaskExist) {
      console.log(`Task not found`);
      return;
    }

    const taskIndex = readFileJSON.tasks.findIndex((t) => t.id === task);
    readFileJSON.tasks.splice(taskIndex, 1);

    await fs.writeFileSync(fileName, JSON.stringify(readFileJSON, null, 4));
    console.log(`Task removed`);
  } else {
    console.log(`Invalid choice`);
  }
};

main();
