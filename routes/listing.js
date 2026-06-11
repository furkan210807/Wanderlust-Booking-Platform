const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const  validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errMsg)
    }else{
        next();
    }

};


//index Route
router.get("/", wrapAsync(async(req,res)=>{
   const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));

//create Route 
router.post("/",validateListing,wrapAsync( async (req, res) => {
   
    const  newListing = new Listing(req.body.listing);
   

    await newListing.save();
    req.flash("success","New Listing is Created");

    res.redirect("/listings");
}));
//edit route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
      req.flash("success"," Listing is updated!");

    res.render("listings/edit.ejs", { listing });
}));

//update Route 

router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","Listing is Update");
    res.redirect(`/listings/${id}`);

}));

//delete Route

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
      req.flash("success"," Listing is Deleted");
    res.redirect("/listings");
}));

module.exports = router;