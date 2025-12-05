"use client";

import { useState, useEffect } from "react";
import { FiStar, FiCheckCircle } from "react-icons/fi";
import { createRating, checkUserRating } from "@/components/lib/services/rating.service";

type RatingFormProps = {
  produkId: string;
  userId: string;
  onSuccess?: () => void;
};

export function RatingForm({ produkId, userId, onSuccess }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [isCheckingRating, setIsCheckingRating] = useState(true);

  useEffect(() => {
    const checkRating = async () => {
      if (!userId || !produkId) {
        setIsCheckingRating(false);
        return;
      }

      try {
        const alreadyRated = await checkUserRating(userId, produkId);
        setHasRated(alreadyRated);
      } catch {
        setHasRated(false);
      } finally {
        setIsCheckingRating(false);
      }
    };

    checkRating();
  }, [userId, produkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Pilih rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createRating({
        userId,
        produkId,
        rating,
        review: review.trim() || undefined,
      });

      setRating(0);
      setReview("");
      setHasRated(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingRating) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-orange-500" />
        </div>
      </div>
    );
  }

  if (hasRated) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <FiCheckCircle className="w-16 h-16 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            Terima Kasih!
          </h3>
          <p className="text-gray-600">
            Anda sudah memberikan ulasan untuk produk ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Berikan Ulasan Anda
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <FiStar
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ulasan (Opsional)
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Ceritakan pengalaman Anda dengan produk ini..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
        </button>
      </form>
    </div>
  );
}
