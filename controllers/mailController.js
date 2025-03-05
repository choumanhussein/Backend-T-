const { transporter, ADMIN_EMAIL } = require("../config/emailConfig");

exports.sendEmail = (req, res) => {
  const { nom, email, message } = req.body;

  const adminMailOptions = {
    from: email,
    to: ADMIN_EMAIL,
    subject: "Nouveau message du formulaire de contact",
    text: `Nom: ${nom}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email
  };

  const autoReplyMailOptions = {
    from: ADMIN_EMAIL,
    to: email,
    subject: "Confirmation de réception de votre message",
    text: `Bonjour ${nom},\n\nJe vous remercie d'avoir pris contact avec moi. Votre message a bien été reçu.\n\nCordialement,\nMarc Lawrence`
  };

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error("Erreur admin email:", error);
      return res.status(500).json({ message: "Erreur lors de l'envoi à l'administrateur" });
    }
    
    transporter.sendMail(autoReplyMailOptions, (error, info) => {
      if (error) {
        console.error("Erreur réponse auto:", error);
        return res.status(500).json({ message: "Erreur réponse automatique" });
      }
      res.status(200).json({ message: "Formulaire soumis avec succès" });
    });
  });
};

exports.welcomeMessage = (req, res) => {
  res.send("Bienvenue sur l'API");
};