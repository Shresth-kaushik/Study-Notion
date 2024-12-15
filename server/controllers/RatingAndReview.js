const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");

// //createRating
// exports.createRating = async (req, res) => {
//     try{

//         //get user id
//         const userId = req.user.id;
//         //fetchdata from req body
//         const {rating, review, courseId} = req.body;
//         //check if user is enrolled or not
//         const courseDetails = await Course.findOne(
//                                     {_id:courseId,
//                                     studentsEnrolled: {$elemMatch: {$eq: userId} },
//                                 });

//         if(!courseDetails) {
//             return res.status(404).json({
//                 success:false,
//                 message:'Student is not enrolled in the course',
//             });
//         }
//         //check if user already reviewed the course
//         const alreadyReviewed = await RatingAndReview.findOne({
//                                                 user:userId,
//                                                 course:courseId,
//                                             });
//         if(alreadyReviewed) {
//                     return res.status(403).json({
//                         success:false,
//                         message:'Course is already reviewed by the user',
//                     });
//                 }
//         //create rating and review
//         const ratingReview = await RatingAndReview.create({
//                                         rating, review, 
//                                         course:courseId,
//                                         user:userId,
//                                     });
       
//         //update course with this rating/review
//         const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
//                                     {
//                                         $push: {
//                                             ratingAndReviews: ratingReview._id,
//                                         }
//                                     },
//                                     {new: true});
//         console.log(updatedCourseDetails);
//         //return response
//         return res.status(200).json({
//             success:true,
//             message:"Rating and Review created Successfully",
//             ratingReview,
//         })
//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }


exports.createRating = async (req, res) => {
    try {
        // Get user ID from the authenticated user
        const userId = req.user.id;
        
        // Fetch data from request body
        const { rating, review, courseId } = req.body;
        
        // Check if rating and review are provided
        if (!rating || !review) {
            return res.status(400).json({
                success: false,
                message: 'Rating and review are required',
            });
        }

        // Check if user is enrolled in the course
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        // Check if user has already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }

        // Create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });

        // Update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true }
        );

        // Log updated course details for debugging
        console.log('Updated Course Details:', updatedCourseDetails);

        // Return response
        return res.status(200).json({
            success: true,
            message: 'Rating and Review created Successfully',
            ratingReview,
        });
    } catch (error) {
        console.log('Error creating rating:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// export const createRating = async (data, token) => {
//     const toastId = toast.loading("Loading...");
//     let success = false;
  
//     // Validate input data
//     if (!data.rating || !data.review || !data.courseId) {
//       toast.dismiss(toastId); // Dismiss the loading toast
//       toast.error("All fields are required.");
//       return false;
//     }
  
//     try {
//       const response = await apiConnector("POST", CREATE_RATING_API, data, {
//         Authorization: `Bearer ${token}`,
//       });
  
//       console.log("CREATE RATING API RESPONSE............", response);
  
//       if (!response?.data?.success) {
//         throw new Error(response.data?.message || "Could Not Create Rating");
//       }
  
//       toast.success("Rating Created");
//       success = true;
//     } catch (error) {
//       success = false;
//       console.log("CREATE RATING API ERROR............", error);
//       toast.error(error.message);
//     } finally {
//       toast.dismiss(toastId); // Ensure the loading toast is dismissed
//     }
  
//     return success;
//   };
  



//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}