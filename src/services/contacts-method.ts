import express from "express";
import helpers from "../utils/helpers";
import validator from "validator";
import { contactModel } from "../models/contact";
import { fileConfig } from "../utils/file-config";
import { PrivateMethodProps } from "../types/Types";
import { mongoose } from "../models/db-connector";

export default class contactMethod {
  //create new contact method
  static async createContact({ req, res, userData }: PrivateMethodProps) {
    //collect all the required parameters
    let firstname: string = req.body.firstname;
    let lastname: string = req.body.lastname;
    let mobile: string = req.body.mobile;
    //if the firstname is provided
    if (!firstname || !lastname) {
      return helpers.outputError(
        res,
        null,
        !firstname ? "firstname is required" : "lastname is required"
      );
    }
    //check the length of firstname and lastname
    if (firstname.length < 2 || lastname.length < 2) {
      return helpers.outputError(
        res,
        null,
        firstname.length < 2
          ? "firstname is too short"
          : "lastname is too short"
      );
    }
    //test if firstname is alphabet
    if (!/^[a-z\-]+$/i.test(firstname)) {
      return helpers.outputError(
        res,
        null,
        "Special character is not allowed in the firstname"
      );
    }
    //test if last is alphabet
    if (!/^[a-z\-]+$/i.test(lastname)) {
      return helpers.outputError(
        res,
        null,
        "Special character is not allowed in the lastname"
      );
    }
    //check if mobile number is provided
    if (!mobile) {
      return helpers.outputError(res, null, "mobile is required");
    }
    //check if mobile number is numeric
    if (!validator.isNumeric(mobile)) {
      return helpers.outputError(res, null, "mobile is invalid");
    }
    //check the length of the mobile number provided
    if (mobile.length < 10 || mobile.length > 13) {
      return helpers.outputError(res, null, "mobile is invalid");
    }
    //check if userid and mobile exist before on our database
    let checkContact: any = await contactModel
      .findOne({ user_id: userData.user_id, mobile: mobile }, null, {
        lean: true,
      })
      .catch((e) => ({ error: e }));
    //check if there is error in our query
    if (checkContact && checkContact.error) {
      return helpers.outputError(res, 500);
    }
    //if our contact exist using the provided mobile
    if (checkContact) {
      return helpers.outputError(res, null, "Contact available already");
    }
    //create the new contact
    let createContact: any = await contactModel
      .create({
        user_id: userData.user_id,
        firstname,
        lastname,
        mobile,
      })
      .catch((e) => ({ error: e }));
    //check for query error
    if (createContact && createContact.error) {
      console.log(createContact.error);
      return helpers.outputError(res, 500);
    }
    //if the contact did not submit
    if (!createContact) {
      return helpers.outputError(
        res,
        null,
        "Sorry we cannot create this contact at this moment"
      );
    }

    createContact = createContact.toObject();
    createContact.contact_id = createContact._id;
    delete createContact.password;
    delete createContact.__v;
    delete createContact._id;

    return helpers.outputSuccess(res, createContact);
  }

  //function to update a contact using the contact id
  static async updateContact({ req, res, userData, id }: PrivateMethodProps) {
    let firstname: string = req.body.firstname;
    let lastname: string = req.body.lastname;
    let mobile: string = req.body.mobile;
    //build our database query
    let queryBuilder: Record<string, any> = {
      user_id: new mongoose.Types.ObjectId(userData.user_id),
      _id: new mongoose.Types.ObjectId(id),
    };

    //if the firstname is provided
    if (firstname) {
      //validated the firstname
      if (firstname.length < 2) {
        return helpers.outputError(
          res,
          null,
          firstname.length < 2
            ? "firstname is too short"
            : "lastname is too short"
        );
      }
      //add firstname to our query

      queryBuilder.firstname = firstname;
    }
    //check if lastname is provided
    if (lastname) {
      //validate lastname
      if (lastname.length < 2) {
        return helpers.outputError(
          res,
          null,
          firstname.length < 2
            ? "firstname is too short"
            : "lastname is too short"
        );
      }
      //   add lastname to the query
      queryBuilder.lastname = lastname;
    }
    //check if mobile number is provided
    if (mobile) {
      //validate the mobile number
      if (!validator.isNumeric(mobile)) {
        return helpers.outputError(res, null, "mobile is invalid");
      }
      if (mobile.length < 10 || mobile.length > 13) {
        return helpers.outputError(res, null, "mobile is invalid");
      }
      //add mobile number to the query
      queryBuilder.mobile = mobile;
    }
    //check using userid and contact id if the data exist before
    let checkContact: any = await contactModel
      .findOne({ user_id: userData.user_id, _id: id }, null, {
        lean: true,
      })
      .catch((e) => ({ error: e }));
    //check if there is query error
    if (checkContact && checkContact.error) {
      return helpers.outputError(res, 500);
    }
    //return back error if the data does not exist
    if (!checkContact) {
      return helpers.outputError(res, null, "Contact does not exist");
    }
    if (mobile) {
      //so that we do not update the mobile number to an existing mobile number
      //we check also with the provided mobile number and make a comparism with the return data and the id owe are trying to update
      let checkContactMobile: any = await contactModel
        .findOne({ user_id: userData.user_id, mobile: mobile }, null, {
          lean: true,
        })
        .catch((e) => ({ error: e }));
      //check if there is query error
      if (checkContactMobile && checkContactMobile.error) {
        return helpers.outputError(res, 500);
      }
      //comparing the 2 ids
      if (checkContactMobile && id !== String(checkContactMobile._id)) {
        return helpers.outputError(res, null, "Contact already exist");
      }
    }
    //update the contact
    let updateContact: any = await contactModel
      .findByIdAndUpdate(id, queryBuilder, { new: true, lean: true })
      .catch((e) => ({ error: e }));
    //check for query error
    if (updateContact && updateContact.error) {
      console.log(updateContact.error);
      return helpers.outputError(res, 500);
    }
    //check it the contact was updated or not
    if (!updateContact) {
      return helpers.outputError(
        res,
        null,
        "Sorry we cannot update this contact at this moment"
      );
    }

    updateContact.contact_id = updateContact._id;
    delete updateContact.__v;
    delete updateContact._id;

    return helpers.outputSuccess(res, updateContact);
  }

  //function to fetch all all and single contact
  static async getContact({ req, res, userData, id }: PrivateMethodProps) {
    //itemperpage is the number of items that will be fetched at once
    let itemPerPage = parseInt((req.query.item_per_page as string) || "0");
    //this is the page
    let page = parseInt((req.query.page as string) || "0");
    //our query builder having a default user id
    let queryBuilder: Record<string, any> = {
      user_id: new mongoose.Types.ObjectId(userData.user_id),
    };
    //adding id to the query builder
    if (id) {
      queryBuilder._id = new mongoose.Types.ObjectId(id);
    }
    //if item per page
    if (itemPerPage) {
      //if the value is not a number
      if (!/^\d+$/.test(String(itemPerPage))) {
        return helpers.outputError(res, null, "Item per page expect a number");
      }
      //if the dataset is greater than 200, set to 50
      if (itemPerPage > 200) {
        itemPerPage = 50;
      }
    } else {
      itemPerPage = 50;
    }

    //if item per page
    if (page) {
      //if the value is not a number
      if (!/^\d+$/.test(String(page))) {
        return helpers.outputError(res, null, "Page expect a number");
      }
      //check the item perpage if present
      if (page < 1) {
        return helpers.outputError(res, null, "Invalid page number");
      }
    }

    //start index
    let startIndex = page ? (page - 1) * itemPerPage : 0;
    //fetch data
    let contactData: any = await contactModel
      .aggregate([
        { $match: queryBuilder },
        { $sort: { _id: -1 } },
        { $skip: startIndex },
        { $limit: itemPerPage },
        { $addFields: { contact_id: "$_id" } },
        { $unset: ["_id", "__v"] },
      ])
      .catch((e) => ({ error: e }));

    if (contactData && contactData.error) {
      return helpers.outputError(res, 500);
    }
    return helpers.outputSuccess(res, contactData);
  }

  // function to delete a contact
  static async deleteContact({ req, res, userData, id }: PrivateMethodProps) {
    //delete the contact
    let deleteContact: any = await contactModel
      .findByIdAndDelete({ _id: id, user_id: userData.user_id })
      .catch((e) => ({ error: e }));
    //check for query error
    if (deleteContact && deleteContact.error) {
      console.log(deleteContact.error);
      return helpers.outputError(res, 500);
    }
    //check if the contact was deleted
    if (!deleteContact) {
      return helpers.outputError(res, null, "Contact not found");
    }

    return helpers.outputSuccess(res, "Contact deleted");
  }
}
