const { models } = require("../models/index")
const xlsx = require('xlsx')

async function createTask(req, res) {
  try {
      const { Title, Description, ProjectId, HoursNumber, UserId } = req.body;

      // Vérifiez si une tâche avec le même titre et la même description existe déjà
      const existingTask = await models.Tache.findOne({
          where: {
              Title: Title,
              Description: Description
          }
      });

      if (existingTask) {
          return res.status(400).json({ error: "A task with the same title and description already exists" });
      }
      const Tache = await models.Tache.create({
          Title: Title,
          Description: Description,
          ProjectId: ProjectId,
          HoursNumber: HoursNumber,
          UserId: UserId
      });

      res.status(201).json(Tache);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de Project" });
  }
}

const getAllTaches= async (req, res) => {
    try {
      const Tache= await models.Tache.findAll();
      res.json(Tache);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving taches" });
    }
}
//DELETE TACHE 
const deleteTache = async (req, res) => {
  try {
    const { id } = req.params;
   const Tache = await models.Tache.findByPk(id);
   if (!Tache) {
      return res.status(404).json({ message: "Tache not found." });}
     await Tache.destroy();
  res.status(200).json({ message: "Tache deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting Tache." });
  }
}

//import Task
const ImportTask = async (req, res) => {
  try {
    const { userId } = req.body;
const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const tasksData = xlsx.utils.sheet_to_json(worksheet);

    for (const taskData of tasksData) {
      const existingTask = await models.Tache.findOne({
        where: { Title: taskData.Title, Description: taskData.Description }
      });
      if (!existingTask) {
        const projectTitle = taskData.Name;

        const projectId = await models.Project.findOne({
          where: { Name: projectTitle }
        }).then(project => (project ? project.id : null));
        console.log(projectTitle);
        const newTask = {
          Title: taskData.Title,
          Description: taskData.Description,
          ProjectId: projectId,
          UserId: userId,
          HoursNumber:taskData.HoursNumber
        };
        console.log(newTask)

        await models.Tache.create(newTask);
      }
    }

    console.log('Tâches importées avec succès');
    res.status(200).send('Tâches importées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'importation :', error);
    res.status(500).send('Erreur lors de l\'importation');
  }
};

//update Task
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  try {
      const {Title,Description,HoursNumber}  = req.body;
      const task = await models.Tache.findByPk(taskId);
      if (!task) {
          return res.status(404).json({ error: "task not found" });
      }

      const updatedtask = await task.update({Title,Description,HoursNumber});

      return res.status(200).json(updatedtask);

  } catch (error) {
      return res.status(500).json({ error: "Cannot update task" });
  }
};
module.exports = {createTask,
            getAllTaches,
            deleteTache,
            ImportTask,
            updateTask
          };