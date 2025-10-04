import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  roleType: ["create", "view", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  roleType: ["create", "view", "update", "delete"],
  ...adminAc.statements,
});

export const teacher = ac.newRole({
  roleType: ["create", "update", "delete", "view"],
});
export const student = ac.newRole({
  roleType: ["view"],
});
export const parent = ac.newRole({
  roleType: ["view"],
});
