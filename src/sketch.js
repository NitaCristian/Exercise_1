let playButton;
let pauseButton;
let stopButton;
let skipEnd;
let skipStart;
let loopButton;
let recordButton;
let loadButton;

let player;
let isLooping = false;

let mic;
let recorder;
let isRecording = false;

let soundFilter;
let reverb;
let compressor;
let distortion;

let filterType = 'lowpass';
let filterSelect;

let volumeSlider;
let cutoffSlider;
let resonanceSlider;
let dryWetSlider;
let outputLevelSlider;

function preload() {
    player = loadSound('assets/song.mp3', loaded, loadError);
}

function loaded() {
    console.log("Audio file loaded successfully!");
}

function loadError(event) {
    console.error("Error loading the audio file:", event);
}

function setup() {
    createCanvas(400, 400);

    playButton = createButton('play');
    playButton.position(20, 20);
    playButton.mousePressed(playSound);

    pauseButton = createButton('pause');
    pauseButton.position(100, 20);
    pauseButton.mousePressed(pauseSound);

    stopButton = createButton('stop');
    stopButton.position(180, 20);
    stopButton.mousePressed(stopSound);

    skipEnd = createButton('skipEnd');
    skipEnd.position(260, 20);
    skipEnd.mousePressed(skipToEnd);

    skipStart = createButton('skipStart');
    skipStart.position(20, 60);
    skipStart.mousePressed(skipToStart);

    loopButton = createButton('loop');
    loopButton.position(100, 60);
    loopButton.mousePressed(toggleLoop);

    recordButton = createButton('record');
    recordButton.position(180, 60);
    recordButton.mousePressed(startRecording);

    loadButton = createButton('load');
    loadButton.position(260, 60);
    loadButton.mousePressed(loadCustomSound);


    mic = new p5.AudioIn();
    mic.start();

    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);

    volumeSlider = createSlider(0, 1, 0.5, 0.01);
    volumeSlider.position(20, 120);
    volumeSlider.input(changeVolume);

    player.setVolume(volumeSlider.value());

    filterSelect = createSelect();
    filterSelect.position(20, 180);
    filterSelect.option('lowpass');
    filterSelect.option('highpass');
    filterSelect.option('bandpass');
    filterSelect.option('lowshelf');
    filterSelect.option('highshelf');
    filterSelect.option('peaking');
    filterSelect.option('notch');
    filterSelect.option('allpass');
    filterSelect.changed(updateFilter);

    cutoffSlider = createSlider(0, 22050, 22050, 1);
    cutoffSlider.position(20, 240);
    cutoffSlider.input(updateFilterParams);

    resonanceSlider = createSlider(0, 20, 1, 0.1);
    resonanceSlider.position(20, 280);
    resonanceSlider.input(updateFilterParams);

    dryWetSlider = createSlider(0, 1, 0.5, 0.01);
    dryWetSlider.position(20, 320);
    dryWetSlider.input(updateDryWetFilter);

    outputLevelSlider = createSlider(0, 1, 0.5, 0.01);
    outputLevelSlider.position(20, 360);
    outputLevelSlider.input(updateOutputLevelFilter);

    soundFilter = new p5.Filter();
    reverb = new p5.Reverb();
    compressor = new p5.Compressor();
    distortion = new p5.Distortion();

    player.disconnect();
    player.connect(soundFilter);
    reverb.process(soundFilter, 3, 2);
//    soundFilter.connect();
}

function playSound() {
    if (!player.isPlaying()) {
        player.play();
    }
}

function pauseSound() {
    if (player.isPlaying()) {
        player.pause();
    }
}

function stopSound() {
    player.stop();
}

function skipToStart() {
    if (player.isPlaying()) {
        player.stop();
    }
    player.jump(0);
    player.play();
}

function skipToEnd() {
    if (player.isPlaying()) {
        player.stop();
    }
    const duration = player.duration();
    player.jump(duration);
    player.play();
}


function toggleLoop() {
    isLooping = !isLooping;
    player.setLoop(isLooping);
}

function startRecording() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    if (!isRecording) {
        isRecording = true;
        player = new p5.SoundFile();
        recorder.record(player);
        recordButton.html('stop recording');
    } else {
        isRecording = false;
        recorder.stop();
        recordButton.html('record');
    }
}

function loadCustomSound() {
    let fileInput = createFileInput(handleFile);
    fileInput.attribute('accept', 'audio/*');
    fileInput.position(-width, -height);
    fileInput.elt.click();
}

function handleFile(file) {
    if (file.type === 'audio') {
        player = loadSound(file, loaded, loadError);
    } else {
        console.error("Invalid file type. Please select an audio file.");
    }
}

function changeVolume() {
    player.setVolume(volumeSlider.value());
}

function updateFilter() {
    const selectedFilterType = filterSelect.value();
    soundFilter.setType(selectedFilterType);
}

function updateFilterParams() {
    soundFilter.set(cutoffSlider.value(), resonanceSlider.value());
}

function updateDryWetFilter() {
    soundFilter.drywet(dryWetSlider.value());
}

function updateOutputLevelFilter() {
    soundFilter.amp(outputLevelSlider.value());
}

function draw() {
    background(255, 0, 100);
}
