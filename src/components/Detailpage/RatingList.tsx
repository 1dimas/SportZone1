"use client";

import { useState } from "react";
import { FiStar, FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { RatingData } from "@/components/lib/services/rating.service";

type RatingListProps = {
  ratings: RatingData[];
  averageRating: number;
};

export function RatingList({ ratings, averageRating }: RatingListProps) {
  const [showReviews, setShowReviews] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1]++;
      }
    });
    return distribution.reverse();
  };

  const distribution = getRatingDistribution();
  const totalRatings = ratings.length;

  return (
    <div className="space-y-6">
      {/* Rating Summary - Always Visible */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Rating & Ulasan
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col items-center justify-center text-center border-r border-gray-200">
            <div className="text-5xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              {totalRatings} ulasan
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star, idx) => {
              const count = distribution[idx];
              const percentage =
                totalRatings > 0 ? (count / totalRatings) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-gray-700">{star}</span>
                    <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Show Reviews Button - Only when reviews are hidden */}
        {!showReviews && (
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <FiChevronDown className="w-5 h-5" />
              Lihat Semua Ulasan ({ratings.length})
            </button>
          </div>
        )}
      </div>

      {/* Reviews List - Collapsible */}
      {showReviews && (
        <>
          <div className="space-y-4 animate-fadeIn">
            {ratings.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-600">Belum ada ulasan untuk produk ini</p>
              </div>
            ) : (
              ratings.map((rating) => {
                const userName = rating.user?.username || rating.user?.nama || "Anonymous";
                const userInitial = userName.charAt(0).toUpperCase();
                
                return (
                  <div
                    key={rating.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {userInitial}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">
                            {userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(rating.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rating.review && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {rating.review}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Hide Reviews Button - At the bottom of reviews */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowReviews(false)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <FiChevronUp className="w-5 h-5" />
              Sembunyikan Ulasan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
