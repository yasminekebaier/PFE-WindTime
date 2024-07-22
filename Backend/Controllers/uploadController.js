const { models } = require("../models/index")
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images'); // Le dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+ path.extname(file.originalname)); // Utiliser le nom original du fichier
    }
});

const upload = multer({ storage: storage,
limits:{fileSize:'10000000'},
fileFilter:(req,file,cb)=>{
    const fileTypes=/jpeg|jpg|png|gif/
    

} }).single('image');

const uploadController = {
    uploadProfil: async (req, res, next) => {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
                }

                const imageUrl = req.file.path;
                console.log('Chemin de l\'image téléchargée:', imageUrl)

                const user = await models.Users.findByPk(req.body.userId)
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" })
                }
                user.picture = imageUrl
                await user.save()

                res.json({ imageUrl })
            })
        } catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
            res.status(500).send('Erreur lors de l\'upload de l\'image');
        }
    }
};


module.exports = uploadController;
