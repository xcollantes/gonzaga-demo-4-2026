import { feedbackApiUrl } from "@/lib/api-urls";
import { getCurrentUserToken } from "@/lib/firebase-init";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../query-client";

export enum FeedbackType {
  FEATURE = 'Feature request',
  BUG = 'Bug',
  FEEDBACK = 'Feedback',
}

export interface FeedbackData {
  description: string;
  feedbackType: FeedbackType;
  title?: string;
  labels?: string[];
  origin?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;

  // User data optional.
  city?: string;
  country?: string;
  region?: string;
  zip?: string;
  timezone?: string;
  languages?: string[];
  browser?: string;
  device?: string;
  platform?: string;
  screenWidth?: number;
  screenHeight?: number;
  host?: string;
}

const submitFeedback = async (data: FeedbackData) => {
  const token = await getCurrentUserToken();

  try {
    console.log('Submitting feedback:', data);

    const response = await apiRequest('POST', feedbackApiUrl, {
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Feedback submitted:', response);
    return response;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: submitFeedback,
    onError: (error) => {
      console.error('Feedback submission error:', error);
    },
  });
};