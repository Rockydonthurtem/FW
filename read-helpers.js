const { parse } = require("csv-parse");
const fs = require("fs").promises;
const _ = require("lodash");
const util = require("util");

const parsePromise = util.promisify(parse);

// Passed to csv.parse to correct type of booleans
const cast = (v) => {
  if (v === "TRUE") return true;
  if (v === "FALSE") return false;
  return v;
};

/**
 * Read charities from a file and parses into objects.
 * @returns array of charity objects
 */
async function readCharities(charities) {
  const charitiesBuffer = await fs.readFile(charities);
  return parsePromise(charitiesBuffer, { columns: true });
}

/**
 * Read profile from a 1-entry csv at `charities`.
 * @returns profile object
 */
async function readProfile(charities) {
  const profileBuffer = await fs.readFile(charities);
  return (await parsePromise(profileBuffer, { columns: true, cast }))[0];
}

module.exports = { readCharities, readProfile };