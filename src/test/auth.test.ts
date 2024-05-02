const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJDbGludG9uIiwibGFzdG5hbWUiOiJFeWl0dW95byIsImVtYWlsIjoiY2xpbnRvbmV5aXR1b3lvQGdtYWlsLmNvbSIsInVzZXJfaWQiOiI2NjMzOTliNDcxZWRmZjU0YzhhYzRkODYiLCJpYXQiOjE3MTQ2ODE1MTgsImV4cCI6MTcxNDc2NzkxOH0.44OrotWf8WzeU3HvTt3jrgcnS5450G5mQgCaB3Tta00";

const axios = require("axios");

const url = "http://127.0.0.1:3000/api";
const contactID = "663403fca662dacdc0297111";

describe("Validation", () => {
  test("Username (email) validation fail", async () => {
    try {
      await axios.post(`${url}/auths/login`, {
        username: "jane",
        password: "Jane123",
      });
    } catch (error) {
      const message = error.response.data.message;

      expect(message).toEqual("email is invalid");
    }
  });

  test("Password validation fail", async () => {
    try {
      await axios.post(`${url}/auths/login`, {
        username: "jane@email.com",
        password: "Jan",
      });
    } catch (error) {
      const message = error.response.data.message;

      expect(message).toEqual("password is invalid");
    }
  });
  test("Create a contact", async () => {
    try {
      await axios.post(
        `${url}/users/contact`,
        {
          firstname: "Uyiri",
          lastname: "Tuoyo",
          mobile: "07061967250",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
        { timeout: 10000 }
      );
    } catch (error) {
      const message = error.response.data.message;

      expect(message).toEqual("Contact created");
    }
  });
  test("Check for an existing contact", async () => {
    try {
      await axios.post(
        `${url}/users/contact`,
        {
          firstname: "Emiko",
          lastname: "Tuoyo",
          mobile: "07061967265",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      const message = error.response.data.message;

      expect(message).toEqual("Contact available already");
    }
  });
  test("edit a contact contact", async () => {
    try {
      await axios.patch(
        `${url}/users/contact/${contactID}`,
        {
          firstname: "Emiko",
          lastname: "Tuoyo",
          mobile: "07061967265",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      const message = error.response.data.message;

      expect(message).toEqual("Contact available already");
    }
  });
});
