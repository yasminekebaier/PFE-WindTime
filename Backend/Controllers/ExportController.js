const { models } = require("../models/index")
const excelJs = require("exceljs")
const { Op } = require('sequelize')
const workbook= new excelJs.Workbook()
const worksheet = workbook.addWorksheet("list of users")
const dayjs = require('dayjs');
 const exportAllTache = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
const tasks = await models.Tache.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                { model: models.Users, as: 'User', attributes: ['nom'] },
                { model: models.Project, as: 'Project', attributes: ['Name'] }
            ]
        })

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("list of tasks");
        const dateRange = `Date From: ${startDate} to ${endDate}`;
        // Titre du fichier
      worksheet.addRow(["WindTime"]).font = { bold: true,color: { argb: 'FFFFFF' },}
      const titleRow = worksheet.addRow(["WindTime"])
      titleRow.font = { bold: true, color: { argb: '1A9BC3' }, size: 40 };
      titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }}
      titleRow.alignment = { horizontal: 'center' }
      worksheet.addRow([]);
      worksheet.addRow([]); 
      const dateRangeRow = worksheet.addRow([dateRange]);
      dateRangeRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
      dateRangeRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };

      worksheet.addRow([])
      worksheet.addRow([])
      const headers = ["Date of creation","Title","Description" ,"Project","User"]
      const headerRow = worksheet.addRow(headers)
      headerRow.font = { bold: true, color: { argb: '080D50' }, size: 16 };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
      worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`)
        const header = [
            { header:"Date of creation", key:"createdAt", width:30 },
            { header:"Title", key:"Title", width:20 },
            { header:"Description", key:"Description", width:40 },
            { header:"Project", key:"Project", width:20 },
            { header:"User", key:"User", width:20 },
            
        ];
        worksheet.columns = header;

        tasks.forEach((task) => {
            worksheet.addRow({
                Title: task.Title,
                Description: task.Description,
                Project: task.Project.Name,
                User: task.User.nom,
                createdAt: task.createdAt
            });
        });

        workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        console.error("Error exporting tasks:", error);
        res.status(500).send("Internal Server Error");
    }
}
const exportTache = async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;
        const user = await models.Users.findByPk(userId);
        const tasks = await models.Tache.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                UserId: userId 
            },
            include: [
                { model: models.Users, as: 'User', attributes: ['nom'] },
                { model: models.Project, as: 'Project', attributes: ['Name'] }
            ]
        })
        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("list of tasks")
        const userName = `User: ${user.nom}`;
        const dateRange = `Date From: ${startDate} to ${endDate}`;
      
      worksheet.addRow(["WindTime"]).font = { bold: true,color: { argb: 'FFFFFF' },}
      const titleRow = worksheet.addRow(["WindTime"])
      titleRow.font = { bold: true, color: { argb: '1A9BC3' }, size: 40 };
      titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }}
      titleRow.alignment = { horizontal: 'center' }
      worksheet.addRow([]);
      worksheet.addRow([]); 
     
      const UsernameRow = worksheet.addRow([userName]);
      UsernameRow .font = { bold: true, color: { argb: '080D50' }, size: 15 };
      UsernameRow .fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
      const dateRangeRow = worksheet.addRow([dateRange]);
      dateRangeRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
      dateRangeRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };

      worksheet.addRow([])
      worksheet.addRow([])
      const headers = ["Date of creation","Title","Description" ,"Project"]
      const headerRow = worksheet.addRow(headers)
      headerRow.font = { bold: true, color: { argb: '080D50' }, size: 16 };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
      worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`)
   
      worksheet.columns = [
        { header:"Date of creation", key:"createdAt", width:30 },
            { header:"Title", key:"Title", width:30 },
            { header:"Description", key:"Description", width:50 },
            { header:"Project", key:"Project", width:30 },
          
        ];
        tasks.forEach((task) => {
            worksheet.addRow({
                Title: task.Title,
                Description: task.Description,
                Project: task.Project.Name,
                createdAt: task.createdAt
            });
        });
        workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        console.error("Error exporting tasks:", error);
        res.status(500).send("Internal Server Error");
    }
}
const exportTacheByProject = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const { startDate, endDate } = req.query;

        const tasks = await models.Tache.findAll({
            where: {
                ProjectId: ProjectId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                { model: models.Users, as: 'User', attributes: ['nom'] },
                { model: models.Project, as: 'Project', attributes: ['Name'] }
            ]
        });

        console.log("tasks:", tasks);

        if (tasks.length === 0) {
            return res.status(404).json({ error: "No tasks found for the given ProjectId and date range" });
        }
        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet(`Tasks for Project ${ProjectId}`);
        const projectName = tasks[0].Project ? tasks[0].Project.Name : 'Unknown Project';
        const dateRange = `Date From: ${startDate} to ${endDate}`;

        // Titre du fichier
        worksheet.addRow(["WindTime"]).font = { bold: true, color: { argb: 'FFFFFF' } };
        const titleRow = worksheet.addRow(["WindTime"]);
        titleRow.font = { bold: true, color: { argb: '1A9BC3' }, size: 40 };
        titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        titleRow.alignment = { horizontal: 'center' };
        worksheet.addRow([]);
        worksheet.addRow([]);
        const projectRow = worksheet.addRow([`Project: ${projectName}`]);
        projectRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
        projectRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        worksheet.mergeCells(`A${projectRow.number}:C${projectRow.number}`);
        const dateRangeRow = worksheet.addRow([dateRange]);
        dateRangeRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
        dateRangeRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };

        worksheet.addRow([]);
        worksheet.addRow([]);
        const headers = ["createdAt","Title", "Description", "Project", "User"];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: '080D50' }, size: 16 };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`);
        const header = [
             { header: "Date of creation", key: "createdAt", width: 30 },
            { header: "Title", key: "Title", width: 20 },
            { header: "Description", key: "Description", width: 60 },
            { header: "Project", key: "Project", width: 20 },
            { header: "User", key: "User", width: 20 },
           
        ];
        worksheet.columns = header;

        tasks.forEach((task) => {
            worksheet.addRow({
                Title: task.Title,
                Description: task.Description,
                Project: task.Project.Name,
                User: task.User.nom,
                createdAt: task.createdAt
            });
        });

        workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        console.error("Error exporting tasks by ProjectId:", error);
        res.status(500).send("Internal Server Error");
    }
}


const exportEmployeesByIds = async (req, res) => {
    const { employeeIds } = req.body;
    console.log('employeeIds:', employeeIds); 
    try {
        const employees = await models.Users.findAll({
            where: { id: employeeIds }
        })

        if (employees.length === 0) {
            return res.status(404).json({ error: "Aucun employé trouvé." });
        }

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet(`Employees`)
      
        // Titre du fichier
        worksheet.addRow(["WindTime"]).font = { bold: true,color: { argb: 'FFFFFF' },}
        const titleRow = worksheet.addRow(["WindTime"])
        titleRow.font = { bold: true, color: { argb: '1A9BC3' }, size: 40 };
        titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }}
        titleRow.alignment = { horizontal: 'center' }
        worksheet.addRow([]);
        worksheet.addRow([]); 
        const totalEmployeesRow = worksheet.addRow(["Total Employés",employees.length])
        totalEmployeesRow.font = { bold: true, color: { argb: '080D50' }, size: 16 } 
        totalEmployeesRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }}
    
        worksheet.addRow([])
        worksheet.addRow([])
        const titleRow2 = worksheet.addRow([" liste des employés "])
        titleRow2.font = { bold: true, color: { argb: '080D50' }, size: 15 };
        titleRow2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5A08C' }}
        
        const headers = ["Nom","prenom" ,"Email", "Domaine", "Numéro de téléphone", "Date de naissance", "adresse"]
        const headerRow = worksheet.addRow(headers)
        headerRow.font = { bold: true, color: { argb: '080D50' }, size: 16 };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`)
        worksheet.columns = [
            { header: "Nom", key: "nom", width: 20 },
            { header: "Prénom", key: "prenom", width: 20 },
            { header: "Email", key: "email", width: 40 },
            { header: "Domaine", key: "domaine", width: 20 },
            { header: "Numéro de téléphone", key: "numTel", width: 30 },
            { header: "Date de naissance", key: "dateNaissance", width: 30 },
            { header: "Adresse", key: "adresse", width: 20 }
        ]
        employees.forEach(employee => {
            worksheet.addRow({
                nom: employee.nom,
                email: employee.email,
                domaine: employee.Domaine,
                numTel: employee.numTel,
                dateNaissance: employee.dateNaissance,
                prenom: employee.prenom,
                adresse: employee.adresse
            });
        });
        worksheet.addRow([])

       

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Employees.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error('Error exporting employees:', error)
        res.status(500).json({ error: "Une erreur s'est produite lors de l'exportation des employés." });
    }
}



