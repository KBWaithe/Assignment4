/* 
Name + ID: Kris Waithe - 300637474
Project: Assignment 4 - Slot Machine 
Webside: Slot Machine 
Functionality for the slot machine
*/

(function(){
    // Function scoped Variables
    let stage: createjs.Stage;
    let assets: createjs.LoadQueue;
    let slotMachineBackground: Core.GameObject;
    /* Buttons */
    let spinButton: UIObjects.Button;
    let resetButton: UIObjects.Button;
    let quitButton: UIObjects.Button
    let bet100Button: UIObjects.Button;
    let betMaxButton: UIObjects.Button;
    /* Labels */
    let jackPotLabel: UIObjects.Label;
    let creditLabel: UIObjects.Label;
    let winningsLabel: UIObjects.Label;
    let betLabel: UIObjects.Label;
    let leftReel: Core.GameObject;
    let middleReel: Core.GameObject;
    let rightReel: Core.GameObject;
    let betLine: Core.GameObject;
    /* Player data */
    let bet = 0;
    let credits = 1000;
    let winnings = 0;
    let jackpot = 5000;
    let turn = 0;
    let winNumber = 0;
    let lossNumber = 0;
    let winRatio = 0;
    // symbol tallies
    let grapes = 0;
    let bananas = 0;
    let oranges = 0;
    let cherries = 0;
    let bars = 0;
    let bells = 0;
    let sevens = 0;
    let blanks = 0;

    let manifest: Core.Item[] = [
        {id:"background", src:"./Assets/images/background.png"},
        {id:"banana", src:"./Assets/images/banana.gif"},
        {id:"bar", src:"./Assets/images/bar.gif"},
        {id:"bell", src:"./Assets/images/bell.gif"},
        {id:"bet_line", src:"./Assets/images/bet_line.gif"},
        {id:"resetButton", src:"./Assets/images/resetButton.png"},
        {id:"quitButton", src:"./Assets/images/quitButton.png"},
        {id:"bet100Button", src:"./Assets/images/bet100Button.png"},
        {id:"betMaxButton", src:"./Assets/images/betMaxButton.png"},
        {id:"blank", src:"./Assets/images/blank.gif"},
        {id:"cherry", src:"./Assets/images/cherry.gif"},
        {id:"grapes", src:"./Assets/images/grapes.gif"},
        {id:"orange", src:"./Assets/images/orange.gif"},
        {id:"seven", src:"./Assets/images/seven.gif"},
        {id:"spinButton", src:"./Assets/images/spinButton.png"},
    ];   

    // This function triggers first and "Preloads" all the assets
    function Preload()
    {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", Start);

        assets.loadManifest(manifest);
    }

    // This function triggers after everything has been preloaded
    // This function is used for config and initialization
    function Start():void
    {
        console.log("App Started...");
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        stage = new createjs.Stage(canvas);
        createjs.Ticker.framerate = 60; // 60 FPS or 16.667 ms
        createjs.Ticker.on("tick", Update);

        stage.enableMouseOver(20);

        Config.Globals.AssetManifest = assets;

        Main();
    }

    // called every frame
    function Update():void
    {
        stage.update();
    }

    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value:number, lowerBounds:number, upperBounds:number):number | boolean {
        if (value >= lowerBounds && value <= upperBounds)
        {
            return value;
        }
        else {
            return !value;
        }
    }

    function resetFruitTally():void
    {
        grapes = 0;
        bananas = 0;
        oranges = 0;
        cherries = 0;
        bars = 0;
        bells = 0;
        sevens = 0;
        blanks = 0;
    }
    /* Resets the game back to default settings */
    function resetAll():void
    {
        bet = 0;
        credits = 1000;
        winnings = 0;
        jackpot = 5000;
        turn = 0;
        winNumber = 0;
        lossNumber = 0;
        winRatio = 0;
    }

    function jackpotWin():void
    {
        let jackpotOne = Math.floor(Math.random() * 51 + 1);
        let jackpotTwo = Math.floor(Math.random() * 51 + 1);
        if (jackpotOne == jackpotTwo)
        {
            alert("Winner Winner Chicken Dinner!");
            credits += jackpot;
            jackpot = 5000;
        }
    }

    function showWinMessage() {
        credits += winnings;
        console.log ("You've Won: $" + winnings);
        resetFruitTally();
        jackpotWin();
    }
    
    /* Utility function to show a loss message and reduce player money */
    function showLossMessage() {
        credits -= bet;
        console.log ("You've Lost!");
        resetFruitTally();
    }
    /* When this function is called it determines the betLine results.
    e.g. Bar - Orange - Banana */
    function Reels():string[] {
        let betLine = [" ", " ", " "];
        let outCome = [0, 0, 0];

        for (let spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 65) + 1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37): // 15.4% probability
                    betLine[spin] = "grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46): // 13.8% probability
                    betLine[spin] = "banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54): // 12.3% probability
                    betLine[spin] = "orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59): //  7.7% probability
                    betLine[spin] = "cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62): //  4.6% probability
                    betLine[spin] = "bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64): //  3.1% probability
                    betLine[spin] = "bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65): //  1.5% probability
                    betLine[spin] = "seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }

    function buildInterface():void
    {
        // Slot Machine Background
        slotMachineBackground = new Core.GameObject("background", Config.Screen.CENTER_X, Config.Screen.CENTER_Y, true );
        stage.addChild(slotMachineBackground);

        // Buttons
        spinButton = new UIObjects.Button("spinButton", Config.Screen.CENTER_X + 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(spinButton);

        resetButton = new UIObjects.Button("resetButton", Config.Screen.CENTER_X - 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(resetButton);

        quitButton = new UIObjects.Button("quitButton", Config.Screen.CENTER_X - 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(quitButton);

        bet100Button = new UIObjects.Button("bet100Button", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet100Button);

        betMaxButton = new UIObjects.Button("betMaxButton", Config.Screen.CENTER_X + 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(betMaxButton);

        // Labels START HERE
        jackPotLabel = new UIObjects.Label("5000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 175, true);
        stage.addChild(jackPotLabel);

        creditLabel = new UIObjects.Label("1000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X - 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(creditLabel);

        winningsLabel = new UIObjects.Label("0", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X + 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(winningsLabel);

        betLabel = new UIObjects.Label("0", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(betLabel);

        // Reel GameObjects
        leftReel = new Core.GameObject("bell", Config.Screen.CENTER_X - 79, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(leftReel);

        middleReel = new Core.GameObject("banana", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(middleReel);

        rightReel = new Core.GameObject("bar", Config.Screen.CENTER_X + 78, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(rightReel);

        // Bet Line
        betLine = new Core.GameObject("bet_line", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(betLine);
    }

    function interfaceLogic():void
    {
        spinButton.on("click", ()=>
        {
            // reel test
            let reels = Reels();

            if (bet > credits)
            {
                alert("You don't have enough credits!");
            }
            else if (bet < 0)
            {
                alert("All bets must be a positive number!");
            }
            else if (bet == 0)
            {
                alert("Enter your bet now!")
            }
            else if (bet <= credits)
            {
            // example of how to replace the images in the reels
            leftReel.image = assets.getResult(reels[0]) as HTMLImageElement;
            middleReel.image = assets.getResult(reels[1]) as HTMLImageElement;
            rightReel.image = assets.getResult(reels[2]) as HTMLImageElement;
            determineWinnings();
            turn++;            
            betLabel.text = bet.toString();
            creditLabel.text = credits.toString();
            winningsLabel.text = winnings.toString();
            }
            else
            {
                alert("Please enter a valid bet!")
            }
            jackpotWin();
        
        });

        resetButton.on("click", ()=>{
            console.log("resetButton Button Clicked");
            resetAll();
            betLabel.text = bet.toString();
            creditLabel.text = credits.toString();
            winningsLabel.text = winnings.toString();
        });

        quitButton.on("click", ()=>{
            console.log("quitButton Button Clicked");
            bet = 0;
            winnings = 0;
            credits = 0;
            alert ("Thanks For Playing!")
            betLabel.text = bet.toString();
            creditLabel.text = credits.toString();
            winningsLabel.text = winnings.toString();
        });

        bet100Button.on("click", ()=>{
            console.log("bet100Button Button Clicked");
            bet = 100;
            console.log("Bet is now " + bet);
            betLabel.text = bet.toString();
        });

        betMaxButton.on("click", ()=>{
            console.log("betMaxButton Button Clicked");
            bet = 500;
            console.log("Bet maximum reached, high roller spotted")
            betLabel.text = bet.toString();
        });
    }
    /* Used the data from the slotmachinemaster zip */

    function determineWinnings()
    {
        if (blanks == 0)
        {
            if (grapes == 3) {
                winnings = bet * 10;
            }
            else if(bananas == 3) {
                winnings = bet * 20;
            }
            else if (oranges == 3) {
                winnings = bet * 30;
            }
            else if (cherries == 3) {
                winnings = bet * 40;
            }
            else if (bars == 3) {
                winnings = bet * 50;
            }
            else if (bells == 3) {
                winnings = bet * 75;
            }
            else if (sevens == 3) {
                winnings = bet * 100;
            }
            else if (grapes == 2) {
                winnings = bet * 2;
            }
            else if (bananas == 2) {
                winnings = bet * 2;
            }
            else if (oranges == 2) {
                winnings = bet * 3;
            }
            else if (cherries == 2) {
                winnings = bet * 4;
            }
            else if (bars == 2) {
                winnings = bet * 5;
            }
            else if (bells == 2) {
                winnings = bet * 10;
            }
            else if (sevens == 2) {
                winnings = bet * 20;
            }
            else if (sevens == 1) {
                winnings = bet * 5;
            }
            else {
                winnings = bet * 1;
            }
            winNumber++;           
            showWinMessage();
        } 
        else 
        {   
            lossNumber++;         
            showLossMessage();                   
        }
    }

    // app logic goes here
    function Main():void
    {
        buildInterface();

        interfaceLogic();
       
    }

    window.addEventListener("load", Preload);
})();