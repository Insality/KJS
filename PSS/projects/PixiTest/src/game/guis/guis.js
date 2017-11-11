Guis = {
	getTexture: function(textureName) {
		return PIXI.loader.resources[textureName].texture;
	},

	getSprite: function(spriteName) {
		var sprite = new PIXI.Sprite(Guis.getTexture(spriteName));
		sprite.anchor.set(0.5);
		return sprite;

	},
}