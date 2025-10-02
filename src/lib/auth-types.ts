import { auth } from "./auth";

//Infer Session Type with additional Fields

type BaseSession = (typeof auth.$Infer.Session)["session"];
type BaseUser = (typeof auth.$Infer.Session)["user"];

export interface SessionType extends BaseSession {
  user: BaseUser;
}

export type ReturnedType = {
  redirect: boolean;
  token: string;
  url: string | undefined;
  user: {
    id: string;
    email: string;
    name: string;
    image: null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};