const exportTacheByProjectByUser = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const { UserId,startDate,endDate } = req.query; 

        const tasks = await models.Tache.findAll({
            where: { 
                ProjectId: ProjectId, 
                UserId: UserId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                { model: models.Users, as: 'User', attributes: ['nom'] },
                { model: models.Project, as: 'Project', attributes: ['Name'] }
            ]
        });

        if (tasks.length === 0) {
            return res.status(404).send("No tasks found for the specified criteria.");
        }

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet(`Tasks for Project ${ProjectId}`);
        worksheet.addRow(["WindTime"]).font = { bold: true,color: { argb: 'FFFFFF' }, };
        const projectName = tasks[0].Project ? tasks[0].Project.Name : 'Unknown Project';
        const userName = tasks[0].User.nom;
        const dateRange = `Date From: ${startDate} to ${endDate}`;
    

       
        const titleRow = worksheet.addRow(["WindTime"]);
        titleRow.font = { bold: true, color: { argb: '1A9BC3' }, size: 40 };
        titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        titleRow.alignment = { horizontal: 'center' };
        worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`);

        // Add project, user, and date range to worksheet with grey background
        const projectRow = worksheet.addRow([`Project: ${projectName}`]);
        projectRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
        projectRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        worksheet.mergeCells(`A${projectRow.number}:C${projectRow.number}`);
        const userRow = worksheet.addRow([`User: ${userName}`])
        userRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
        userRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };

        const dateRangeRow = worksheet.addRow([dateRange]);
        dateRangeRow.font = { bold: true, color: { argb: '080D50' }, size: 15 };
        dateRangeRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };

        worksheet.addRow([]); 
        worksheet.addRow([]); 
        const headers = ["Date","Title", "Description","Time spen"];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: '080D50' }, size: 16 }
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        const header = [
            { header: "Date", key: "createdAt", width: 20 },
            { header: "Title", key: "Title", width: 30 },
            { header: "Description", key: "Description", width: 60 },
            { header: "Time spen", key: "HoursNumber", width: 20 }
        ];
        worksheet.columns = header;
        let totalHours = 0;
        tasks.forEach((task) => {
            worksheet.addRow({
                Title: task.Title,
                Description: task.Description,
                createdAt: task.createdAt,
                HoursNumber:task.HoursNumber
            })
            totalHours += task.HoursNumber;
        })
        worksheet.addRow([]); 
        const totalHoursRow = worksheet.addRow(['Total Hours', '', '', totalHours]);
        totalHoursRow.font = { bold: true, color: { argb: '080D50' }, size: 16 };
        totalHoursRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Tasks_Project_${ProjectId}_User_${UserId}.xlsx`
        )
await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error("Error exporting tasks by ProjectId:", error);
        res.status(500).send("Internal Server Error");
    }
}


module.exports ={
    exportTache,
    exportEmployeesByIds,
    exportTacheByProject,
    exportTacheByProjectByUser,
    exportAllTache
};