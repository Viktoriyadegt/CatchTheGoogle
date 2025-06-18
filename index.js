import {Controller} from "./controller/controller.js";
import {View} from "./view/view.js";
import {ShogunNumberUtility} from "./model/shogun-number-utility.js";
import {Game} from "./model/game.js";

const view = new View()
const  numberUtil = new ShogunNumberUtility()
const game = new Game(numberUtil)
const controller = new Controller(view, game);
controller.init()