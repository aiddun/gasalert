network = "https://api.anyblock.tools/ethereum/ethereum/mainnet/es/";

const { Client } = require("@elastic/elasticsearch");

const api_key = "a0c17c4f-f752-475a-84fb-f95bce4573c1";
// process.env.ANYBLOCK_KEY
const client = new Client({
  node: network,
  auth: {
    username: "aiddun@gmail.com",
    password: api_key,
  },
  timeout: 180,
});

const search = async () => {
  const result = await client.search({
    index: "tx",
    doc_type: "tx",
    search_type: "scan",
    body: {
      _source: ["timestamp", "gasPrice.num"],
      query: {
        bool: {
          must: [
            {
              range: {
                timestamp: {
                  gte: "now-1w",
                },
              },
            },
          ],
        },
      },
      aggs: {
        hour_bucket: {
          date_histogram: {
            field: "timestamp",
            interval: "1h",
            format: "yyyy-MM-dd hh:mm:ss",
          },
          aggs: {
            avgGasDay: {
              avg: {
                field: "gasPrice.num",
              },
            },
            percentilesDay: {
              percentiles: {
                field: "gasPrice.num",
                percents: [35, 50, 60, 90, 100],
              },
            },
          },
        },
      },
    },

    size: 0,
  });

};

search();
