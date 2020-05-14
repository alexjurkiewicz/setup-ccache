import * as core from "@actions/core";
import * as io from "@actions/io";
import * as exec from "@actions/exec";
import * as fs from "fs";
import * as process from "process";
import { platform } from "os";

function config() {
  let conf = `compression = true
compression_level = 9
log_file = /tmp/ccache.log
`;
  const maxSize = core.getInput("max-size", { required: true });
  if (maxSize) {
    conf += `max_size = ${maxSize}\n`;
  }
  const extraConfig = core.getInput("extra-config");
  if (extraConfig) {
    conf += extraConfig;
    conf += "\n";
  }
  core.info(conf);
  return conf;
}

async function installCcache() {
  if (process.platform === "darwin") {
    await exec.exec("brew install ccache");
  } else {
    await exec.exec("apt-get update");
    await exec.exec("apt-get install -y ccache");
  }
}

async function run() {
  let ccachePath = await io.which("ccache");
  if (!ccachePath) {
    core.info(`Install ccache`);
    await installCcache();
    ccachePath = await io.which("ccache", true);
  }

  core.info("Write ~/.ccache.conf");
  const homeDir = process.env.HOME;
  fs.writeFileSync(homeDir + "/.ccache.conf", config());

  core.info(`Prepend ${ccachePath} to $PATH`);
  core.addPath(ccachePath);

  let ccPath = await io.which("cc", true);
  core.info(`cc path: ${ccPath}`);

  core.info("ccache stats:");
  await exec.exec("ccache -s");
}

try {
  run();
} catch (err) {
  core.setFailed(`Action failed with error ${err}`);
}
