const builder = require("xmlbuilder");

/**
 * Create the XML payload: Balance
 * @param {string} msisdn
 * @returns
 * @version 1.00
 */
exports.createXMLBalance = (msisdn) => {
    const feedObj = {
      BalanceRequest: {
        Balance: {
          LineItems: {
            LineItem: {
              BalanceElement: {
                CustomerProduct: {
                  Ids: {
                    accountId: { "@schemeAgencyName": "ACME", "#text": "R" },
                  },
                  "cmn:Name": { "#text": "AN" },
                },
                Specifications: {
                  Specification: {
                    msisdn: { "#text": msisdn },
                  },
                },
              },
            },
          },
        },
      },
    };
  
    // build the xml document
    const feed = builder
      .create(feedObj, { encoding: "ISO-8859-1" })
      .end({ pretty: true });
    //console.log(feed);
    return feed;
  };



/**
 * Create the XML payload: Wallet
 * @param {string} msisdn
 * @returns
 * @version 1.00
 */
exports.createXMLWallet = (msisdn) => {
  const feedObj = {
    WalletRequest: {
      Wallet: {
        LineItems: {
          LineItem: {
            WalletElement: {
              CustomerProduct: {
                "@actionCode": "Wallet",
                Ids: {
                  accountId: { "@schemeAgencyName": "ACME", "#text": "R" },
                },
                "cmn:Name": { "#text": "AN" },
              },
              Specifications: {
                Specification: {
                  msisdn: { "#text": msisdn },
                },
              },
            },
          },
        },
      },
    },
  };

  // build the xml document
  const feed = builder
    .create(feedObj, { encoding: "ISO-8859-1" })
    .end({ pretty: true });
  //console.log(feed);
  return feed;
};

/**
 * Create the XML payload: Game
 * @param {string} msisdn
 * @returns
 * @version 1.00
 */
exports.createXMLGame = (msisdn) => {
  const feedObj = {
    PlayRequest: {
        Play: {
        LineItems: {
          LineItem: {
            PlayElement: {
              CustomerProduct: {
                "@actionCode": "PLAY",
                Ids: {
                  accountId: { "@schemeAgencyName": "ACME", "#text": "U" },
                },
                "name": { "#text": "AN" },
              },
              Specifications: {
                Specification: {
                  msisdn: { "#text": msisdn },
                },
              },
            },
          },
        },
      },
    },
  };

  // build the xml document
  const feed = builder
    .create(feedObj, { encoding: "ISO-8859-1" })
    .end({ pretty: true });
  //console.log(feed);
  return feed;
};


/**
 * Create the XML payload: Rewards
 * @param {string} msisdn
 * @returns
 * @version 1.00
 */
 exports.createXMLRewards = (msisdn) => {
    const feedObj = {
        RewardsRequest: {
            Rewards: {
          LineItems: {
            LineItem: {
                RewardsElement: {
                CustomerProduct: {
                  "@actionCode": "Rewards",
                  Ids: {
                    accountId: { "@schemeAgencyName": "ACME", "#text": "R" },
                  },
                  "cmn:Name": { "#text": "AN" },
                },
                Specifications: {
                  Specification: {
                    msisdn: { "#text": msisdn },
                  },
                },
              },
            },
          },
        },
      },
    };
  
    // build the xml document
    const feed = builder
      .create(feedObj, { encoding: "ISO-8859-1" })
      .end({ pretty: true });
    //console.log(feed);
    return feed;
  };
