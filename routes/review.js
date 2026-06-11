const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//reviews
//post review route

const  validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errMsg)
    }else{
        next();
    }

};


router.post("/", async (req, res) => {//hum common part nikalte h to eske liye common part hoga  listings/:id/reviews

    try {
        let { id } = req.params;
       
        let listing = await Listing.findById(id);

        if (!listing) {
            return res.send("Listing not found");
        }

        let newReview = await Review.create(req.body.review);

        listing.reviews.push(newReview._id);

        await listing.save();
          req.flash("success","New Review is Created");
        console.log("Review linked successfully");
        res.redirect(`/listings/${id}`);

    } catch (err) {
        console.log(err);
        res.redirect(`/listings`);
    }
});

//delete review Route
router.delete("/:reviewId", async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
});

module.exports = router;
