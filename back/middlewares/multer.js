import multer from "multer";
import path from "path";

// Taille maximale autorisée pour les fichiers (5 Mo)
const maxSize = 5242880;

// Configuration du moteur de stockage pour multer
const storageEngine = multer.diskStorage({
  // Répertoire de destination des fichiers téléchargés
  destination: "./public/assets/img",
  // Nommage du fichier téléchargé (ajout d'un horodatage pour éviter les doublons)
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.split(" ").join("_")}`);
  },
});

// Configuration de multer avec les options de stockage, de taille et de filtre de fichier
const upload = multer({
  storage: storageEngine, // Utilisation du moteur de stockage défini
  limits: {
    fileSize: maxSize, // Limite de taille du fichier
  },
  fileFilter: (req, file, cb) => {
    // Appel à la fonction de vérification du type de fichier
    checkFileType(file, cb);
  },
});

/**
 * Vérifie le type de fichier autorisé
 * @param {*} file - Le fichier à vérifier
 * @param {*} cb - Callback pour indiquer si le type est valide ou non
 * @returns
 */
const checkFileType = (file, cb) => {
  // Types de fichiers autorisés (extensions)
  const fileTypes = /jpg|png|jpeg|gif|webp|svg/;

  // Vérification de l'extension du fichier et de son type MIME
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  // Si l'extension et le type MIME correspondent à ceux autorisés, le fichier est valide
  if (extName && mimeType) {
    return cb(null, true);
  } else {
    // Sinon, on signale une erreur indiquant que le format de fichier n'est pas pris en charge
    cb("Format de fichier non supporté");
  }
};

// Exporter le middleware multer configuré
export default upload;