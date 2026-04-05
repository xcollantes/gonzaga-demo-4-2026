/** Functions for sharing. */

import { toastError, toastSuccess } from "./toast";

export function shareOnFacebook(outfitUrl: string, shareText: string) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(outfitUrl)}&quote=${encodeURIComponent(shareText)}`;
  window.open(url, "_blank", "width=600,height=400");
};

export function shareOnX(outfitUrl: string, shareText: string) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(outfitUrl)}`;
  window.open(url, "_blank", "width=600,height=400");
};

export function shareOnInstagram(outfitUrl: string, shareText: string) {
  const url = `https://www.instagram.com/share?url=${encodeURIComponent(outfitUrl)}&text=${encodeURIComponent(shareText)}`;
  window.open(url, "_blank", "width=600,height=400");
};

export function copyToClipboard() {
  navigator.clipboard.writeText(`${process.env.FRONTEND_URL}`)
    .then(() => {
      toastSuccess("Link copied");
    })
    .catch((err) => {
      console.error("Could not copy link:", err);
      toastError("Could not copy link to clipboard.");
    });
};