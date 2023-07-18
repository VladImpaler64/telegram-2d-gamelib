'use strict';
// (function(){
	const mapa = new Image();
	mapa.src = '../Imagenes/mapa2Beland.png'; //<--

	mapa.addEventListener("load", (_)=>{

		console.time("listo")


		const foreground = new Image();
		foreground.src = '../Imagenes/ninjamap.png';
		const player = new Image();
		player.src = '../Imagenes/PastorNew1.png'; //<--

		const playerSettings = { //<--
			"x":0,
			"y":0,
			"altura":64,
			"paso":1,
			"off":1,
			"cbx": {
				"up":48,
				"down":64,
				"left":24,
				"right":40,
			}

		}

		const movimiento = {
			"ArrowUp": false,
			"ArrowDown": false,
			"ArrowLeft": false,
			"ArrowRight": false
		}

		const canvas = document.querySelector('canvas');
		canvas.style = `width: ${384}px`; // Sólo puede estirarse en cantidades exactas con respecto al width del mapa, es recomendable usar imágenes pequeñas.
			const CANVAS_WIDTH = canvas.width = canvas.clientWidth * Math.trunc(devicePixelRatio); // Acá es donde tienes que darle el tamaño que quieres
		const CANVAS_HEIGHT = canvas.height = canvas.width;
		const ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
		ctx.scale(Math.trunc(devicePixelRatio), Math.trunc(devicePixelRatio));

		const pad = document.querySelector(".pad");
		if(innerHeight > innerWidth) pad.style = `width: ${innerWidth > 384 ? 384 : innerWidth}px;`;
		const action = document.querySelector(".action");
		action.style = `height: ${action.clientWidth * 2}px`;

		const colisiones = [ // <--
			0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 73, 73,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 73, 73,
			0, 0, 0, 0, 0, 0, 73, 0, 0, 73, 73, 73,
			0, 0, 0, 0, 0, 0, 73, 73, 73, 73, 73, 73,
			0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0,
			0, 0, 0, 73, 73, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			73, 73, 73, 73, 73, 73, 73, 73, 0, 73, 73, 73,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 73, 73, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];

		const settings = {
			"box": mapa.width / Math.sqrt(colisiones.length),
			"row": Math.sqrt(colisiones.length),
		}

		let i = 0;  
		let mapaColisiones = [];

		while (i < colisiones.length){

			mapaColisiones.push(colisiones.slice(i, i + settings.row)); // Se modifica el corte dependiendo del ancho del ancho
			i += settings.row;
		}

		let [frameX, frameY, gameFrame, slowmotion] = [0, 0, 0, 8];

		window.mobileCheck = function() {
			let check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		};

		let [keyDown, keyMove, keyUp] = window.mobileCheck() ? ['touchstart', 'touchmove', 'touchend'] : ['keydown', 'mousemove', 'keyup'];

		let win = false;
		const move = ()=>{

			if(movimiento.ArrowUp) {
				if(playerSettings.y <= -playerSettings.cbx.up){
					return;}
				if(mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.up-playerSettings.off)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.left)/settings.box)] === 73 || mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.up-playerSettings.off)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.right-playerSettings.off)/settings.box)] === 73){
					;
				} else {
					playerSettings.y-=playerSettings.paso;
				}
			}

			if(movimiento.ArrowDown){
				if(playerSettings.y + playerSettings.altura >= mapa.height){
					return;}
				if(mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.down)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.left)/settings.box)] === 73 || mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.down)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.right-playerSettings.off)/settings.box)] === 73){
					;
				} else {
					playerSettings.y+=playerSettings.paso;
				}
			}

			if(movimiento.ArrowLeft){
				if(playerSettings.x <= -playerSettings.cbx.left){
					return;}
				if(mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.up)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.left-playerSettings.off)/settings.box)] === 73 || mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.down-playerSettings.off)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.left-playerSettings.off)/settings.box)] === 73){
					;
				} else {
					playerSettings.x-=playerSettings.paso;
				}
			}

			if(movimiento.ArrowRight){
				if(playerSettings.x + playerSettings.altura >= mapa.width + playerSettings.cbx.left){
					return;}
				if(mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.up)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.right)/settings.box)] === 73 || mapaColisiones[Math.trunc((playerSettings.y+playerSettings.cbx.down-playerSettings.off)/settings.box)][Math.trunc((playerSettings.x+playerSettings.cbx.right)/settings.box)] === 73){
					;
				} else {
					playerSettings.x+=playerSettings.paso;
				}
			}
		};

		document.addEventListener(keyDown, (e)=>{
			let codigo = e.code ? e.code : e.target.className;

			if(codigo !== 'ArrowUp' && codigo !== 'ArrowDown' && codigo !== 'ArrowLeft' && codigo !== 'ArrowRight' && codigo !== 'Space' && codigo !== 'A' && codigo !== 'B') return;
			e.preventDefault();
			// movimiento["ArrowUp"] = false;
			// movimiento["ArrowDown"] = false;
			// movimiento["ArrowLeft"] = false;
			// movimiento["ArrowRight"] = false;

			switch (codigo) {
				case 'ArrowUp':
					movimiento.ArrowUp = true;
					// frameX = 1;
					break;
				case 'ArrowDown':
					movimiento.ArrowDown = true;
					// frameX = 0;
					break;
				case 'ArrowLeft':
					movimiento.ArrowLeft = true;
					// frameX = 3;
					break;
				case 'ArrowRight':
					movimiento.ArrowRight = true;
					// frameX = 2;
					break;
				case 'A':
					if (document.fullscreenElement === null) {
						document.querySelector("*").requestFullscreen();
						screen.orientation.lock("portrait");
					} else {
						document.exitFullscreen()
					}
					break;
				case 'B':
					alert("cool")

					break;
				case 'Space':

					if(!ctx.imageSmoothingEnabled){

						ctx.imageSmoothingEnabled = true;
						ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
						ctx.drawImage(mapa, 0, 0, mapa.width, mapa.height, 0, 0, mapa.width, mapa.width);
						ctx.drawImage(player, frameX * playerSettings.altura, frameY * playerSettings.altura, playerSettings.altura, playerSettings.altura, playerSettings.x, playerSettings.y, playerSettings.altura, playerSettings.altura);
					} else {

						ctx.imageSmoothingEnabled = false;
						// canvas.setAttribute('image-rendering', 'crisp-edges');
						ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
						ctx.drawImage(mapa, 0, 0, mapa.width, mapa.height, 0, 0, mapa.width, mapa.width);
						ctx.drawImage(player, frameX * playerSettings.altura, frameY * playerSettings.altura, playerSettings.altura, playerSettings.altura, playerSettings.x, playerSettings.y, playerSettings.altura, playerSettings.altura);
					}
					break;
				default:
					break;
			}
		});

		document.addEventListener(keyUp, (e)=>{
			movimiento[e.code ? e.code : e.target.className] = false;
		})

		const renderLoop = ()=>{
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			ctx.drawImage(mapa, 0, 0, mapa.width, mapa.height, 0, 0, mapa.width, mapa.width);
			// sorted render
			ctx.drawImage(player, frameX * playerSettings.altura, frameY * playerSettings.altura, playerSettings.altura, playerSettings.altura, playerSettings.x, playerSettings.y, playerSettings.altura, playerSettings.altura);
			if(!win) {
				move();
			}
			// if (gameFrame % slowmotion === 0) { 
				//     if (frameY < 7) { // Control de los frames
					//         frameY++;
					//     } else {
						//         frameY = 0;
						//     };
				// };

			// gameFrame++;

			ctx.drawImage(foreground, 0, 0, foreground.width, foreground.height, 0, 0, foreground.width, foreground.width);
			window.requestAnimationFrame(renderLoop);
		};


		renderLoop();
		console.timeEnd("listo");



		// Fullscreen
		// let fullscreen = (e)=>{
			//     if(!document.fullscreenElement){
				//         document.querySelector('html').requestFullscreen();
				//     } else {
					//         document.exitFullscreen();
					//     }
			// };

		// addEventListener("click", fullscreen);
		// document.querySelector('html').addEventListener("fullscreenchange", (e)=>{
			//     console.log('Luego le sigues')
			// })
	});
// }());
