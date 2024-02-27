const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");
require("dotenv").config();


const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

let sleep = (ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(`waiting ${ms / 1000} sec..`);
      resolve();
    }, ms);
  });
};

async function sendMail(req, res) {
  try {
    const emailLines = [
      `From: ${process.env.GMAIL_ACCOUNT}`,
      `To: ${process.env.GMAIL_ACCOUNT}`,
      "Content-type: text/html;charset=iso-8859-1",
      "MIME-Version: 1.0",
      "Subject: Test Subject",
      "",
      "<p>Heyy,</p><p>I was actually looking for a lost email in my spam folder until I came across your email.</p><p>I'd love to learn more. Do you offer bulk orders as well?</p><p>Also, why don't you warm up your email domain so your next emails don't go to spam?</p><p>I know for our company they use <a href='https://automatedemailwarmup.com/'>automated email warmup</a> to escape spam.</p>",
      "",
    ];

    const email = emailLines.join("\r\n").trim();
    const base64Email = Buffer.from(email).toString("base64");
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64Email,
      },
    });
    // const accessToken = await oAuth2Client.getAccessToken();
    // const transport = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     ...CONSTANTS.auth,
    //     accessToken: accessToken,
    //   },
    // });
    // const mailOptions = {
    //   ...CONSTANTS.mailoptions,
    //   text: "HI , ur mail wnet into spamm",
    // };
    // const result = await transport.sendMail(mailOptions);
    res.send("Mail Sent!!");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function sendMailToUsers(messages) {
  try {
    // messages.forEach(async (message) => {
    //   const data = await readMail(message?.id);
    //   if (
    //     data?.payload?.headers?.filter((message) => message.name === "From")[0]
    //       ?.value !== "mprocess.env.GMAIL_ACCOUNT"
    //   ) {
    //     const emailLines = [
    //       "From: process.env.GMAIL_ACCOUNT",
    //       `To: ${
    //         data?.payload?.headers?.filter(
    //           (message) => message.name === "From"
    //         )[0]?.value
    //       }`,
    //       "Content-type: text/html;charset=iso-8859-1",
    //       "MIME-Version: 1.0",
    //       `Subject:  ${
    //         data?.payload?.headers?.filter(
    //           (message) => message.name === "Subject"
    //         )[0]?.value
    //       }`,
    //       `In-Reply-To: ${
    //         data?.payload?.headers?.filter(
    //           (message) => message.name === "Message-Id"
    //         )[0]?.value
    //       }`,
    //       `References: ${
    //         data?.payload?.headers?.filter(
    //           (message) => message.name === "References"
    //         )[0]?.value
    //       }`,
    //       `Message-Id: ${
    //         data?.payload?.headers?.filter(
    //           (message) => message.name === "Message-Id"
    //         )[0]?.value
    //       }`,
    //       "",
    //       "Hey, all going good? Just got your message",
    //     ];
    //     const email = emailLines.join("\r\n").trim();
    //     const base64Email = Buffer.from(email).toString("base64");
    //     setTimeout(async () => {
    //       await gmail.users.messages.send({
    //         userId: "me",
    //         requestBody: {
    //           raw: base64Email,
    //           threadId: message?.threadId,
    //           payload: {
    //             headers: [
    //               {
    //                 name: "Subject",
    //                 value: `${
    //                   data?.payload?.headers?.filter(
    //                     (message) => message.name === "Subject"
    //                   )[0]?.value
    //                 }`,
    //               },
    //               {
    //                 name: "In-Reply-To",
    //                 value: `${
    //                   data?.payload?.headers?.filter(
    //                     (message) => message.name === "Message-Id"
    //                   )[0]?.value
    //                 }`,
    //               },
    //               {
    //                 name: "References",
    //                 value: `${
    //                   data?.payload?.headers?.filter(
    //                     (message) => message.name === "References"
    //                   )[0]?.value
    //                 }`,
    //               },
    //               {
    //                 name: "Message-ID", // This is the same for both users, as you were asking about.
    //                 value: `${
    //                   data?.payload?.headers?.filter(
    //                     (message) => message.name === "Message-Id"
    //                   )[0]?.value
    //                 }`,
    //               },
    //             ],
    //           },
    //         },
    //       });
    //       console.log("Mail Sent!!");
    //     }, 10000);
    //   }
    // });
    for (i = 0; i < messages.length; i++) {
      let message = messages[i];
      const data = await readMail(message?.id);
      if (
        data?.payload?.headers?.filter((message) => message.name === "From")[0]
          ?.value !== process.env.GMAIL_ACCOUNT
      ) {
        const emailLines = [
          "From: process.env.GMAIL_ACCOUNT",
          `To: ${
            data?.payload?.headers?.filter(
              (message) => message.name === "From"
            )[0]?.value
          }`,
          "Content-type: text/html;charset=iso-8859-1",
          "MIME-Version: 1.0",
          `Subject:  ${
            data?.payload?.headers?.filter(
              (message) => message.name === "Subject"
            )[0]?.value
          }`,
          `In-Reply-To: ${
            data?.payload?.headers?.filter(
              (message) => message.name === "Message-Id"
            )[0]?.value
          }`,
          `References: ${
            data?.payload?.headers?.filter(
              (message) => message.name === "References"
            )[0]?.value
          }`,
          `Message-Id: ${
            data?.payload?.headers?.filter(
              (message) => message.name === "Message-Id"
            )[0]?.value
          }`,
          "",
          "<p>Heyy,</p><p>I was actually looking for a lost email in my spam folder until I came across your email.</p><p>I'd love to learn more. Do you offer bulk orders as well?</p><p>Also, why don't you warm up your email domain so your next emails don't go to spam?</p><p>I know for our company they use <a href='https://automatedemailwarmup.com/'>automated email warmup</a> to escape spam.</p>",
        ];
        const email = emailLines.join("\r\n").trim();
        const base64Email = Buffer.from(email).toString("base64");
        setTimeout(async () => {
          await gmail.users.messages.send({
            userId: "me",
            requestBody: {
              raw: base64Email,
              threadId: message?.threadId,
              payload: {
                headers: [
                  {
                    name: "Subject",
                    value: `${
                      data?.payload?.headers?.filter(
                        (message) => message.name === "Subject"
                      )[0]?.value
                    }`,
                  },
                  {
                    name: "In-Reply-To",
                    value: `${
                      data?.payload?.headers?.filter(
                        (message) => message.name === "Message-Id"
                      )[0]?.value
                    }`,
                  },
                  {
                    name: "References",
                    value: `${
                      data?.payload?.headers?.filter(
                        (message) => message.name === "References"
                      )[0]?.value
                    }`,
                  },
                  {
                    name: "Message-ID", // This is the same for both users, as you were asking about.
                    value: `${
                      data?.payload?.headers?.filter(
                        (message) => message.name === "Message-Id"
                      )[0]?.value
                    }`,
                  },
                ],
              },
            },
          });
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            removeLabelIds: ["UNREAD"],
          });
          console.log("Mail Sent!!");
        }, parseInt(`${i}1000`));
      }
    }
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
}

async function getUser(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getDrafts(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getSpamDetails(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels/SPAM`;
    const url1 = `https://gmail.googleapis.com/gmail/v1/users/me/labels/INBOX`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const config1 = generateConfig(url1, token);
    const responseSpam = await axios(config);
    const responseInbox = await axios(config1);
    res.json({
      spam: responseSpam?.data,
      inbox: responseInbox?.data,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getMessages(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${process.env.GMAIL_ACCOUNT}/messages?labelIds=SPAM&labelIds=UNREAD`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    await sendMailToUsers(response.data.messages);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return error;
  }
}

async function searchMail(req, res) {
  try {
    const url = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${req.params.search}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function readMail(messageId) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${process.env.GMAIL_ACCOUNT}/messages/${messageId}?format=metadata&metadataHeaders=Subject&metadataHeaders=References&metadataHeaders=Message-ID&metadataHeaders=FROM&metadataHeaders=In-Reply-To`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    let data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  getMessages,
  getSpamDetails,
  searchMail,
  readMail,
};
