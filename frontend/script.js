// =========================
// CREATE POST
// =========================

async function createPost() {

    const content =
        document.getElementById("postContent").value.trim();

    const imageInput =
        document.getElementById("imageInput");

    if (!content && imageInput.files.length === 0) {
        alert("Please write something or select a photo.");
        return;
    }

    const formData = new FormData();

    formData.append("username", "krutika01");
    formData.append("content", content);

    if (imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/posts/create",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("postContent").value = "";
            imageInput.value = "";
            document.getElementById("selectedImage").innerText = "";

            await loadPosts();

            alert("Post created successfully!");

        } else {

            alert(data.message || "Post creation failed.");

        }

    } catch (error) {

        console.error("Create post error:", error);

        alert(
            "Server connection failed. Make sure your backend is running on port 5000."
        );

    }
}


// =========================
// LOAD POSTS
// =========================

async function loadPosts() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/posts"
        );

        const posts = await response.json();

        const postsContainer =
            document.getElementById("posts");

        postsContainer.innerHTML = "";

        const count =
            document.getElementById("profilePostCount");

        if (count) {
            count.innerText = posts.length;
        }

        posts.forEach(post => {

            const postDiv =
                document.createElement("div");

            postDiv.className = "instagram-post";

            const imageHTML = post.image
                ? `
                    <img
                        src="http://localhost:5000${post.image}"
                        class="real-post-image"
                    >
                  `
                : `
                    <div class="post-image">
                        <div class="post-placeholder">
                            <i class="fa-regular fa-image"></i>
                            <span>GMinsta Post</span>
                        </div>
                    </div>
                  `;

            postDiv.innerHTML = `

                <div class="post-header">

                    <div class="post-user">

                        <div class="profile-photo">
                            K
                        </div>

                        <strong>
                            ${post.username}
                        </strong>

                    </div>

                    <button
                        class="more-btn"
                        onclick="deletePost('${post._id}')">
                        •••
                    </button>

                </div>

                ${imageHTML}

                <div class="post-actions">

                    <div class="left-actions">

                        <button
                            onclick="likePost('${post._id}')">

                            <i class="fa-regular fa-heart"></i>

                        </button>

                        <button
                            onclick="focusComment('${post._id}')">

                            <i class="fa-regular fa-comment"></i>

                        </button>

                        <button>

                            <i class="fa-regular fa-paper-plane"></i>

                        </button>

                    </div>

                    <button>

                        <i class="fa-regular fa-bookmark"></i>

                    </button>

                </div>

                <div class="post-info">

                    <strong>
                        ${post.likes || 0} likes
                    </strong>

                    <p>

                        <b>
                            ${post.username}
                        </b>

                        ${post.content || ""}

                    </p>

                    <input
                        id="comment-${post._id}"
                        type="text"
                        placeholder="Add a comment..."
                    >

                    <button
                        class="comment-btn"
                        onclick="addComment('${post._id}')">

                        Post

                    </button>

                    <div id="comments-${post._id}">

                        ${(post.comments || []).map(comment => `

                            <p class="comment">

                                <b>
                                    ${comment.username}
                                </b>

                                ${comment.text}

                            </p>

                        `).join("")}

                    </div>

                </div>

            `;

            postsContainer.appendChild(postDiv);

        });

    } catch (error) {

        console.error("Error loading posts:", error);

    }
}


// =========================
// PROFILE PAGE
// =========================

function showProfile() {

    const savedName =
        localStorage.getItem("profileName");

    if (savedName) {

        const nameElement =
            document.getElementById("profileName");

        if (nameElement) {
            nameElement.innerText = savedName;
        }
    }

    const savedImage =
        localStorage.getItem("profileImage");

    if (savedImage) {

        const profile =
            document.querySelector(".large-profile");

        if (profile) {

            profile.style.backgroundImage =
                `url("${savedImage}")`;

            profile.style.backgroundSize = "cover";
            profile.style.backgroundPosition = "center";
            profile.innerText = "";
        }
    }

    document.querySelector(".stories").style.display = "none";

    document.querySelector(".create-post").style.display = "none";

    document.getElementById("posts").style.display = "none";

    document.getElementById("profilePage").style.display = "block";

    loadProfilePosts();
    loadFollowingCount();
}


