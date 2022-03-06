const dotenv = require("dotenv");
const convert = require("xml-js");
const axios = require("axios");
const util = require("util");
const { createXMLBalance, createXMLRewards } = require("./xmlFactory");

/**
 * XML to JSON to JavaScript Object Conversion.
 * @returns response Object
 */
const xmlToJsonToObject = (response) => {
  return JSON.parse(
    convert.xml2json(response.data, {
      compact: true,
      spaces: 2,
      ignoreDeclaration: true,
      ignoreAttributes: true,
    })
  );
};

/**
 * Test if is XML?
 * @param {string} str
 * @returns boolean
 */
const IsXML = (str) => {
  try {
    convert.xml2json(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Perform the API Call
 * @param {string} msisdn
 * @returns
 */
const apiCall = async (apiType, msisdn) => {
  let routeName;
  switch (apiType) {
    case "balance":
      routeName = "balance";
      break;

    case "play":
      routeName = "play";
      break;

    case "wallet":
      routeName = "wallet";
      break;

    case "rewards":
      routeName = "rewards";
      break;

    default:
      break;
  }

  // create the XML payload.
  var data = await createXMLBalance(msisdn);

  // setup the api config.
  var config = {
    method: "post",
    url: `${process.env.API_HOST}/v1/${routeName}`,
    headers: {
      "Content-Type": "application/xml",
    },
    auth: {
      username: process.env.API_USER_NAME,
      password: process.env.API_PASSWORD,
    },
    data: data,
  };

  let reponseData;
  let reloadStatus;
  let errorResponse;
  let errorObject = new Object();
  let errorObj = new Object();
  let errorString;
  let statusCode;

  try {
    const response = await axios(config);
    statusCode = response.status;
    const responseObject = xmlToJsonToObject(response);
    console.log(responseObject);
    reponseData = responseObject;
    success = true;
    reloadStatus = false;
    //balance = Number(responseObject.BalanceRespone.Balance.LineItems.LineItem.BalanceElement.BalanceSpecifications.Specification.balance._text);
  } catch (error) {
    console.log("TARGETERROR", error.response.data);
    console.log("TARGETERRORSTATUS", error.response.status);
    statusCode = error.response.status;
    reloadStatus = true;

    /**
     * 500 errors
     * Description: This spesific API randomly returns a string message or xml document.
     * */
    if (error.response.status === 500) {
      // Test for XML
      let isXMLRes = IsXML(error.response.data);
      console.log("IsXML", isXMLRes);

      if (isXMLRes) {
        errorObject = convert.xml2json(error.response.data, {
          compact: true,
          spaces: 2,
          ignoreDeclaration: true,
          ignoreAttributes: true,
        });
        errorResponse = JSON.parse(errorObject);
        errorObj =
          errorResponse.ErrorResponse.Error.LineItems.LineItem.ErrorElement
            .Error;
        console.log("errorResponse OBJ ::", errorObject);
        statusCode = 999;
        reloadStatus = false;
      } else {
        errorString = error.response.data;
        errorStringCode = "999";
        console.log("errorResponse TXT ::", errorResponse);
        statusCode = 999;
        reloadStatus = false;
      }
    }

    /**
     *  Forcing another API call if the below is not detected.
     */
    let errorMessage =
      errorObj && errorObj.code ? errorObj.message._text : errorString;

    if (errorMessage !== "msisdn does not match pattern /^0[0-9]{9}$/")
      reloadStatus = true;
  }

  const obj = {
    reloadStatus: reloadStatus,
    error: {
      statusCode: statusCode,
      data: {
        message:
          errorObj && errorObj.code ? errorObj.message._text : errorString,
      },
      // statusCode:
      //   errorObj && errorObj.code ? errorObj.code._text : errorStringCode,
    },
    success: {
      statusCode: statusCode,
      data: reponseData ? reponseData : "",
    },
  };

  return obj;
};

/**
 * Performce the XML API connection.
 * @param {string} apiType - what type source?
 * @param {*} msisdn - customer ID
 * @returns
 */
exports.fetchXMLData = async (apiType, msisdn) => {
  let data = false;
  // Force a continues loop on 500 Server Errors to satisfied
  // the need to return data on a problematic api.
  while (!data) {
    const response = await apiCall(apiType, msisdn);
    // Test reload status.
    if (!response.reloadStatus) {
      data = response.success.data ? response.success : response.error;
    }
  }

  // Development: Print the final data to terminal.
  if (process.env.NODE_ENV === "development")
    console.log(
      "FINAL DATA",
      util.inspect(data, { colors: true, depth: Infinity })
    );

  return data;
};
