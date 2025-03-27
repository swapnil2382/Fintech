const nodemailer = require("nodemailer");

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-app-password", // Replace with your app-specific password
  },
});

// Function to send an email notification
const sendNotification = async (userEmail, transaction) => {
  try {
    const mailOptions = {
      from: "your-email@gmail.com",
      to: userEmail,
      subject: "Suspicious Transaction Alert",
      text: `Dear User,\n\nWe detected a potentially suspicious transaction:\n- Description: ${
        transaction.description
      }\n- Amount: ₹${transaction.amount.toFixed(2)}\n- Date: ${new Date(
        transaction.date
      ).toLocaleDateString()}\n\nPlease review this transaction in your account. If this was not you, contact support immediately.\n\nBest,\nYour Finance App Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendNotification };
