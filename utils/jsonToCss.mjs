import fs from "fs";
import path, { dirname } from "path";

function getDirectoryPath(directoryName) {
  return path.join(process.cwd(), `${directoryName}`);
}

function getFilenames(directory, fileType) {
  const pattern = new RegExp(`.${fileType}`);
  return fs.readdirSync(directory).filter((name) => name.match(pattern));
}

function readFile(directory, filename) {
  return fs.readFileSync(`${directory}/${filename}`, "utf-8");
}

(function buildCssRuleset() {
  // Get array of CSS files.
  const jsonSourceDirectory = getDirectoryPath("_data");
  const cssDestDirectory = getDirectoryPath("css");
  const files = getFilenames(jsonSourceDirectory, "json"); // i.e. ['_01-colors.json']
  // console.log(files);

  files.map((filename) => {
    // Read file.
    const file = readFile(jsonSourceDirectory, filename);
    // Save content to fileObject and initialize new object.
    const fileObject = JSON.parse(file);
    const newObj = {};

    // Files that contain CSS rules that need to be under ":root".
    const rootElements = ["_test.json"];

    if (rootElements.includes(filename)) {
      // we process the files we want in ":root" in here
      // those files should be included in the rootElements array
      for (let selector in fileObject) {
        console.log(selector);
      }
    } else {
      for (let selector in fileObject) {
        let count = Object.keys(fileObject[selector]).length;
        let declaration = "";

        for (let item in fileObject[selector]) {
          for (let property in fileObject[selector]) {
            --count;
            let newLine = count > 0 ? "\n" : "";
            declaration += `\t${property}: ${fileObject[selector][property]};${newLine}`;
          }
          newObj[selector] = declaration;
        }
      }
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
    let newFilename = filename.replace("json", "css");
    try {
      fs.writeFileSync(`${cssDestDirectory}/${newFilename}`, css, {
        flag: "w+",
      });
    } catch (err) {
      console.log(err);
    }
  });
})();
