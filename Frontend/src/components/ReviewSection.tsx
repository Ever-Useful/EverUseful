import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Heart, 
  CheckCircle
} from "lucide-react";

interface Review {
  id: number;
  author: {
    name: string;
    image: string;
    verified: boolean;
    initials: string;
  };
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  isHelpful: boolean;
}

interface ReviewSectionProps {
  projectId: number;
  averageRating: number;
  totalReviews: number;
}

export const ReviewSection = ({ projectId, averageRating, totalReviews }: ReviewSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  const reviews: Review[] = [
    {
      id: 1,
      author: {
        name: "Alex Thompson",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        verified: true,
        initials: "AT"
      },
      rating: 5,
      date: "2024-01-15",
      title: "Exceptional AI Model - Exceeded Expectations",
      comment: "This climate prediction model is absolutely outstanding. The accuracy is remarkable and the documentation is comprehensive. Dr. Chen has created something truly valuable for environmental research. I've been using it for our research project and the insights it provides are invaluable.",
      helpful: 23,
      isHelpful: false
    },
    {
      id: 2,
      author: {
        name: "Maria Rodriguez",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        verified: true,
        initials: "MR"
      },
      rating: 4,
      date: "2024-01-12",
      title: "Great Model, Minor Setup Issues",
      comment: "The model itself is fantastic and the predictions are very accurate. However, I had some initial setup challenges with the dependencies. Once everything was running, it worked perfectly. The support provided was excellent and helped resolve issues quickly.",
      helpful: 15,
      isHelpful: true
    },
    {
      id: 3,
      author: {
        name: "Dr. James Wilson",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        verified: true,
        initials: "JW"
      },
      rating: 5,
      date: "2024-01-10",
      title: "Perfect for Academic Research",
      comment: "As a climate researcher, I can confidently say this is one of the best predictive models I've worked with. The methodology is sound, the code is well-documented, and the results are consistently reliable. Highly recommended for serious research applications.",
      helpful: 31,
      isHelpful: false
    },
    {
      id: 4,
      author: {
        name: "Sarah Kim",
        image: "",
        verified: false,
        initials: "SK"
      },
      rating: 4,
      date: "2024-01-08",
      title: "Good Value for Money",
      comment: "Solid climate prediction model with good accuracy. The price point is reasonable considering the quality of work. Would have liked more customization options, but overall very satisfied with the purchase.",
      helpful: 8,
      isHelpful: false
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 70 },
    { stars: 4, count: 28, percentage: 22 },
    { stars: 3, count: 7, percentage: 6 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 }
  ];

  const handleSubmitReview = () => {
    if (newComment.trim() && newRating > 0) {
      // Here you would typically submit to your backend
      console.log("Submitting review:", { rating: newRating, comment: newComment });
      setNewComment("");
      setNewRating(0);
    }
  };

  const toggleHelpful = (reviewId: number) => {
    // Here you would typically update the backend
    console.log("Toggling helpful for review:", reviewId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, interactive: boolean = false, size: string = "w-5 h-5") => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setNewRating(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`${size} ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(averageRating)}
              </div>
              <p className="text-gray-600">{totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {item.stars}★
                  </span>
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-gray-500 w-8">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write a Review */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            {renderStars(newRating, true, "w-6 h-6")}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <Textarea
              placeholder="Share your experience with this project..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[120px] border-gray-300"
            />
          </div>
          
          <Button 
            onClick={handleSubmitReview}
            disabled={!newComment.trim() || newRating === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Submit Review
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="border-gray-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Customer Reviews</CardTitle>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <div className="flex space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.author.image} alt={review.author.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {review.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.author.name}
                      </span>
                      {review.author.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        Verified Purchase
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-2">
                      {renderStars(review.rating, false, "w-4 h-4")}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">
                      {review.title}
                    </h4>
                    
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleHelpful(review.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          review.isHelpful
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${review.isHelpful ? 'fill-current' : ''}`} />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {index < reviews.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Load More Reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};