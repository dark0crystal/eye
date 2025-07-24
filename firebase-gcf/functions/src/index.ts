/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// import * as v2 from "firebase-functions/v2";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const uploadText = onRequest((request, response) => {
  // Set CORS headers
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    response.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are accepted",
    });
    return;
  }

  try {
    // Get text from request body
    const {text} = request.body;

    // Validate that text is provided
    if (!text || typeof text !== "string") {
      response.status(400).json({
        error: "Bad request",
        message: "Text field is required and must be a string",
      });
      return;
    }

    // Log the received text
    logger.info("Text received", {
      textLength: text.length,
      timestamp: new Date().toISOString(),
      structuredData: true,
    });

    // Here you can add your business logic:
    // - Save to Firestore
    // - Process the text
    // - Validate content
    // - etc.

    // Send success response
    response.status(200).json({
      success: true,
      message: "Text uploaded successfully",
      data: {
        textLength: text.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Error processing text upload", error);

    response.status(500).json({
      error: "Internal server error",
      message: "Failed to process text upload",
    });
  }
});