// =========================
// HOME PAGE
// =========================

function showHome() {

    document.querySelector(".stories").style.display = "flex";

    document.querySelector(".create-post").style.display = "block";

    document.getElementById("posts").style.display = "block";

    document.getElementById("profilePage").style.display = "none";

    loadPosts();
}


// =========================
// PROFILE POSTS
// =========================

async function loadProfilePosts() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/posts"
        );

        const posts = await response.json();

        const profilePosts =
            document.getElementById("profilePosts");

        if (!profilePosts) {
            return;
        }

        profilePosts.innerHTML = "";

        posts.forEach(post => {

            const item =
                document.createElement("div");

            item.className = "profile-post-item";

            if (post.image) {

                item.innerHTML = `
                    <img
                        src="http://localhost:5000${post.image}"
                        alt="Post"
                    >
                `;

            } else {

                item.innerHTML = `
                    <div class="profile-text-post">
                        ${post.content || "GMinsta Post"}
                    </div>
                `;

            }

            profilePosts.appendChild(item);

        });

    } catch (error) {

        console.error("Profile posts error:", error);

    }
}


// =========================
// EDIT PROFILE
// =========================

function editProfile() {

    const currentName =
        localStorage.getItem("profileName") || "krutika01";

    const name =
        prompt("Enter your name:", currentName);

    if (name && name.trim()) {

        localStorage.setItem(
            "profileName",
            name.trim()
        );

        const profileName =
            document.getElementById("profileName");

        if (profileName) {
            profileName.innerText = name.trim();
        }
    }
}


// =========================
// SHARE PROFILE
// =========================

function shareProfile() {

    const profileUrl =
        window.location.href;

    if (navigator.share) {

        navigator.share({
            title: "GMinsta Profile",
            text: "Check out my GMinsta profile!",
            url: profileUrl
        });

    } else {

        navigator.clipboard.writeText(profileUrl);

        alert("Profile link copied!");

    }
}


// =========================
// ADD PROFILE PHOTO
// =========================

function addProfilePhoto() {

    const input =
        document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = function () {

        if (this.files.length === 0) {
            return;
        }

        const file = this.files[0];

        const reader =
            new FileReader();

        reader.onload = function (e) {

            localStorage.setItem(
                "profileImage",
                e.target.result
            );

            const profile =
                document.querySelector(".large-profile");

            if (profile) {

                profile.style.backgroundImage =
                    `url("${e.target.result}")`;

                profile.style.backgroundSize = "cover";

                profile.style.backgroundPosition =
                    "center";

                profile.innerText = "";
            }

        };

        reader.readAsDataURL(file);

    };

    input.click();
}


// =========================
// LIKE
// =========================

async function likePost(postId) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/posts/like/${postId}`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {
            loadPosts();
        }

    } catch (error) {

        console.error("Like error:", error);

    }
}


// =========================
// COMMENTS
// =========================

function focusComment(postId) {

    const input =
        document.getElementById(`comment-${postId}`);

    if (input) {
        input.focus();
    }
}


async function addComment(postId) {

    const input =
        document.getElementById(`comment-${postId}`);

    if (!input) {
        return;
    }

    const text =
        input.value.trim();

    if (!text) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/posts/comment/${postId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: "krutika01",
                    text: text
                })
            }
        );

        if (response.ok) {

            input.value = "";

            loadPosts();

        }

    } catch (error) {

        console.error("Comment error:", error);

    }
}


// =========================
// DELETE POST
// =========================

async function deletePost(postId) {

    const confirmDelete =
        confirm("Delete this post?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/posts/${postId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Post deleted successfully!");

            await loadPosts();

        } else {

            alert(data.message || "Delete failed.");

        }

    } catch (error) {

        console.error("Delete error:", error);

        alert("Server connection failed.");

    }
}


// =========================
// IMAGE SELECT
// =========================

const imageInput =
    document.getElementById("imageInput");

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            if (this.files.length > 0) {

                document.getElementById(
                    "selectedImage"
                ).innerText =
                    "📸 " + this.files[0].name;

            }

        }
    );

}


// =========================
// LOAD FOLLOWING COUNT
// =========================

async function loadFollowingCount() {

    try {

        const username = "krutika01";

        const response = await fetch(
            `http://localhost:5000/api/users/${username}`
        );

        const user = await response.json();

        if (response.ok) {

            const following =
                document.getElementById("followingCount");

            if (following) {

                following.innerText =
                    user.following.length;

            }

        }

    } catch (error) {

        console.error(
            "Following count error:",
            error
        );

    }
}


