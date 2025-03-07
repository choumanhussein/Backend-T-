const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const nodemailer = require("nodemailer")
require("dotenv").config()

const app = express()

const corsOptions = {
  origin: "https://marclawrence.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions)) 

app.use(bodyParser.json())

// Route pour afficher "Bienvenue sur l'API"
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API")
})

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "marclawrence851@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "ilkt hvci lixp dneb"
  }
})

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "marclawrence851@gmail.com"

// Define the router
const router = express.Router()

router.post("/", (req, res) => {
  const { nom, email, message } = req.body

  const adminMailOptions = {
    from: email,
    to: ADMIN_EMAIL,
    subject: "Nouveau message du formulaire de contact",
    text: `
      Nom: ${nom}
      Email: ${email}
      Message: ${message}
    `,
    replyTo: email
  }

  const autoReplyMailOptions = {
    from: ADMIN_EMAIL,
    to: email,
    subject: "Confirmation de réception de votre message",
    text: `
      Bonjour ${nom},

      Je vous remercie d'avoir pris contact avec moi. Votre message a bien été reçu et je vous en remercie.

      J'étudie votre demande et vous recontacte au plus vite.

      Cordialement,
      Marc Lawrence
    `
  }

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail à l'administrateur:",
        error
      )
      return res.status(500).json({
        message: "Erreur lors de l'envoi de l'e-mail à l'administrateur"
      })
    }
    console.log("E-mail envoyé à l'administrateur:", info.response)

    transporter.sendMail(autoReplyMailOptions, (error, info) => {
      if (error) {
        console.error(
          "Erreur lors de l'envoi de l'e-mail de réponse automatique:",
          error
        )
        return res.status(500).json({
          message: "Erreur lors de l'envoi de l'e-mail de réponse automatique"
        })
      }
      console.log(
        "E-mail de réponse automatique envoyé à l'utilisateur:",
        info.response
      )
      res.status(200).json({ message: "Formulaire soumis avec succès" })
    })
  })
})

app.use("/mail-sender", router)

// ===== GESTION DES ERREURS =====

// Middleware pour les routes non trouvées (404)
app.use((req, res, next) => {
  // Pour les API, renvoyer un statut 404 avec un message JSON
  if (req.path.startsWith('/api/') || req.path.startsWith('/mail-sender/')) {
    return res.status(404).json({
      error: "Not Found",
      message: "La ressource demandée n'existe pas"
    });
  }
  
  // Pour les autres routes (si vous servez également le front-end)
  // Rediriger vers la route /404 du front-end
  res.status(404).redirect('https://marclawrence.vercel.app/404');
});

// Middleware de gestion des erreurs (500)
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  
  // Pour les API, renvoyer un statut 500 avec un message JSON
  if (req.path.startsWith('/api/') || req.path.startsWith('/mail-sender/')) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Une erreur interne s'est produite"
    });
  }
  
  // Pour les autres routes (si vous servez également le front-end)
  // Rediriger vers la route /500 du front-end
  res.status(500).redirect('https://marclawrence.vercel.app/500');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

module.exports = app