// ```
// /ui
//   - map.json
//   - UI.md
//   /default
//     - list.html
//     - item.html
// ``

// The `map.json` file will be used to identify a matching UI framework.

// ```json
// {
//   "bootstrap": {
//     "site": "getbootstrap.com",
//     "versions": {
//       "default": {
//         "status": "stable",
//         "paths": {
//           "main": "bootstrap/v1",
//           "views": "bootstrap/v1/stable/views",
//         },
//         "dependencies": {
//         }
//       },

const path = require('path');
const semver = require('semver');
const ArtefactMap = require('./map');

class LibVersion {
  constructor(artefactType, {lib, version}) {
    this.artefactType = artefactType;
    this.map = artefactType.map;
    this.lib = lib;
    this.version = version;
  }

  get entryObj() {
    return _.pickBy(this.map[lib].versions, (obj, versionRange) => {
      return semver.satisfies(version, versionRange)
    });  
  }
}

export default class ArtefactType {
  constructor(type, rootPath, env) {
    this.type = type;
    this.rootPath = rootPath;
    this.env = env;
  }

  get typeEnv() {
    return this.env[this.type];
  }

  get typePath() {
    return path.join(this.rootPath, this.type);
  }

  // load map.json
  async read() {
    this.map = await new ArtefactMap(this.typePath).read().map;
  }

  // lib and version of project environment
  // TODO: make async when returning files
  filesFor({lib, version}) {
    return new LibVersion(this, {lib, version}).entryObj;  
  }
}