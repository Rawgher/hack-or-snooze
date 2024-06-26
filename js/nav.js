"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Show submit form on click on "submit"

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $myStories.hide();
  $favoritedStories.hide();
  $allStoriesList.show();
  $storyForm.show();
}

$navSubmitStory.on("click", navSubmitClick);

// Shows the favorite page when clicked

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  showFavoritesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

// Shows the user's stories page when clicked

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  showUserStories();
  $myStories.show();
}

$navMyStories.on("click", navMyStories);