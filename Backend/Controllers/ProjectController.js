const { models } = require("../models/index");
//Add Project
async function createProject(req, res) {
  try {
      const { Name, Description, Responsables } = req.body;
      const partnerId = req.user.id;
      const project = await models.Project.create({
          Name,
          Description,
          partner_id: partnerId
      })
      await project.addResponsables(Responsables);

      res.status(201).json(project);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création du projet" });
  }
}

const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectsAsPartner = await models.Project.findAll({
      where: {
        isDeleted: false,
        partner_id: userId
      },
      include: [{
        model: models.Users,
        as: 'Responsables',
        attributes: ['nom', 'picture'],
        through: { attributes: [] }
      }],
      attributes: ['id', 'Name', 'Description', 'createdAt']
    });
    const projectsAsResponsable = await models.Project.findAll({
      where: {
        isDeleted: false
      },
      include: [{
        model: models.Users,
        as: 'Responsables',
        where: { id: userId },
        attributes: ['nom', 'picture'],
        through: { attributes: [] } 
      }],
      attributes: ['id', 'Name', 'Description', 'createdAt']
    });

    console.log("projectsAsPartner: ", projectsAsPartner);
    console.log("projectsAsResponsable: ", projectsAsResponsable);

    const allProjects = [...projectsAsPartner, ...projectsAsResponsable];
    const uniqueProjects = Array.from(new Set(allProjects.map(project => project.id)))
      .map(id => allProjects.find(project => project.id === id));

    const formattedProjects = uniqueProjects.map(project => ({
      id: project.id,
      Name: project.Name,
      Description: project.Description,
      createdAt: project.createdAt,
      Responsables: project.Responsables.map(user => ({
        nom: user.nom,
        picture: user.picture
      })).map(responsable => `${responsable.nom} (${responsable.picture})`).join(',')
    }));

    console.log("formattedProjects: ", formattedProjects);

    res.json(formattedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving Project" });
  }
};

    const deleteProject = async (req, res) => {
      try {
          const { id } = req.params;
          const project = await models.Project.findByPk(id);
          if (!project) {
              return res.status(404).json({ message: "Project not found." });
          }
          await project.update({ isDeleted: true });
          res.status(200).json({ message: "Project marked as deleted." });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error deleting Project." });
      }
  }
  
      const  updateProject = async (req, res) => {
        try {
       const { id } = req.params;
      const Project = await models.Project.findByPk(id);
          if (!Project) {
            return res.status(404).json({ message: "Project not found." });
          }
          await Project.update((req.body))
          res.status(200).json(Project);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error updating Project." });
        }
      }
          module.exports = {
            createProject,
            getAllProjects,
            deleteProject,
            updateProject};