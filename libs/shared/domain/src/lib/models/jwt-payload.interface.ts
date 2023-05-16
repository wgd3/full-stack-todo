import { IUser } from './user.interface';

// export interface IAccessTokenPayload {
//   email: string;

//   /**
//    * user's ID will be used as the subject
//    */
//   sub: string;

//   familyName: string | null;
//   givenName: string | null;

//   /**
//    * Placeholder indicating that the payload can contain other arbitrary
//    * data as needed.
//    */
//   [key: string]: string | number | boolean | unknown;
// }

export type IAccessTokenPayload = Pick<
  IUser,
  'email' | 'familyName' | 'givenName' | 'profilePicture'
> & { sub: string; [key: string]: string | number | boolean | unknown };
