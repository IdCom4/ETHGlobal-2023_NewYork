/**
 * Utils responsible for the business logic of string manipulation.
 */
export class StringUtils {
  /**
   * Escape a string to be used in a regular expression.
   * @see https://stackoverflow.com/a/6969486/2391795
   * @param string The string to escape.
   */
  public static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}
