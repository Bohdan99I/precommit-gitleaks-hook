const { execSync } = require("child_process");
const os = require("os");
const path = require("path");
const fs = require("fs");

function installGitleaks() {
  const platform = os.platform();
  let gitleaksPath = "";

  if (platform === "linux" || platform === "darwin") {
    gitleaksPath = "/usr/local/bin/gitleaks";
    execSync(
      "curl -sSL https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks-linux-amd64 -o " +
        gitleaksPath
    );
    execSync("chmod +x " + gitleaksPath);
  } else if (platform === "win32") {
    gitleaksPath = path.join("C:", "Windows", "gitleaks.exe");
    execSync(
      'powershell.exe -Command "Invoke-WebRequest -Uri https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks-windows-amd64.exe -OutFile ' +
        gitleaksPath +
        '"'
    );
  }

  return gitleaksPath;
}

function checkSecrets() {
  try {
    const gitleaksPath =
      os.platform() === "win32"
        ? path.join("C:", "Windows", "gitleaks.exe")
        : "/usr/local/bin/gitleaks";

    if (!fs.existsSync(gitleaksPath)) {
      installGitleaks();
    }

    const result = execSync(`${gitleaksPath} detect --source .`, {
      encoding: "utf8",
    });
    if (result.includes("No leaks detected")) {
      return 0;
    } else {
      console.error(result);
      return 1;
    }
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

process.exit(checkSecrets());
