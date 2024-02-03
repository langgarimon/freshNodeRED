const fs = require("fs");
const path = require("path");

module.exports = function (RED) {
  function SaveFile(config) {
    RED.nodes.createNode(this, config);
    let node = this;
    node.name = config.name;
    node.filePath = config.filePath || "";
    node.on("input", function (msg) {
      const filePath = node.filePath || msg.path;
      if (!filePath || filePath == "") {
        msg.payload = "No File Path Found";
        node.send(msg);
      } else if (!msg.file || msg.file == "") {
        msg.payload = "No File Found";
        node.send(msg);
      } else {
        let constDirname = new String(filePath).split("/");
        constDirname.pop();
        constDirname = constDirname.join("/");

        const folderpath = path.join(__dirname, "../../");
        let _filePath = path.join(__dirname, "../../");
        _filePath = path.join(_filePath, filePath);

        const dir = path.join(folderpath, constDirname);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(_filePath, msg.file);
        msg.payload = filePath;
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("fm-save-file", SaveFile);

  function MoveFile(config) {
    RED.nodes.createNode(this, config);
    let node = this;
    node.name = config.name;
    node.sourcePath = config.sourcePath || "";
    node.destinationPath = config.destinationPath || "";
    node.on("input", function (msg) {
      const sourcePath = node.sourcePath || msg.sourcePath;
      const destinationPath = node.destinationPath || msg.destinationPath;
      if (!sourcePath || sourcePath == "") {
        msg.payload = "No Source File Path Found";
        node.send(msg);
      } else if (!destinationPath || destinationPath == "") {
        msg.payload = "No Destination File Path Found";
        node.send(msg);
      } else {
        let constDirname = new String(destinationPath).split("/");
        constDirname.pop();
        constDirname = constDirname.join("/");

        const folderpath = path.join(__dirname, "../../");
        let _fileSourcePath = path.join(__dirname, "../../");
        _fileSourcePath = path.join(_fileSourcePath, sourcePath);

        let _fileDestinationPath = path.join(__dirname, "../../");
        _fileDestinationPath = path.join(_fileDestinationPath, destinationPath);

        const dir = path.join(folderpath, constDirname);

        try {
          if (fs.existsSync(_fileSourcePath)) {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            fs.rename(_fileSourcePath, _fileDestinationPath, function (err) {
              if (err) {
                msg.payload = err;
              } else {
                msg.payload = {
                  path: destinationPath,
                };
              }
            });
            msg.payload = {
              path: destinationPath,
            };
          } else {
            msg.payload = "File Not Found";
          }
        } catch (err) {
          msg.payload = err;
        }
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType("fm-move-file", MoveFile);
};
