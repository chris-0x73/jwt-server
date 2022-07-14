import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;
const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
const hash = await bcrypt.hash(process.env.P, salt);
const same = await bcrypt.compare(process.env.P, hash);
console.log({ plain: process.env.P, salt, hash, same });
