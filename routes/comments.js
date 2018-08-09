var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var Shop = require("../models/shop");

router.get("/new", isLoggedIn, (req, res) => {
    Shop.findById(req.params.id, (err, foundShop) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {shop: foundShop});
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    
    Shop.findById(req.params.id, (err, foundShop) => {
        if (err) {
            console.log(err);
            res.redirect("/shops");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundShop.comments.push(comment);
                    foundShop.save();
                    res.redirect(`/shops/${foundShop._id}`);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render("comments/edit", {shop_id: req.params.id, comment: foundComment});
    });
});

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        res.redirect(`/shops/${req.params.id}`);
    });
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
     if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;