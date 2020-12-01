import fs from "fs";
import path from "path";

function getDirectoryPath(directoryName) {
  return path.join(process.cwd(), `${directoryName}`);
}

function getFilenames(directory, fileType) {
  const pattern = new RegExp(`.${fileType}`);
  return fs.readdirSync(directory).filter((name) => name.match(pattern));
}

function readFile(directory, file) {
  return fs.readFileSync(`${directory}/${file}`, "utf-8");
}

(function buildCssRuleset() {
  // Get array of CSS files.
  // @TODO: maybe change the naming convention of these files
  // in case we want to use other type of data files not
  // necessarily for CSS.
  // Maybe prepend filenames with "_css", like "_css-01-colors.json"
  // Then we could choose files containing "_css" only.
  const jsonSourceDirectory = getDirectoryPath("_data");
  const cssDestDirectory = getDirectoryPath("css");
  const filenames = getFilenames(jsonSourceDirectory, "json"); // i.e. ['_01-colors.json']

  filenames.map((name) => {
    let newObj = {};
    const file = readFile(jsonSourceDirectory, name);
    let fileObject = JSON.parse(file);

    // Some JSON files have a ":root" property because CSS
    // values will be placed under ":root". Here we make sure to
    // identify them before processing.
    let fileObjHasRoot = false;
    if (fileObject.hasOwnProperty(":root")) {
      fileObjHasRoot = true;
      fileObject = fileObject[":root"];
    }

    let cssDeclarations = "";

    for (let selector in fileObject) {
      let count = Object.keys(fileObject[selector]).length;
      for (let property in fileObject[selector]) {
        --count;
        cssDeclarations += `\t${property}: ${fileObject[selector][property]};\r`;
      }
      if (!fileObjHasRoot) {
        newObj[selector] = cssDeclarations;
        cssDeclarations = "";
      }
    }

    if (fileObjHasRoot) {
      newObj[":root"] = cssDeclarations;
    }

    // Create CSS string.
    let css = "";
    for (let selector in newObj) {
      css += `${selector} {
${newObj[selector]}
}
`;
    }

    // Create CSS file.
    let newFilename = name.replace("json", "css");
    try {
      fs.writeFileSync(`${cssDestDirectory}/${newFilename}`, css, {
        flag: "w+",
      });
    } catch (err) {
      console.log(err);
    }
  });
})();
