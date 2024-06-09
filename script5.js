const commentsContainer = document.querySelector(".comments-section .comments-list");
const addCommentButton = document.querySelector(".add-comment-button");
const addCommentContainer = document.querySelector(".add-comment-container");
const submitCommentButton = document.querySelector(".submit-comment-button");
const addCommentInput = document.querySelector(".add-comment-input");

let comments = []; // Initialize an empty array to hold comments

// Utility function to generate unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create a new comment element with reply functionality
function createCommentElement(id, content) {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");
    commentElement.id = id;
    commentElement.innerHTML = `
        <div class="comment-title">Username</div>
        <button class="delete-button">X</button>
        <div class="comment-text-area">${content}</div>
        <button class="reply-comment-button">Reply</button>
        <div class="replies-container"></div>
        <div class="reply-input-container hidden">
            <div class="reply-input content-editable" contenteditable="true" placeholder="Enter your reply"></div>
            <button class="submit-reply-button">Submit</button>
        </div>
    `;

    // Update comment when text area changes
    const commentText = commentElement.querySelector(".comment-text-area");
    commentText.addEventListener("input", () => {
        updateComment(id, commentText.innerHTML); // Update content on input change
    });

    // Set up delete button
    const deleteButton = commentElement.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteComment(id, commentElement);
    });

    // Set up reply button
    const replyButton = commentElement.querySelector(".reply-comment-button");
    replyButton.addEventListener("click", () => {
        const replyInputContainer = commentElement.querySelector(".reply-input-container");
        replyInputContainer.classList.toggle("hidden");
    });

    // Set up submit reply button
    const submitReplyButton = commentElement.querySelector(".submit-reply-button");
    submitReplyButton.addEventListener("click", () => {
        const replyInput = commentElement.querySelector(".reply-input");
        const replyText = replyInput.innerHTML.trim();
        if (replyText !== "") {
            addReply(commentElement, id, replyText);
            replyInput.innerHTML = "";
            const replyInputContainer = commentElement.querySelector(".reply-input-container");
            replyInputContainer.classList.add("hidden");
        }
    });

    // Display existing replies
    displayReplies(id, commentElement);

    return commentElement;
}

// Add a new comment
function addComment() {
    const commentText = addCommentInput.innerHTML.trim();
    if (commentText !== "") {
        const newComment = {
            id: generateUniqueId(),
            content: commentText,
            replies: [] // Initialize with an empty replies array
        };

        comments.push(newComment); // Add to the comments array

        const commentElement = createCommentElement(newComment.id, newComment.content);
        commentsContainer.appendChild(commentElement); // Append the new comment

        addCommentInput.innerHTML = ""; // Clear the input field
        addCommentContainer.classList.add("hidden"); // Hide the input field after adding the comment
    }
}

// Update the content of a comment
function updateComment(id, content) {
    const comment = comments.find(comment => comment.id === id);
    if (comment) {
        comment.content = content;
    }
}

// Add a reply to a comment
function addReply(commentElement, parentId, replyText) {
    const repliesContainer = commentElement.querySelector(".replies-container");
    const replyId = generateUniqueId();
    const replyElement = createReplyElement(replyId, replyText);
    repliesContainer.appendChild(replyElement);

    // Find the parent comment and add the reply to its replies array
    const parentComment = comments.find(comment => comment.id === parentId);
    if (parentComment) {
        parentComment.replies.push({ id: replyId, content: replyText });
    }
}

// Create a new reply element
function createReplyElement(id, content) {
    const replyElement = document.createElement("div");
    replyElement.classList.add("reply-comment");
    replyElement.id = id;
    replyElement.innerHTML = `
        <div class="reply-comment-title">Username</div>
        <div class="reply-text">${content}</div>
        <button class="delete-reply-button">Delete</button>
    `;

    // Set up delete button
    const deleteButton = replyElement.querySelector(".delete-reply-button");
    deleteButton.addEventListener("click", () => {
        deleteReply(id, replyElement);
    });

    return replyElement;
}

// Display existing replies for a comment
function displayReplies(parentId, commentElement) {
    const repliesContainer = commentElement.querySelector(".replies-container");
    const parentComment = comments.find(comment => comment.id === parentId);
    if (parentComment) {
        parentComment.replies.forEach((reply) => {
            const replyElement = createReplyElement(reply.id, reply.content);
            repliesContainer.appendChild(replyElement);
        });
    }
}

// Delete a comment
function deleteComment(id, commentElement) {
    comments = comments.filter(comment => comment.id !== id);
    commentElement.remove();
}

// Delete a reply
function deleteReply(replyId, replyElement) {
    replyElement.remove();
    comments.forEach(comment => {
        comment.replies = comment.replies.filter(reply => reply.id !== replyId);
    });
}

// Set up the click event to show the input field for adding comments
addCommentButton.addEventListener("click", () => {
    addCommentContainer.classList.toggle("hidden");
});

// Set up the click event to add comments
submitCommentButton.addEventListener("click", addComment);

// Initial rendering of comments (in case there are predefined comments)
comments.forEach(comment => {
    const commentElement = createCommentElement(comment.id, comment.content);
    commentsContainer.appendChild(commentElement);
});


/*
// Add a new comment when Enter key is pressed in the input field
addCommentInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior of Enter key (e.g., new line)
        addComment(); // Call addComment function to submit the comment
    }
});
*/