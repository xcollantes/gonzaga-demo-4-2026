/**
 * Firebase Error Handling
 *
 * This file provides utilities for handling Firebase authentication errors.
 * It maps Firebase error codes to user-friendly error messages that can be
 * displayed in the UI.
 *
 * Use these functions when handling errors from Firebase authentication
 * operations to provide clear feedback to users.
 */

/** Mapping of Firebase user error messages. */

export const formatFirebaseError = (error: Error) => {
  if (error.message.includes("email-already-in-use")) {
    return "Use a different email.";
  }
  if (error.message.includes("invalid-email")) {
    return "Invalid email.";
  }
  if (error.message.includes("weak-password")) {
    return "Weak password.";
  }
  if (error.message.includes("user-not-found")) {
    return "User not found.";
  }
  if (error.message.includes("wrong-password")) {
    return "Wrong password.";
  }
  if (error.message.includes("popup-closed-by-user")) {
    return "Login cancelled.";
  }
  if (error.message.includes("popup-blocked")) {
    return "Login blocked by browser.";
  }
  if (error.message.includes("invalid-credential")) {
    return "Invalid credentials.";
  }
  if (error.message.includes("requires-recent-login")) {
    return "This operation requires recent authentication. Please log in again before retrying.";
  }
  if (error.message.includes("invalid-password")) {
    return "Password should be at least 6 characters.";
  }
  if (error.message.includes("apple.com")) {
    return "Apple login failed.";
  }
  if (error.message.includes("operation-not-supported-in-this-environment")) {
    return "Apple login is not supported in this environment.";
  }

  return null;
};
