/**
 * This interface describes the data structure returned by Google when you
 * retrieve a user's profile after authenticating via OAuth
 */
export interface IGoogleProfile {
  /**
   * Access token hash
   *
   * @example "dtdp-***f47***zRlOhdg"
   */
  at_hash: string;

  /**
   * Who the token was intended for
   *
   * @example "************-693bq09as195vkni3uvhkaun3qdn79tr.apps.googleusercontent.com"
   */
  aud: string;

  /**
   * Authorized Party for whom the JWT was issued
   *
   * @example "************-693bq09as195vkni3uvhkaun3qdn79tr.apps.googleusercontent.com"
   */
  azp: string;

  /**
   * User's email
   */
  email: string;

  /**
   *
   */
  email_verified: boolean;

  /**
   * Expiration time of the token measured in seconds since Unix epoch
   *
   * @example 1683837800
   */
  exp: number;

  /**
   * Generally a user's "last" name
   *
   * @example "Daniel"
   */
  family_name: string;

  /**
   * Generally a user's "first" name
   *
   * @example "Wallace"
   */
  given_name: string;

  /**
   * Time JWT was issued measured in seconds since Unix epoch
   *
   * 1683834200
   */
  iat: number;

  /**
   * Issuer of the JWT
   *
   * @example "https://accounts.google.com"
   */
  iss: string;

  /**
   * JWT ID (unique token identifier)
   *
   * @example "7b786a3ea28eead58e7090b516ce3655f03a247d"
   */
  jti: string;

  /**
   * Internationalization and Localization locale
   *
   * @example "en"
   */
  locale: string;

  /**
   * Full name of the user
   *
   * @example "Wallace Daniel"
   */
  name: string;

  /**
   * Unique value associating request with token
   *
   * @example "ZUZyZ0ZhaEVHNDgzMGpxZkFxb0hBaV9BekJWRER6ampCZ1c0dXNxZ0pHbE96"
   */
  nonce: string;

  /**
   * If available, a link to the profile picture associated with the Google
   * profile
   *
   * @example "https://lh3.googleusercontent.com/a/**********"
   */
  picture: string;

  /**
   * Subject - Unique identifier for the user in Google's ecosystem
   *
   * @example "113751010101010101010"
   */
  sub: string;
}
