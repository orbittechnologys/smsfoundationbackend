import nodemailer from 'nodemailer';
export function convertMinutesToHours(minutes) {
    // Calculate hours by dividing minutes by 60
    let hours = minutes / 60;
    // Return the result
    console.log(hours.toFixed(3)," returning hour conversion of ",minutes)
    return hours.toFixed(3); // Round to 3 decimal place
}

export function getPercentage(num,denom){
    if (denom === 0) {
        return 0; // Avoid division by zero
      }
      const percentage = (num / denom) * 100;
      return Math.round(percentage * 100) / 100;
}

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "servicedesk@orbittechnologys.com",
      pass: "364133Rrock.!",
    },
  });
  
  export const sendEmail = async (to, subject, text) => {
    try {
      await transporter.sendMail({
        from: "servicedesk@orbittechnologys.com",
        to,
        subject,
        text,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };

  export const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };
  