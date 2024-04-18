"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // checking to see if the user is logged in to allow stars to be shown
  const showStar = Boolean(currentUser);

  // returning the list item for each story along with the star and delete button, along with all relevant information
  return $(`
      <li id="${story.storyId}">
        <div class='li-containing-div'>
          ${showDeleteBtn ? getDeleteBtn() : ""}
          ${showStar ? getStar(story, currentUser) : ""}
          <div class='li-card'>
            <div>
              <a href="${story.url}" target="a_blank" class="story-link">
                ${story.title}
              </a>
              <small class="story-hostname">(${hostName})</small>
            </div>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </div>
        </div>
      </li>
    `);
}

// decides if the star should be filled or not depending on if the item is favorited or not
function getStar(story, user) {
  const isFav = user.isFav(story);
  const starType = isFav ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>
  `;
}

// passes the delete button to the list item
function getDeleteBtn() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>
  `;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Submitting a new story from the form.

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // grabbing the values from the form inputs
  const title = $("#form-title").val();
  const author = $("#form-author").val();
  const url = $("#form-url").val();

  // finding the current user to assign the story to and passing relevant information to the api
  const username = currentUser.username
  const storyData = {title, author, url, username};
  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $storyForm.hide()

  // reseting all the form fields
  $("#form-title").val('')
  $("#form-author").val('')
  $("#form-url").val('')
}

$storyForm.on("submit", submitNewStory);

// function to delete a user's story
async function deleteStory(evt) {
  console.debug("deleteStory");

  // looks for the id of the li the trash icon is part of
  const $parentLi = $(evt.target).closest("li");
  const storyId = $parentLi.attr("id");

  // passes the id to the remove story function
  await storyList.removeStory(currentUser, storyId);

  // rerenders the page
  await showUserStories();
}

$myStories.on("click", ".trash-can", deleteStory);

// function to show a user's stories
function showUserStories() {
  console.debug("showUserStories");

  $myStories.empty();

  // decides what to display if the user does or doesn't have stories
  if (currentUser.ownStories.length === 0) {
    $myStories.append("<h2>No stories have been submitted</h2>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }

  $myStories.show();
}

// handle favoriting a story
async function handleStoryFavorite(evt) {
  console.debug("handleStoryFavorite");

  const $tgt = $(evt.target);
  const $parentLi = $tgt.closest("li");
  const storyId = $parentLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // decides which function to run depending on if the star is filled or not
  if ($tgt.hasClass("fas")) {
    await currentUser.removeFav(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFav(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", handleStoryFavorite);

// show all favorited items on a page
function showFavoritesOnPage() {
  console.debug("showFavoritesOnPage");

  $favoritedStories.empty();

  // decides what to display if the user does or doesn't have favorited stories
  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h2>You currently have no favorites!</h2>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}