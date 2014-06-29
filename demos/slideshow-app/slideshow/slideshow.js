(function (App) {
  "use strict";

  App.SlideShow = choona.View.extend({
    template: "slideshow/slideshow.html",
    events:{
      "click #nextButton": "nextSlide",
      "click #preButton": "preSlide",
      "click #firstSlide": "firstSlide",
      "click #lastSlide": "lastSlide"
    },
    initialize: function () {
      choona.View.apply(this, arguments);
      this.imageArray = this.config;
      this.currentImageIndex = 0;
    },
    lazyStart: function () {
      this.imageArrayEle = this.$el.find("#images_id");
      this.loadImage();
    },
    nextSlide: function () {
      this.currentImageIndex++;
      if (this.currentImageIndex === this.imageArray.length) {
        this.currentImageIndex = 0;
      }
      this.loadImage();
    },
    preSlide: function () {
      this.currentImageIndex--;
      if (this.currentImageIndex === -1) {
        this.currentImageIndex = this.imageArray.length - 1;
      }
      this.loadImage();
    },
    firstSlide:function () {
      this.currentImageIndex = 0;
      this.loadImage();
    },
    lastSlide:function () {
      this.currentImageIndex = this.imageArray.length - 1;
      this.loadImage();
    },
    loadImage: function () {
      this.$$.find("#status").html((this.currentImageIndex+1) + "/" + this.imageArray.length);
      this.imageArrayEle.attr("src", this.imageArray[this.currentImageIndex]);
    }
  });
})(App);