// =====================================================
// STORIES — MULTIPLE PHOTO / VIDEO STORIES
// =====================================================

let stories = [];

let currentStoryIndex = 0;

let storyTimer = null;


// =========================
// OPEN ADD STORY
// =========================

function openAddStory() {

    if (stories.length > 0) {

        currentStoryIndex = 0;

        openStoryViewer();

        return;
    }

    const storyInput =
        document.getElementById("storyInput");

    if (storyInput) {

        storyInput.click();

    }

}


// =========================
// HANDLE MULTIPLE STORIES
// =========================

function handleStory(event) {

    const files =
        Array.from(event.target.files);

    if (files.length === 0) {
        return;
    }


    // Remove old object URLs
    stories.forEach(story => {

        URL.revokeObjectURL(story.url);

    });


    // Create new stories
    stories = files.map(file => {

        return {

            url: URL.createObjectURL(file),

            type: file.type,

            name: file.name

        };

    });


    currentStoryIndex = 0;


    // Change Your Story circle
    const storyCircle =
        document.querySelector(".your-story");

    if (storyCircle) {

        storyCircle.innerHTML = `

            <img
                src="${stories[0].url}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:50%;
                "
            >

            <span class="add-story">
                +
            </span>

        `;

    }


    // Allow selecting the same files again later
    event.target.value = "";


    // Start stories
    openStoryViewer();

}


// =========================
// OPEN STORY VIEWER
// =========================

function openStoryViewer() {

    if (stories.length === 0) {
        return;
    }


    const viewer =
        document.getElementById("storyViewer");

    const content =
        document.getElementById("storyContent");

    const progress =
        document.getElementById("storyProgress");


    if (!viewer || !content) {
        return;
    }


    clearTimeout(storyTimer);


    viewer.style.display = "block";


    const currentStory =
        stories[currentStoryIndex];


    // Update progress
    if (progress) {

        const percentage =
            ((currentStoryIndex + 1) / stories.length) * 100;

        progress.style.width =
            percentage + "%";

    }


    // VIDEO STORY
    if (currentStory.type.startsWith("video")) {

        content.innerHTML = `

            <video
                id="currentStoryVideo"
                src="${currentStory.url}"
                autoplay
                playsinline
                controls
            ></video>

        `;


        const video =
            document.getElementById(
                "currentStoryVideo"
            );


        video.onended = function () {

            nextStory();

        };


        video.onerror = function () {

            nextStory();

        };


    }

    // IMAGE STORY
    else {

        content.innerHTML = `

            <img
                src="${currentStory.url}"
                alt="Your Story"
            >

        `;


        // Each photo stays for 5 seconds
        storyTimer = setTimeout(
            function () {

                nextStory();

            },
            5000
        );

    }

}


// =========================
// NEXT STORY
// =========================

function nextStory() {

    clearTimeout(storyTimer);


    if (currentStoryIndex <
        stories.length - 1) {

        currentStoryIndex++;

        openStoryViewer();

    } else {

        closeStory();

    }

}


// =========================
// PREVIOUS STORY
// =========================

function previousStory() {

    clearTimeout(storyTimer);


    if (currentStoryIndex > 0) {

        currentStoryIndex--;

        openStoryViewer();

    }

}


// =========================
// CLOSE STORY
// =========================

function closeStory() {

    clearTimeout(storyTimer);


    const viewer =
        document.getElementById("storyViewer");

    const content =
        document.getElementById("storyContent");


    if (viewer) {

        viewer.style.display = "none";

    }


    if (content) {

        content.innerHTML = "";

    }

}


// =========================
// START APP
// =========================

loadPosts();