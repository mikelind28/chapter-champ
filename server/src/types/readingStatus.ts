/**
 * Defines valid reading status options for books in the user's library.
 */
export type BookStatus = "Want to Read" | "Currently Reading" | "Finished Reading" | "Favorite" | "WANT_TO_READ" | "CURRENTLY_READING" | "FINISHED_READING" | "FAVORITE";

/**
 * Maps GraphQL enum values to Mongoose-friendly strings.
 * @param status - The GraphQL enum value
 * @returns {BookStatus} - Correctly formatted Mongoose value
 */
export const mapGraphQLStatusToMongoose = (status: string): BookStatus => {
  switch (status) {
    case "WANT_TO_READ":
      return "Want to Read";
    case "CURRENTLY_READING":
      return "Currently Reading";
    case "FINISHED_READING":
      return "Finished Reading";
    case "FAVORITE":
      return "Favorite";
    default:
      throw new Error(`Invalid reading status: ${status}`);
  }
};

/**
 * Maps Mongoose status values back to GraphQL enums.
 * @param status - The Mongoose status string
 * @returns {string} - GraphQL enum value
 */
export const mapMongooseStatusToGraphQL = (status: string): string => {
  switch (status) {
    case "Want to Read":
      return "WANT_TO_READ";
    case "Currently Reading":
      return "CURRENTLY_READING";
    case "Finished Reading":
      return "FINISHED_READING";
    case "Favorite":
      return "FAVORITE";
    default:
      throw new Error(`Invalid Mongoose reading status: ${status}`);
  }
};