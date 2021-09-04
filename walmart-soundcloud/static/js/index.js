// Store the 2 buttons, play and pause
var buttons = {
    play: document.getElementById("btn-play"),
    pause: document.getElementById("btn-pause"),
};

// Create an instance of wave surfer with its configuration
var Spectrum = WaveSurfer.create({
    container: '#audio-spectrum',
    progressColor: "#30bdfc",
    barHeight: 6
});


// Handle Play button
buttons.play.addEventListener("click", function(){
    Spectrum.play();
    // Enable/Disable respectively buttons
    buttons.pause.disabled = false;
    buttons.play.disabled = true;
}, false);

// Handle Pause button
buttons.pause.addEventListener("click", function(){
    Spectrum.pause();
    // Enable/Disable respectively buttons
    buttons.pause.disabled = true;
    buttons.play.disabled = false;
}, false);


// Add a listener to enable the play button once it's ready
Spectrum.on('ready', function () {
    buttons.play.disabled = false;
    let dict = {}; // num_seconds: First letter
    let name_dict = {}; // num_seconds: name
    fetch("http://127.0.0.1:5000/api")
        .then(response => response.json())
        .then(data =>{
            for (let element = 0; element < data.length; element++){
                dict[parseInt(((data[element].time_stamp).split(":")[0]*60)) + parseInt(((data[element].time_stamp).split(":")[1]))] = data[element].name[0];
            }
            for (let element = 0; element < data.length; element++){
                name_dict[parseInt(((data[element].time_stamp).split(":")[0]*60)) + parseInt(((data[element].time_stamp).split(":")[1]))] = data[element].name;
            }
            const ordered = Object.keys(dict).sort().reduce(
                (obj, key) => { 
                  obj[key] = dict[key]; 
                  return obj;
                }, 
                {}
              );
            // console.log(ordered);
            let percent = Spectrum.getDuration()/100;
            let num = (100/percent)/100;
            let wid = (Math.round(num * 100) / 100)-0.005
            let div_parent = document.querySelector(".thumbnails");
            // add thumbnail images
            for (let i = 0; i < Spectrum.getDuration(); i++){
                if (i.toString() in ordered){
                    let text_node = document.createElement('img');
                    text_node.src = "https://edmundcheng221.github.io/img/" + (ordered[i].toLowerCase()).toString() + ".png";
                    text_node.setAttribute("id","overlay")
                    text_node.setAttribute("class", name_dict[i])
                    text_node.style.width = wid + "vw";
                    div_parent.appendChild(text_node);

                }else{
                    let text_node = document.createElement('img');
                    text_node.src = "http://127.0.0.1:5000/static/assets/duck.png";
                    text_node.setAttribute("id","overlay")
                    text_node.setAttribute("class", name_dict[i])
                    text_node.style.width = wid + "vw";
                    div_parent.appendChild(text_node);

                }

            }
        })
    handleMouseHover();
    handleMouseOut()
});

// responsive mode (so when the user resizes the window)
// the spectrum will be still playable
window.addEventListener("resize", function(){
    // Get the current progress according to the cursor position
    var currentProgress = Spectrum.getCurrentTime() / Spectrum.getDuration();
    // Reset graph
    Spectrum.empty();
    Spectrum.drawBuffer();
    // Set original position
    Spectrum.seekTo(currentProgress);
    // Enable/Disable respectively buttons
    buttons.pause.disabled = true;
    buttons.play.disabled = false;
}, false);

// Loading the audio file...
Spectrum.load('../assets/audio.mp3');

// Return 00:00 by default if not playing
// Calculate the time
const time_tracker = (getTime) => {
    if (!getTime) {
        return "00:00";
    }
    let minute = Math.floor(getTime / 60);
    let second = Math.ceil(getTime) % 60;

    return (minute < 10 ? "0" : "") + minute + ":" + (second < 10 ? "0" : "") + second;
}

// update the time as the audio is playing
const timer_start = (e) => {
    if (Spectrum.isPlaying()){
        let timeset = time_tracker(Spectrum.getCurrentTime());
        document.querySelector('.timer').innerHTML = timeset;
    }
}
// audio process continuously fires as the audio plays
Spectrum.on('audioprocess', function () {
    timer_start(false);
})

const showForm = () => {
    document.getElementById("new-post").style.display = "block";
}
// When you want to cancel the new post
const cancel = () => {
    document.getElementById("new-post").style.display = "none";
}

// WHen you begin writing comment
let count = 0;
const begin = () => {
    if (count === 0) {
        let currentTime = document.querySelector(".timer").innerHTML;
        document.querySelector("#timestamp").value = currentTime;
    }
    count++;
}
// Get the comments data
const fetchCommentData = () => {
    fetch("http://127.0.0.1:5000/api")
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++){
                let parent = document.createElement("div");
                parent.setAttribute("id", "name_timestamp");
                let imageNode = document.createElement("span");
                let img = document.createElement('img');
                img.src = data[i].image;
                img.style.width = "20px";
                imageNode.appendChild(img);
                parent.appendChild(imageNode);
                let node = document.createElement("span");
                let elapsed_time_content = data[i].time_ago;
                textContent = data[i].name + " at " + data[i].time_stamp + " posted " + elapsed_time_content;
                node.append(textContent);
                parent.appendChild(node);
                let parentparent = document.querySelector("#comment-data");
                parentparent.appendChild(parent)
                let comment = data[i].message;
                parentparent.append(comment);
            }
        })
}
fetchCommentData();

// when you hover over thumbnail image below the spectrum
const handleMouseHover = () => {

    fetch("http://127.0.0.1:5000/api")
        .then(response => response.json())
        .then(data => {
            let nameAndMessage = {};
            for (item in data) {
                nameAndMessage[data[item].name] = data[item].message;
            }
            for (each in data){
                // console.log(data[each]);
                let el = document.querySelector("." + data[each].name.toString());
                el.addEventListener("mouseover", function(){
                    document.getElementById("author").style.display = "";
                    document.getElementById("author-message").style.display = "";
                    document.getElementById("author").innerHTML = el.className;
                    document.getElementById("author-message").innerHTML = nameAndMessage[el.className];
                });
            }
        })
}

// When the move is not hovering the thumbnail image below spectrum
const handleMouseOut = () => {
    fetch("http://127.0.0.1:5000/api")
        .then(response => response.json())
        .then(data => {
            let nameAndMessage = {};
            for (item in data) {
                nameAndMessage[data[item].name] = data[item].message;
            }
            for (each in data){
                document.querySelector("." + data[each].name.toString()).addEventListener("mouseout", function(){
                    document.getElementById("author").style.display = "none";
                    document.getElementById("author-message").style.display = "none";
                })
            }
        })

    
}