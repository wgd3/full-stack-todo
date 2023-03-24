export interface IAccessTokenPayload {
  email: string;

  /**
   * user's ID will be used as the subject
   */
  sub: string;

  /**
   * Placeholder indicating that the payload can contain other arbitrary
   * data as needed.
   */
  [key: string]: string | number | boolean | unknown;
}
