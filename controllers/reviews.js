const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {//hum common part nikalte h to eske liye common part hoga  listings/:id/reviews

    try {
        let { id } = req.params;
       let listing = await Listing.findById(id);
             if (!listing) {
            return res.send("Listing not found");
        }
        let newReview = await Review.create(req.body.review);
        newReview.author = req.user._id;
        await newReview.save();      // important
        listing.reviews.push(newReview._id);
            await listing.save();
            
        req.flash("success","New Review is Created");
        console.log("Review linked successfully");
        res.redirect(`/listings/${id}`);

    } catch (err) {
        console.log(err);
        res.redirect(`/listings`);
    }
};

module.exports.destroyReview = async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
};