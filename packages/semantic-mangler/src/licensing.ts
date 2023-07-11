import fs from 'fs/promises'

const licenses = {
  'MIT': fs.readFile(`${__dirname}/../licenses/mit.txt`)
}

export const getLicense = (licenseName: keyof typeof licenses) => {
  return licenses[licenseName]
}
