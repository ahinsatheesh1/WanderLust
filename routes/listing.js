const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

const {isLoggedIn}=require("../middleware.js");

const validateListing=(req,res,next) => {
  let {error}= listingSchema.validate(req.body);
  
    if(error){
      let errMsg=error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }

}

// Index Route - show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Route - form to create new listing
router.get("/new",isLoggedIn,(req, res) => {
  res.render("listings/new");
});

// Create Route - actually add to DB
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  })
);


// Show Route - show a particular listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exits!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
  })
);


// Edit Route - form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
      req.flash("error","Listing you requested for does not exits!");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

// Update Route - update in DB
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route - delete from DB
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findOneAndDelete({ _id: id });
    console.log("Deleted:", deletedListing);
     req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports=router;