var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};

var Init = Backbone.Model.extend({
	initialize: function() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.domElement);
		this.stats.domElement.style.position = "absolute";
		this.stats.domElement.style.top = "0px";
		this.stats.domElement.style.zIndex = 1;

		this.initRenderer();
		this.initStage();

		this.startLogic();

		this.render();
	},

	initRenderer: function() {
		var rendererOptions = {
			antialiasing: false,
			transparent: false,
			resolution: window.devicePixelRatio,
			autoResize: true,
		};
		
		this.renderF = _.bind(this.render, this);
		this.renderer = new PIXI.autoDetectRenderer(1, 1, rendererOptions);
		document.body.appendChild(this.renderer.view);
	},

	initStage: function() {
		this.fullStage = new PIXI.Container();
		this.gameStage = new PIXI.Container();


		// test

		var g = Guis.getSprite("background");
		g.position = {x: Config.width/2, y: Config.height/2};
		this.gameStage.addChild(g);

		var text = Texts.getText("Hello world", {x: Config.width/2, y: 40});
		this.gameStage.addChild(text);

		var player = Guis.getSprite("player");
		player.position = {x: Config.width/2, y: Config.height/2};
		this.gameStage.addChild(player);
		this.player = player;
		this.player.vspeed = 0;

		counter = 0;
		g.interactive = true;
		g.buttonMode = true;
		g.click = g.tap = function() {
			console.log("hey");
			text.text = "Clicked " + counter++;
			player.vspeed = -15;
		}
		// end test


		this.fullStage.addChild(this.gameStage);
		this.onResize();
		window.addEventListener('resize', _.bind(this.onResize, this));
	},

	onResize: function () {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.scale = _.min([this.screenWidth / Config.width, this.screenHeight / Config.height, 2]);
		this.stageWidth = Config.width * this.scale;
		this.stageHeight = Config.height * this.scale;
		
		this.stageX = (this.screenWidth - this.stageWidth) / 2;
		this.stageY = (this.screenHeight - this.stageHeight) / 2;
		
		this.renderer.resize(this.screenWidth, this.screenHeight);

		this.fullStage.mask = new PIXI.Graphics().beginFill().drawRect(this.stageX, this.stageY, this.stageWidth, this.stageHeight);

		this.fullStage.position.x = this.stageX;
		this.fullStage.position.y = this.stageY;
		
		this.fullStage.scale.x = this.fullStage.scale.y = this.scale;
	},

	update: function() {
		// test logic
		this.player.position.y += this.player.vspeed;
		this.player.vspeed += 0.6;
		if (this.player.vspeed > 20) this.player.vspeed = 20;
		if (this.player.position.y < 100) {
			this.player.position.y = 100;
			this.player.vspeed = 0;
		}
		if (this.player.position.y > 600) {
			this.player.position.y = 600;
			this.player.vspeed = 0;
		}
		// end test logic
	},

	startLogic: function() {
		var f = _.bind(this.update, this);
		setInterval(f, 16);
	},

	render: function () {
		if (this.stats) {
			this.stats.begin();
		}

		this.renderer.render(this.fullStage);		
		if (this.stats) {
			this.stats.end();
		}

		requestAnimationFrame(this.renderF);
	},
});

PIXI.loader
	.add("player", "img/player/player.png")
	.add("background", "img/level/background.png")
	.load(function(loader, res) {
		new Init();
	});